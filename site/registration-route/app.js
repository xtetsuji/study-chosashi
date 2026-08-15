const scenarios = window.registrationRouteScenarios;
const quizRoutes = window.registrationRouteQuizData?.routes;

if (!Array.isArray(scenarios) || scenarios.length === 0) {
  throw new Error("論点データを読み込めませんでした。");
}
if (!quizRoutes || Object.keys(quizRoutes).length === 0) {
  throw new Error("クイズ用の経路データを読み込めませんでした。");
}

let currentScenarioId = scenarios[0].id;
let currentStep = 0;
let currentMode = "learning";
let quizQuestions = [];
let currentQuizIndex = 0;
let quizCorrectCount = 0;

const byId = (id) => document.getElementById(id);
const elements = {
  scenarioSelect: byId("scenario-select"),
  scenarioSummary: byId("scenario-summary"),
  scenarioPosition: byId("scenario-position"),
  stepLabel: byId("step-label"),
  title: byId("lab-title"),
  explanation: byId("explanation"),
  next: byId("next-button"),
  back: byId("back-button"),
  reset: byId("reset-button"),
  memoryBadge: byId("memory-badge"),
  learningModeButton: byId("learning-mode-button"),
  quizModeButton: byId("quiz-mode-button"),
  learningActions: byId("learning-actions"),
  quizActions: byId("quiz-actions"),
  quizScore: byId("quiz-score"),
  quizNext: byId("quiz-next-button"),
  quizPanel: byId("quiz-panel"),
  quizQuestion: byId("quiz-question"),
  quizOptions: byId("quiz-options"),
  quizFeedback: byId("quiz-feedback"),
  mapPanel: document.querySelector(".map-panel"),
  conditionalRouteLegend: byId("conditional-route-legend"),
  associationKicker: byId("association-kicker"),
  associationLabel: byId("association-label"),
  personKicker: byId("person-kicker"),
  personLine1: byId("person-label-line1"),
  personLine2: byId("person-label-line2"),
  oldAssociation: document.querySelector("[data-node='old-association']"),
  oldNoticeRoute: document.querySelector("[data-route='old-notice']"),
  oldNoticeLabel: document.querySelector("[data-label='old-notice']"),
  gazette: document.querySelector("[data-node='gazette']"),
  outcomePanel: byId("outcome-panel"),
  outcomeTitle: byId("outcome-title"),
  outcomeLines: [
    byId("outcome-line-1"),
    byId("outcome-line-2"),
    byId("outcome-line-3"),
    byId("outcome-line-4"),
  ],
  reviewBoard: document.querySelector("[data-node='review-board']"),
  court: document.querySelector("[data-node='court']"),
  inactiveNote: byId("inactive-note"),
  lawScenarioTitle: byId("law-scenario-title"),
  lawBasis: byId("law-basis"),
};

function getCurrentScenario() {
  return scenarios.find((scenario) => scenario.id === currentScenarioId);
}

function setActiveItems(selector, activeNames, className) {
  document.querySelectorAll(selector).forEach((item) => {
    const name = item.dataset.node || item.dataset.route || item.dataset.label;
    item.classList.toggle(className, activeNames.includes(name));
  });
}

function setSvgHidden(element, hidden) {
  element.toggleAttribute("hidden", hidden);
}

function selectScenario(scenarioId) {
  currentScenarioId = scenarioId;
  currentStep = 0;
  elements.scenarioSelect.value = scenarioId;

  render();
}

