const scenarios = window.boundaryDeterminationScenarios;
const urlState = window.boundaryDeterminationUrlState;

const elements = {
  scenarioSelect: document.querySelector("#scenario-select"),
  scenarioSummary: document.querySelector("#scenario-summary"),
  scenarioPosition: document.querySelector("#scenario-position"),
  title: document.querySelector("#lab-title"),
  stepLabel: document.querySelector("#step-label"),
  next: document.querySelector("#next-button"),
  back: document.querySelector("#back-button"),
  reset: document.querySelector("#reset-button"),
  panel: document.querySelector("#map-panel"),
  caption: document.querySelector("#flow-caption"),
  kicker: document.querySelector("#explanation-kicker"),
  conclusion: document.querySelector("#conclusion"),
  reason: document.querySelector("#reason"),
  basis: document.querySelector("#law-basis"),
  resultLabel: document.querySelector("#result-label"),
};

let currentScenarioIndex = 0;
let currentStep = 0;

function getScenario() {
  return scenarios[currentScenarioIndex];
}

function restoreLocationState() {
  const restored = urlState.parse(window.location.search, scenarios);
  currentScenarioIndex = restored.scenarioIndex;
  currentStep = restored.step;
  elements.scenarioSelect.value = getScenario().id;
}

function updateLocationState(mode = "push") {
  const search = urlState.build(window.location.search, getScenario().id, currentStep);
  const url = `${window.location.pathname}${search}${window.location.hash}`;
  window.history[mode === "replace" ? "replaceState" : "pushState"](null, "", url);
}

function collectRelevantRoutes(scenario) {
  return [...new Set(scenario.steps.flatMap((step) => [
    ...(step.activeRoutes || []),
    ...(step.completeRoutes || []),
  ]))];
}

function setRouteState(step, scenario) {
  const relevantRoutes = collectRelevantRoutes(scenario);
  const activeRoutes = step.activeRoutes || [];
  const completeRoutes = step.completeRoutes || [];
  const conditionalRoutes = step.conditionalRoutes || [];

  document.querySelectorAll("[data-route], [data-label]").forEach((element) => {
    const key = element.dataset.route || element.dataset.label;
    element.classList.toggle("is-relevant", relevantRoutes.includes(key));
    element.classList.toggle("is-active", activeRoutes.includes(key));
    element.classList.toggle("is-complete", completeRoutes.includes(key));
    element.classList.toggle("is-conditional", conditionalRoutes.includes(key));
  });
}

function setNodeState(step) {
  document.querySelectorAll("[data-node]").forEach((element) => {
    const key = element.dataset.node;
    element.classList.toggle("is-active", (step.activeNodes || []).includes(key));
    element.classList.toggle("is-complete", (step.completeNodes || []).includes(key));
  });
}

function setAuxState(step, scenario) {
  const visible = new Set([...(scenario.visibleAux || []), ...(step.activeAux || [])]);
  const active = new Set(step.activeAux || []);

  document.querySelectorAll("[data-aux]").forEach((element) => {
    const key = element.dataset.aux;
    element.toggleAttribute("hidden", !visible.has(key));
    element.classList.toggle("is-visible", visible.has(key));
    element.classList.toggle("is-active", active.has(key));
  });
}

function render() {
  const scenario = getScenario();
  const step = scenario.steps[currentStep];
  const isFinal = currentStep === scenario.steps.length - 1;

  elements.scenarioSummary.textContent = scenario.summary;
  elements.scenarioPosition.textContent = `${currentScenarioIndex + 1} / ${scenarios.length}`;
  elements.title.textContent = step.title;
  elements.stepLabel.textContent = `STEP ${currentStep} / ${scenario.steps.length - 1}`;
  elements.caption.textContent = scenario.caption;
  elements.kicker.textContent = step.kicker;
  elements.conclusion.textContent = step.conclusion;
  elements.reason.textContent = step.reason;
  elements.basis.textContent = step.basis;
  elements.resultLabel.textContent = step.resultLabel || "筆界を特定";
  elements.back.disabled = currentStep === 0;
  elements.next.disabled = isFinal;
  elements.next.textContent = isFinal ? "ストーリー完成" : step.next;

  setNodeState(step);
  setRouteState(step, scenario);
  setAuxState(step, scenario);

  elements.panel.classList.remove("is-complete");
  if (isFinal) requestAnimationFrame(() => elements.panel.classList.add("is-complete"));
}

function buildScenarioSelector() {
  for (const [index, scenario] of scenarios.entries()) {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = `${scenario.category}｜${scenario.title}`;
    option.dataset.index = String(index);
    elements.scenarioSelect.append(option);
  }
}

elements.scenarioSelect.addEventListener("change", (event) => {
  currentScenarioIndex = scenarios.findIndex((scenario) => scenario.id === event.target.value);
  currentStep = 0;
  render();
  updateLocationState();
});

elements.next.addEventListener("click", () => {
  if (currentStep < getScenario().steps.length - 1) currentStep += 1;
  render();
  updateLocationState();
});

elements.back.addEventListener("click", () => {
  if (currentStep > 0) currentStep -= 1;
  render();
  updateLocationState();
});

elements.reset.addEventListener("click", () => {
  currentStep = 0;
  render();
  updateLocationState();
  elements.next.focus();
});

window.addEventListener("popstate", () => {
  restoreLocationState();
  render();
});

buildScenarioSelector();
restoreLocationState();
render();
