window.boundaryDeterminationUrlState = {
  parse(search, scenarios) {
    const params = new URLSearchParams(search);
    const requestedScenario = params.get("story");
    const scenarioIndex = Math.max(0, scenarios.findIndex((scenario) => scenario.id === requestedScenario));
    const scenario = scenarios[scenarioIndex];
    const requestedStep = Number.parseInt(params.get("step") || "0", 10);
    const step = Number.isFinite(requestedStep)
      ? Math.min(Math.max(requestedStep, 0), scenario.steps.length - 1)
      : 0;

    return { scenarioIndex, step };
  },

  build(search, scenarioId, step) {
    const params = new URLSearchParams(search);
    params.set("story", scenarioId);
    params.set("step", String(step));
    return `?${params.toString()}`;
  },
};
