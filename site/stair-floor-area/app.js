const cases = [
  {
    number: 1,
    short: "壁・通常床",
    title: "両面が壁で囲まれている階段",
    hasVoid: false,
    side: "wall",
    sideLabel: "壁",
    included: true,
    application: "階段の両面に壁があり、階段部分は壁で囲まれた上階床の内側にあります。",
  },
  {
    number: 2,
    short: "腰壁・通常床",
    title: "片面が腰壁手すりの階段",
    hasVoid: false,
    side: "waist",
    sideLabel: "腰壁手すり",
    included: true,
    application: "吹抜けはなく、腰壁手すりは壁の用をなす区画として扱われます。",
  },
  {
    number: 3,
    short: "格子・通常床",
    title: "片面が格子手すりの階段",
    hasVoid: false,
    side: "grid",
    sideLabel: "格子手すり",
    included: true,
    application: "格子手すりは壁の用をなしませんが、隣接部分は吹抜けではなく上階の床です。",
  },
  {
    number: 4,
    short: "壁・吹抜け",
    title: "吹抜けに接し、両面が壁の階段",
    hasVoid: true,
    side: "wall",
    sideLabel: "壁",
    included: true,
    application: "吹抜けに接していますが、その間は壁で区画され、階段部分は吹抜けと一体ではありません。",
  },
  {
    number: 5,
    short: "腰壁・吹抜け",
    title: "吹抜けに接し、片面が腰壁の階段",
    hasVoid: true,
    side: "waist",
    sideLabel: "腰壁手すり",
    included: true,
    application: "吹抜けとの間に、壁の用をなす腰壁手すりがあります。階段部分は吹抜けと区画されています。",
  },
  {
    number: 6,
    short: "格子・吹抜け",
    title: "吹抜けに接し、片面が格子手すりの階段",
    hasVoid: true,
    side: "grid",
    sideLabel: "格子手すり",
    included: false,
    application: "格子手すりは壁の用をなさず、壁のない階段部分は隣接する吹抜けと一体として扱われます。",
  },
];

let mode = "observe";
let currentIndex = 0;
let answered = false;
const exploreConditions = { hasVoid: true, side: "waist" };

const byId = (id) => document.getElementById(id);
const elements = {
  observeMode: byId("observe-mode-button"),
  quizMode: byId("quiz-mode-button"),
  exploreSelector: byId("explore-selector"),
  quizSelector: byId("quiz-selector"),
  voidToggle: byId("void-toggle"),
  sideControls: document.querySelector(".side-controls"),
  tabs: byId("case-tabs"),
  progress: byId("progress"),
  kicker: byId("case-kicker"),
  title: byId("case-title"),
  voidBadge: byId("void-badge"),
  floorPlan: byId("floor-plan"),
  stairSide: byId("stair-side"),
  sideLabel: byId("side-label"),
  adjacentZone: byId("adjacent-zone"),
  adjacentLabel: byId("adjacent-label"),
  adjacentNote: byId("adjacent-note"),
  answerEyebrow: byId("answer-eyebrow"),
  answerTitle: byId("answer-title"),
  answerButtons: byId("answer-buttons"),
  feedback: byId("feedback"),
  verdict: byId("verdict"),
  result: byId("result"),
  rule: byId("rule-text"),
  application: byId("application-text"),
  conclusion: byId("conclusion-text"),
  next: byId("next-button"),
};

function makeTabs() {
  cases.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "case-tab";
    button.setAttribute("role", "tab");
    button.dataset.index = String(index);

    const number = document.createElement("strong");
    number.textContent = `事例${item.number}`;
    const label = document.createElement("small");
    label.textContent = item.short;
    button.append(number, label);

    button.addEventListener("click", () => selectCase(index));
    button.addEventListener("keydown", handleTabKeydown);
    elements.tabs.append(button);
  });
}

function handleTabKeydown(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();

  let target = currentIndex;
  if (event.key === "ArrowLeft") target = (currentIndex - 1 + cases.length) % cases.length;
  if (event.key === "ArrowRight") target = (currentIndex + 1) % cases.length;
  if (event.key === "Home") target = 0;
  if (event.key === "End") target = cases.length - 1;
  selectCase(target, true);
}

function getExplorationCase() {
  return cases.find(
    (item) => item.hasVoid === exploreConditions.hasVoid && item.side === exploreConditions.side,
  );
}

