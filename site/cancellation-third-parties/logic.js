/**
 * @typedef {"before" | "after"} ScenarioKey
 * @typedef {"protected" | "unprotected" | "a" | "c" | null} ScenarioResult
 * @typedef {"a" | "d"} AdvancedWinner
 * @typedef {"both_routes" | "via_c" | "via_d" | "no_route" | "a_registered_first" | "d_registered_first"} AdvancedOutcomeCode
 */

/**
 * @typedef {Object} AdvancedOutcome
 * @property {AdvancedOutcomeCode} code 判定結果を識別するコード
 * @property {"A" | "D"} protectedParty 最終的に優先される者
 * @property {string} route 保護または優先の根拠となるルート
 * @property {boolean} subjectiveStateDecisive 善意・無過失が結論を左右するか
 */

/**
 * @typedef {Object} LessonState
 * @property {ScenarioKey} scenario 表示中の基本事例
 * @property {number} step 表示中のステップ番号
 * @property {ScenarioResult} result 基本事例で選択された結論
 * @property {boolean} advancedOpen 発展問題を開いているか
 * @property {ScenarioKey} dTiming Dが取消し前・後のどちらに登場するか
 * @property {boolean} cIsProtected Cが善意・無過失か
 * @property {boolean} dIsProtected Dが善意・無過失か
 * @property {AdvancedWinner} advancedWinner 取消し後の発展問題で先に登記した者
 */

/**
 * @typedef {Object} CancellationLogicApi
 * @property {(input: {timing: ScenarioKey, cIsProtected: boolean, dIsProtected: boolean, winner: AdvancedWinner}) => AdvancedOutcome} resolveAdvancedOutcome 発展問題の結論を返す
 * @property {(search: string, lastSteps: Record<ScenarioKey, number>) => LessonState} readUrlState URLから教材の状態を復元する
 * @property {(state: LessonState) => string} buildUrlSearch 教材の状態をクエリ文字列へ変換する
 */

/**
 * 判定ロジックをブラウザーとCommonJSの両方へ公開する。
 *
 * @param {typeof globalThis} root 公開先となるグローバルオブジェクト
 * @param {() => CancellationLogicApi} factory 公開APIを生成する関数
 * @returns {void}
 */
(function exposeCancellationLogic(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CancellationThirdPartyLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this,
/**
 * 教材で共有する副作用のない判定・URL変換ロジックを生成する。
 *
 * @returns {CancellationLogicApi} 判定ロジックの公開API
 */
function createCancellationLogic() {
  /**
   * CからDへの転売を含む発展問題の結論を判定する。
   *
   * @param {Object} input 判定に必要な状態
   * @param {ScenarioKey} input.timing Dが取消し前・後のどちらに登場するか
   * @param {boolean} input.cIsProtected Cが善意・無過失か
   * @param {boolean} input.dIsProtected Dが善意・無過失か
   * @param {AdvancedWinner} input.winner 取消し後の事例で先に登記した者
   * @returns {AdvancedOutcome} 保護される者とその根拠
   */
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

  /**
   * URLのクエリ文字列を検証し、教材で利用できる状態へ復元する。
   *
   * @param {string} search `?`から始まるクエリ文字列
   * @param {Record<ScenarioKey, number>} lastSteps 各基本事例の最終ステップ番号
   * @returns {LessonState} 不正値を既定値へ補正した教材の状態
   */
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

  /**
   * 教材の現在状態を共有用のクエリ文字列へ変換する。
   *
   * @param {LessonState} state URLへ保存する教材の状態
   * @returns {string} `?`から始まるクエリ文字列
   */
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