function buildScenarioSelector() {
  const categoryOrder = ["登録", "調査士会", "懲戒", "法人"];

  categoryOrder.forEach((category) => {
    const categoryScenarios = scenarios.filter((scenario) => scenario.category === category);
    if (categoryScenarios.length === 0) return;

    const group = document.createElement("optgroup");
    group.label = category;
    categoryScenarios.forEach((scenario) => {
      const option = document.createElement("option");
      option.value = scenario.id;
      option.textContent = scenario.title;
      group.append(option);
    });
    elements.scenarioSelect.append(group);
  });

  elements.scenarioSelect.value = currentScenarioId;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function getRouteConditions(scenario, state) {
  return {
    ...(scenario.routeConditions || {}),
    ...(state.routeConditions || {}),
  };
}

function getRouteLabel(scenario, state, route) {
  const condition = getRouteConditions(scenario, state)[route];
  if (condition) return `条件付き｜${condition}`;
  return state.routeLabels?.[route] || scenario.routeLabels?.[route] || "";
}

function buildQuizQuestions() {
  const allRoutes = Object.keys(quizRoutes);

  return shuffle(scenarios).map((scenario) => {
    const finalState = scenario.steps.at(-1);
    const candidateRoutes = finalState.activeRoutes.filter((route) => quizRoutes[route]);
    const answerRoute = shuffle(candidateRoutes)[0];
    const otherRoutes = shuffle(
      allRoutes.filter((route) => !candidateRoutes.includes(route)),
    );

    return {
      scenario,
      state: finalState,
      answerRoute,
      choices: shuffle([answerRoute, ...otherRoutes].slice(0, 3)),
      selectedRoute: null,
    };
  });
}

function startQuizSession() {
  quizQuestions = buildQuizQuestions();
  currentQuizIndex = 0;
  quizCorrectCount = 0;
}

function setMode(mode) {
  currentMode = mode;
  currentStep = 0;
  if (mode === "quiz") startQuizSession();
  render();
}

function renderQuizOptions(question) {
  const answered = question.selectedRoute !== null;
  elements.quizQuestion.textContent = `「${question.scenario.title}」の完成図に含まれる経路はどれですか？`;
  elements.quizOptions.replaceChildren();

  question.choices.forEach((route, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "quiz-option";
    option.disabled = answered;
    option.dataset.route = route;

    const isCorrect = route === question.answerRoute;
    const isSelected = route === question.selectedRoute;
    if (answered && isCorrect) option.classList.add("is-correct");
    if (answered && isSelected && !isCorrect) option.classList.add("is-wrong");

    const resultLabel = answered && isCorrect
      ? "（正解）"
      : answered && isSelected
        ? "（あなたの回答）"
        : "";
    option.textContent = `${String.fromCharCode(65 + index)}. ${quizRoutes[route].choice}${resultLabel}`;
    option.addEventListener("click", () => answerQuiz(route));
    elements.quizOptions.append(option);
  });

  if (!answered) {
    elements.quizFeedback.textContent = "回答すると、正しい経路を図上で点灯します。";
  } else {
    const correct = question.selectedRoute === question.answerRoute;
    elements.quizFeedback.textContent = `${correct ? "正解です。" : "不正解です。"} ${getRouteLabel(
      question.scenario,
      question.state,
      question.answerRoute,
    )}は「${quizRoutes[question.answerRoute].choice}」です。`;
  }
}

function render() {
  const isQuiz = currentMode === "quiz";
  const quizQuestion = isQuiz ? quizQuestions[currentQuizIndex] : null;
  if (quizQuestion) currentScenarioId = quizQuestion.scenario.id;

  const scenario = getCurrentScenario();
  const state = isQuiz ? scenario.steps.at(-1) : scenario.steps[currentStep];
  const stepTotal = scenario.steps.length - 1;
  const quizAnswered = quizQuestion?.selectedRoute !== null;
  const sidePanel = scenario.sidePanel || (scenario.outcomes
    ? { title: scenario.outcomeTitle || "処分の種類", items: scenario.outcomes }
    : null);

  elements.learningModeButton.classList.toggle("is-active", !isQuiz);
  elements.learningModeButton.setAttribute("aria-pressed", String(!isQuiz));
  elements.quizModeButton.classList.toggle("is-active", isQuiz);
  elements.quizModeButton.setAttribute("aria-pressed", String(isQuiz));
  elements.learningActions.hidden = isQuiz;
  elements.quizActions.hidden = !isQuiz;
  elements.quizPanel.hidden = !isQuiz;
  elements.explanation.hidden = isQuiz;
  elements.scenarioSelect.disabled = isQuiz;

  elements.stepLabel.textContent = isQuiz
    ? `QUIZ ${currentQuizIndex + 1} / ${quizQuestions.length}`
    : `STEP ${currentStep} / ${stepTotal}`;
  elements.scenarioSummary.textContent = isQuiz && !quizAnswered
    ? "完成図を思い出し、三つの候補から含まれる経路を一つ選びます。"
    : scenario.summary;
  elements.scenarioPosition.textContent = isQuiz
    ? `全${quizQuestions.length}問`
    : `全${scenarios.length}論点`;
  elements.scenarioSelect.value = scenario.id;
  elements.title.textContent = isQuiz ? scenario.title : state.title;
  elements.memoryBadge.hidden = isQuiz || !state.isMemory;
  elements.mapPanel.classList.remove("is-memory-flash");
  if (!isQuiz && state.isMemory) {
    void elements.mapPanel.offsetWidth;
    elements.mapPanel.classList.add("is-memory-flash");
  }
  if (!isQuiz) {
    elements.explanation.innerHTML = `
      <p class="conclusion">${state.conclusion}</p>
      <p>${state.detail}</p>
    `;
  }

  elements.associationKicker.textContent = scenario.associationKicker;
  elements.associationLabel.textContent = scenario.associationLabel;
  const personLines = state.personLines || scenario.personLines;
  elements.personKicker.textContent = state.personKicker || scenario.personKicker;
  elements.personLine1.textContent = personLines[0];
  elements.personLine2.textContent = personLines[1];
  const routeConditions = getRouteConditions(scenario, state);
  document.querySelectorAll("[data-label]").forEach((label) => {
    const routeName = label.dataset.label;
    label.textContent = getRouteLabel(scenario, state, routeName);
  });
  elements.inactiveNote.textContent = isQuiz
    ? "回答後に正しい経路を点灯します"
    : scenario.inactiveNote;
  elements.lawScenarioTitle.textContent = scenario.title;
  elements.lawBasis.textContent = scenario.lawBasis;

  const showOldAssociation = scenario.id === "transfer" && scenario.showOldAssociation;
  setSvgHidden(elements.oldAssociation, !showOldAssociation);
  setSvgHidden(elements.oldNoticeRoute, !showOldAssociation);
  setSvgHidden(elements.oldNoticeLabel, !showOldAssociation);
  setSvgHidden(elements.gazette, !scenario.showGazette);
  setSvgHidden(elements.reviewBoard, !scenario.showReviewBoard);
  setSvgHidden(elements.court, !scenario.showCourt);
  setSvgHidden(elements.outcomePanel, isQuiz || !sidePanel || !state.showSidePanel);
  elements.outcomeTitle.textContent = sidePanel?.title || "";
  elements.outcomeLines.forEach((line, index) => {
    line.textContent = sidePanel?.items[index] ? `・${sidePanel.items[index]}` : "";
  });

  const activeNodes = isQuiz
    ? quizAnswered ? quizRoutes[quizQuestion.answerRoute].nodes : []
    : state.activeNodes || [];
  const activeRoutes = isQuiz
    ? quizAnswered ? [quizQuestion.answerRoute] : []
    : state.activeRoutes || [];
  const conditionalRoutes = activeRoutes.filter((route) => routeConditions[route]);
  setActiveItems("[data-node]", activeNodes, "is-active");
  setActiveItems("[data-node]", isQuiz ? [] : state.completeNodes || [], "is-complete");
  setActiveItems("[data-node]", isQuiz ? [] : state.retiredNodes || [], "is-retired");
  setActiveItems("[data-route]", activeRoutes, "is-active");
  setActiveItems("[data-label]", activeRoutes, "is-active");
  setActiveItems("[data-route]", conditionalRoutes, "is-conditional");
  setActiveItems("[data-label]", conditionalRoutes, "is-conditional");
  elements.conditionalRouteLegend.hidden = conditionalRoutes.length === 0;

  elements.back.disabled = currentStep === 0;
  elements.next.hidden = currentStep === stepTotal;
  elements.next.textContent = state.next;

  if (isQuiz) {
    const answeredCount = currentQuizIndex + (quizAnswered ? 1 : 0);
    elements.quizScore.textContent = `正解 ${quizCorrectCount} / 回答 ${answeredCount}`;
    elements.quizNext.disabled = !quizAnswered;
    elements.quizNext.textContent = currentQuizIndex === quizQuestions.length - 1
      ? "もう一周"
      : "次の問題";
    renderQuizOptions(quizQuestion);
  }
}

function answerQuiz(route) {
  const question = quizQuestions[currentQuizIndex];
  if (question.selectedRoute !== null) return;
  question.selectedRoute = route;
  if (route === question.answerRoute) quizCorrectCount += 1;
  render();
  elements.quizNext.focus();
}

elements.next.addEventListener("click", () => {
  const stepTotal = getCurrentScenario().steps.length - 1;
  if (currentStep < stepTotal) currentStep += 1;
  render();
});

elements.back.addEventListener("click", () => {
  if (currentStep > 0) currentStep -= 1;
  render();
});

elements.reset.addEventListener("click", () => {
  currentStep = 0;
  render();
});

elements.scenarioSelect.addEventListener("change", (event) => {
  selectScenario(event.target.value);
});

elements.learningModeButton.addEventListener("click", () => {
  setMode("learning");
});

elements.quizModeButton.addEventListener("click", () => {
  setMode("quiz");
});

elements.quizNext.addEventListener("click", () => {
  if (currentQuizIndex === quizQuestions.length - 1) {
    startQuizSession();
  } else {
    currentQuizIndex += 1;
  }
  render();
  elements.quizOptions.querySelector("button")?.focus();
});

buildScenarioSelector();
render();