function renderDiagram(item, revealResult) {
  elements.voidBadge.textContent = item.hasVoid ? "吹抜けあり" : "吹抜けなし";
  elements.sideLabel.textContent = item.sideLabel;
  elements.stairSide.className = `stair-side stair-side--${item.side}`;
  elements.adjacentZone.classList.toggle("is-void", item.hasVoid);
  elements.adjacentZone.classList.toggle("counted-zone", !item.hasVoid);
  elements.adjacentLabel.textContent = item.hasVoid ? "吹抜" : "上階床";
  elements.adjacentNote.textContent = item.hasVoid ? "床なし" : "床が続く";
  elements.floorPlan.classList.toggle("is-revealed", revealResult);
  elements.floorPlan.classList.toggle("is-included", revealResult && item.included);
  elements.floorPlan.setAttribute(
    "aria-label",
    `2階平面の模式図。${item.hasVoid ? "吹抜けあり" : "吹抜けなし"}、階段脇は${item.sideLabel}。`,
  );
}

function showExplanation(item, verdict) {
  elements.verdict.textContent = verdict;
  elements.result.textContent = item.included
    ? "階段部分は上階床面積に算入します。"
    : "階段部分は上階床面積に算入しません。";
  elements.rule.textContent = item.hasVoid
    ? "壁などで囲まれた部分を算入し、吹抜け部分は例外的に算入しません。"
    : "壁などで囲まれた部分を床面積に算入するのが基本です。";
  elements.application.textContent = item.application;
  elements.conclusion.textContent = item.included
    ? "階段部分は吹抜けと一体ではないため、原則どおり算入します。"
    : "階段部分は吹抜けと一体となるため、不算入です。";
  elements.feedback.hidden = false;
}

function renderExploration() {
  const item = getExplorationCase();
  elements.kicker.textContent = "現在の条件";
  elements.title.textContent = item.hasVoid
    ? `吹抜けあり・${item.sideLabel}`
    : `吹抜けなし・${item.sideLabel}`;
  elements.answerEyebrow.textContent = "LIVE RESULT";
  elements.answerTitle.textContent = "条件に応じた判定";
  elements.answerButtons.hidden = true;
  elements.next.hidden = true;
  renderDiagram(item, true);
  showExplanation(item, item.included ? "現在の判定｜算入" : "現在の判定｜不算入");
}

function resetQuizAnswer() {
  answered = false;
  elements.feedback.hidden = true;
  elements.next.hidden = true;
  [...elements.answerButtons.children].forEach((button) => {
    button.disabled = false;
    button.setAttribute("aria-pressed", "false");
  });
}

function renderQuiz() {
  const item = cases[currentIndex];
  elements.progress.textContent = `事例 ${item.number} / ${cases.length}`;
  elements.kicker.textContent = `事例${item.number}`;
  elements.title.textContent = item.title;
  elements.answerEyebrow.textContent = "YOUR DECISION";
  elements.answerTitle.textContent = "階段部分を上階床面積へ算入する？";
  elements.answerButtons.hidden = false;
  elements.next.textContent = currentIndex === cases.length - 1 ? "事例1に戻る ↺" : "次の事例へ →";
  renderDiagram(item, answered);

  [...elements.tabs.children].forEach((tab, index) => {
    const selected = index === currentIndex;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function selectMode(nextMode) {
  mode = nextMode;
  const isObserve = mode === "observe";
  elements.observeMode.setAttribute("aria-pressed", String(isObserve));
  elements.quizMode.setAttribute("aria-pressed", String(!isObserve));
  elements.exploreSelector.hidden = !isObserve;
  elements.quizSelector.hidden = isObserve;

  if (isObserve) {
    renderExploration();
  } else {
    resetQuizAnswer();
    renderQuiz();
  }
}

function selectCase(index, focusTab = false) {
  currentIndex = index;
  resetQuizAnswer();
  renderQuiz();
  if (focusTab) elements.tabs.children[index].focus();
}

function answer(value) {
  if (answered || mode !== "quiz") return;
  answered = true;
  const item = cases[currentIndex];
  const selectedIncluded = value === "include";
  const isCorrect = selectedIncluded === item.included;

  [...elements.answerButtons.children].forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-pressed", String(button.dataset.answer === value));
  });
  elements.next.hidden = false;
  renderDiagram(item, true);
  showExplanation(item, isCorrect ? "○ 正解" : "× もう一度、区画に注目");
}

elements.observeMode.addEventListener("click", () => selectMode("observe"));
elements.quizMode.addEventListener("click", () => selectMode("quiz"));

elements.voidToggle.addEventListener("change", () => {
  exploreConditions.hasVoid = elements.voidToggle.checked;
  renderExploration();
});

elements.sideControls.addEventListener("change", (event) => {
  if (event.target.name !== "stair-side") return;
  exploreConditions.side = event.target.value;
  renderExploration();
});

elements.answerButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-answer]");
  if (button) answer(button.dataset.answer);
});

elements.next.addEventListener("click", () => {
  selectCase((currentIndex + 1) % cases.length);
  elements.tabs.children[currentIndex].focus();
});

makeTabs();
selectMode("observe");
