(function exposeCancellationLogic(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CancellationThirdPartyLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createCancellationLogic() {
  function resolveAdvancedOutcome({ timing, cIsProtected, dIsProtected, winner }) {
    if (timing === "before") {
      if (cIsProtected && dIsProtected) return { code: "both_routes", protectedParty: "D", route: "C・Dの両方", subjectiveStateDecisive: true };
      if (cIsProtected) return { code: "via_c", protectedParty: "D", route: "Cからの承継", subjectiveStateDecisive: true };
      if (dIsProtected) return { code: "via_d", protectedParty: "D", route: "D自身", subjectiveStateDecisive: true };
      return { code: "no_route", protectedParty: "A", route: "なし", subjectiveStateDecisive: true };
    }

    return {
      code: winner === "a" ? "a_registered_first" : "d_registered_first",
      protectedParty: winner === "a" ? "A" : "D",
      route: "登記の先後",
      subjectiveStateDecisive: false,
    };
  }

  function readUrlState(search, lastSteps) {
    const params = new URLSearchParams(search);
    const scenario = params.get("scenario") === "after" ? "after" : "before";
    const lastStep = lastSteps[scenario];
    const parsedStep = Number.parseInt(params.get("step") || "0", 10);
    const step = Number.isInteger(parsedStep) ? Math.min(Math.max(parsedStep, 0), lastStep) : 0;
    const allowedResults = scenario === "before" ? ["protected", "unprotected"] : ["a", "c"];
    const resultValue = params.get("result");
    const result = step === lastStep && allowedResults.includes(resultValue) ? resultValue : null;

    return {
      scenario,
      step,
      result,
      advancedOpen: result !== null && params.get("advanced") === "1",
      dTiming: params.get("dTiming") === "after" ? "after" : "before",
      cIsProtected: params.get("cState") !== "unprotected",
      dIsProtected: params.get("dState") !== "unprotected",
      advancedWinner: params.get("dWinner") === "a" ? "a" : "d",
    };
  }

  function buildUrlSearch(state) {
    const params = new URLSearchParams();
    params.set("scenario", state.scenario);
    params.set("step", String(state.step));
    if (state.result) params.set("result", state.result);
    if (state.advancedOpen) params.set("advanced", "1");
    if (state.advancedOpen) {
      params.set("dTiming", state.dTiming);
      params.set("cState", state.cIsProtected ? "protected" : "unprotected");
      params.set("dState", state.dIsProtected ? "protected" : "unprotected");
      if (state.dTiming === "after") params.set("dWinner", state.advancedWinner);
    }
    return `?${params.toString()}`;
  }

  return { resolveAdvancedOutcome, readUrlState, buildUrlSearch };
});
