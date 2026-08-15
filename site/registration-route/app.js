const scenarios = window.registrationRouteScenarios;

if (!Array.isArray(scenarios) || scenarios.length === 0) {
  throw new Error("論点データを読み込めませんでした。");
}

let currentScenarioId = scenarios[0].id;
let currentStep = 0;

const byId = (id) => document.getElementById(id);
const elements = {
  scenarioSwitch: byId("scenario-switch"),
  stepLabel: byId("step-label"),
  title: byId("lab-title"),
  explanation: byId("explanation"),
  next: byId("next-button"),
  back: byId("back-button"),
  reset: byId("reset-button"),
  memoryBadge: byId("memory-badge"),
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

function selectScenario(scenarioId) {
  currentScenarioId = scenarioId;
  currentStep = 0;

  elements.scenarioSwitch.querySelectorAll("button").forEach((button) => {
    const isSelected = button.dataset.scenario === scenarioId;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  render();
}

function buildScenarioSelector() {
  scenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    const title = document.createElement("strong");
    const summary = document.createElement("span");

    button.type = "button";
    button.dataset.scenario = scenario.id;
    button.setAttribute("aria-pressed", String(index === 0));
    button.classList.toggle("is-selected", index === 0);
    title.textContent = scenario.title;
    summary.textContent = scenario.summary;
    button.append(title, summary);
    button.addEventListener("click", () => selectScenario(scenario.id));
    elements.scenarioSwitch.append(button);
  });
}

function render() {
  const scenario = getCurrentScenario();
  const state = scenario.steps[currentStep];
  const stepTotal = scenario.steps.length - 1;
  const sidePanel = scenario.sidePanel || (scenario.outcomes
    ? { title: scenario.outcomeTitle || "処分の種類", items: scenario.outcomes }
    : null);

  elements.stepLabel.textContent = `STEP ${currentStep} / ${stepTotal}`;
  elements.title.textContent = state.title;
  elements.memoryBadge.hidden = !state.isMemory;
  elements.explanation.innerHTML = `
    <p class="conclusion">${state.conclusion}</p>
    <p>${state.detail}</p>
  `;

  elements.associationKicker.textContent = scenario.associationKicker;
  elements.associationLabel.textContent = scenario.associationLabel;
  elements.personKicker.textContent = scenario.personKicker;
  elements.personLine1.textContent = scenario.personLines[0];
  elements.personLine2.textContent = scenario.personLines[1];
  document.querySelectorAll("[data-label]").forEach((label) => {
    const routeName = label.dataset.label;
    label.textContent = state.routeLabels?.[routeName] || scenario.routeLabels?.[routeName] || "";
  });
  elements.inactiveNote.textContent = scenario.inactiveNote;
  elements.lawScenarioTitle.textContent = scenario.title;
  elements.lawBasis.textContent = scenario.lawBasis;

  elements.oldAssociation.hidden = !scenario.showOldAssociation;
  elements.oldNoticeRoute.hidden = !scenario.showOldAssociation;
  elements.oldNoticeLabel.hidden = !scenario.showOldAssociation;
  elements.gazette.hidden = !scenario.showGazette;
  elements.reviewBoard.hidden = !scenario.showReviewBoard;
  elements.court.hidden = !scenario.showCourt;
  elements.outcomePanel.hidden = !sidePanel;
  elements.outcomeTitle.textContent = sidePanel?.title || "";
  elements.outcomeLines.forEach((line, index) => {
    line.textContent = sidePanel?.items[index] ? `・${sidePanel.items[index]}` : "";
  });

  const activeNodes = state.activeNodes || [];
  const activeRoutes = state.activeRoutes || [];
  setActiveItems("[data-node]", activeNodes, "is-active");
  setActiveItems("[data-node]", state.completeNodes || [], "is-complete");
  setActiveItems("[data-node]", state.retiredNodes || [], "is-retired");
  setActiveItems("[data-route]", activeRoutes, "is-active");
  setActiveItems("[data-label]", activeRoutes, "is-active");

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

buildScenarioSelector();
render();
