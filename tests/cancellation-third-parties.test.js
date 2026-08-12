const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  resolveAdvancedOutcome,
  readUrlState,
  buildUrlSearch,
} = require("../site/cancellation-third-parties/logic.js");

test("取消し前のC・D全組合せで保護ルートが決まる", () => {
  const cases = [
    [true, true, "both_routes", "D"],
    [true, false, "via_c", "D"],
    [false, true, "via_d", "D"],
    [false, false, "no_route", "A"],
  ];

  for (const [cIsProtected, dIsProtected, code, protectedParty] of cases) {
    const outcome = resolveAdvancedOutcome({ timing: "before", cIsProtected, dIsProtected, winner: "d" });
    assert.equal(outcome.code, code);
    assert.equal(outcome.protectedParty, protectedParty);
    assert.equal(outcome.subjectiveStateDecisive, true);
  }
});

test("取消し後はC・Dの善意無過失によらず登記先行者が決まる", () => {
  for (const cIsProtected of [true, false]) {
    for (const dIsProtected of [true, false]) {
      const aWins = resolveAdvancedOutcome({ timing: "after", cIsProtected, dIsProtected, winner: "a" });
      const dWins = resolveAdvancedOutcome({ timing: "after", cIsProtected, dIsProtected, winner: "d" });
      assert.equal(aWins.protectedParty, "A");
      assert.equal(dWins.protectedParty, "D");
      assert.equal(aWins.subjectiveStateDecisive, false);
      assert.equal(dWins.subjectiveStateDecisive, false);
    }
  }
});

test("URL状態を復元できる", () => {
  const state = readUrlState(
    "?scenario=after&step=5&result=c&advanced=1&dTiming=after&cState=unprotected&dState=protected&dWinner=a",
    { before: 5, after: 5 },
  );
  assert.deepEqual(state, {
    scenario: "after",
    step: 5,
    result: "c",
    advancedOpen: true,
    dTiming: "after",
    cIsProtected: false,
    dIsProtected: true,
    advancedWinner: "a",
  });
});

test("不正なURL状態は安全な範囲へ丸める", () => {
  const state = readUrlState("?scenario=other&step=99&result=c&advanced=1", { before: 5, after: 5 });
  assert.equal(state.scenario, "before");
  assert.equal(state.step, 5);
  assert.equal(state.result, null);
  assert.equal(state.advancedOpen, false);
});

test("表示状態を共有用クエリーへ変換する", () => {
  const search = buildUrlSearch({
    scenario: "before",
    step: 5,
    result: "protected",
    advancedOpen: true,
    dTiming: "before",
    cIsProtected: true,
    dIsProtected: false,
    advancedWinner: "d",
  });
  assert.equal(search, "?scenario=before&step=5&result=protected&advanced=1&dTiming=before&cState=protected&dState=unprotected");
});

test("キーボード操作と動き抑制に必要なHTML・CSSを維持する", () => {
  const root = path.resolve(__dirname, "../site/cancellation-third-parties");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

  const staticButtons = [...html.matchAll(/<button\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(staticButtons.length > 0);
  assert.ok(staticButtons.every((button) => /type="button"/.test(button)));
  assert.match(app, /type="button"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.play-button \{ display: none; \}/);
});
