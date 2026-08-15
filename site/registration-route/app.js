const scenarios = window.registrationRouteScenarios;

if (!Array.isArray(scenarios) || scenarios.length === 0) {
  throw new Error("論点データを読み込めませんでした。");
}

let currentScenarioId = scenarios[0].id;
let currentStep = 0;

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

function render() {
  const scenario = getCurrentScenario();
  const state = scenario.steps[currentStep];
  const stepTotal = scenario.steps.length - 1;
  const sidePanel = scenario.sidePanel || (scenario.outcomes
    ? { title: scenario.outcomeTitle || "処分の種類", items: scenario.outcomes }
    : null);

  elements.stepLabel.textContent = `STEP ${currentStep} / ${stepTotal}`;
  elements.scenarioSummary.textContent = scenario.summary;
  elements.scenarioPosition.textContent = `全${scenarios.length}論点`;
  elements.title.textContent = state.title;
  elements.memoryBadge.hidden = !state.isMemory;
  elements.mapPanel.classList.remove("is-memory-flash");
  if (state.isMemory) {
    void elements.mapPanel.offsetWidth;
    elements.mapPanel.classList.add("is-memory-flash");
  }
  elements.explanation.innerHTML = `
    <p class="conclusion">${state.conclusion}</p>
    <p>${state.detail}</p>
  `;

  elements.associationKicker.textContent = scenario.associationKicker;
  elements.associationLabel.textContent = scenario.associationLabel;
  const personLines = state.personLines || scenario.personLines;
  elements.personKicker.textContent = state.personKicker || scenario.personKicker;
  elements.personLine1.textContent = personLines[0];
  elements.personLine2.textContent = personLines[1];
  const routeConditions = {
    ...(scenario.routeConditions || {}),
    ...(state.routeConditions || {}),
  };
  document.querySelectorAll("[data-label]").forEach((label) => {
    const routeName = label.dataset.label;
    const routeLabel = state.routeLabels?.[routeName] || scenario.routeLabels?.[routeName] || "";
    label.textContent = routeConditions[routeName]
      ? `条件付き｜${routeConditions[routeName]}`
      : routeLabel;
  });
  elements.inactiveNote.textContent = scenario.inactiveNote;
  elements.lawScenarioTitle.textContent = scenario.title;
  elements.lawBasis.textContent = scenario.lawBasis;

  const showOldAssociation = scenario.id === "transfer" && scenario.showOldAssociation;
  setSvgHidden(elements.oldAssociation, !showOldAssociation);
  setSvgHidden(elements.oldNoticeRoute, !showOldAssociation);
  setSvgHidden(elements.oldNoticeLabel, !showOldAssociation);
  setSvgHidden(elements.gazette, !scenario.showGazette);
  setSvgHidden(elements.reviewBoard, !scenario.showReviewBoard);
  setSvgHidden(elements.court, !scenario.showCourt);
  setSvgHidden(elements.outcomePanel, !sidePanel || !state.showSidePanel);
  elements.outcomeTitle.textContent = sidePanel?.title || "";
  elements.outcomeLines.forEach((line, index) => {
    line.textContent = sidePanel?.items[index] ? `・${sidePanel.items[index]}` : "";
  });

  const activeNodes = state.activeNodes || [];
  const activeRoutes = state.activeRoutes || [];
  const conditionalRoutes = activeRoutes.filter((route) => routeConditions[route]);
  setActiveItems("[data-node]", activeNodes, "is-active");
  setActiveItems("[data-node]", state.completeNodes || [], "is-complete");
  setActiveItems("[data-node]", state.retiredNodes || [], "is-retired");
  setActiveItems("[data-route]", activeRoutes, "is-active");
  setActiveItems("[data-label]", activeRoutes, "is-active");
  setActiveItems("[data-route]", conditionalRoutes, "is-conditional");
  setActiveItems("[data-label]", conditionalRoutes, "is-conditional");
  elements.conditionalRouteLegend.hidden = conditionalRoutes.length === 0;

  elements.back.disabled = currentStep === 0;
  elements.next.hidden = currentStep === stepTotal;
  elements.next.textContent = state.next;
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

buildScenarioSelector();
render();
