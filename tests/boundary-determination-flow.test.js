const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const directory = path.join(__dirname, "../site/boundary-determination-flow");
const indexSource = fs.readFileSync(path.join(directory, "index.html"), "utf8");
const scenarioSource = fs.readFileSync(path.join(directory, "scenarios.js"), "utf8");
const urlStateSource = fs.readFileSync(path.join(directory, "url-state.js"), "utf8");
const appSource = fs.readFileSync(path.join(directory, "app.js"), "utf8");
const styleSource = fs.readFileSync(path.join(directory, "style.css"), "utf8");
const context = { window: {}, URLSearchParams };
vm.runInNewContext(scenarioSource, context);
vm.runInNewContext(urlStateSource, context);

const scenarios = context.window.boundaryDeterminationScenarios;
const urlState = context.window.boundaryDeterminationUrlState;
const allowedNodes = new Set(["applicant", "registrar", "commissioner", "related"]);
const allowedRoutes = new Set([
  "application",
  "notice",
  "investigation",
  "commissioner-opinion",
  "related-submission",
  "applicant-submission",
  "survey-notice-applicant",
  "survey-notice-related",
  "hearing-notice-applicant",
  "hearing-notice-related",
  "hearing-statement-applicant",
  "hearing-statement-related",
  "role-conflict",
  "result-notice-applicant",
  "result-notice-related",
  "result-publication",
  "court-record-request",
  "judgment-conflict",
  "prepayment-order",
  "prepayment",
  "rejection-result",
  "fact-request-applicant",
  "fact-request-related",
  "agency-cooperation",
  "determination",
]);
const allowedAux = new Set([
  "target-land",
  "determination-result",
  "commissioner-note",
  "applicant-note",
  "bureau-chief",
  "gazette",
  "court",
  "court-divider",
  "role-warning",
  "co-owner-example",
  "agency",
]);

test("固定ノードは資格名ではなく4つの制度上のロールである", () => {
  const nodes = [...indexSource.matchAll(/data-node=["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(new Set(nodes), allowedNodes);
  assert.doesNotMatch(indexSource, /data-node=["'][^"']*(?:surveyor|調査士資格)/);
});

test("基本フローと追加7論点を収録する", () => {
  assert.equal(scenarios.length, 8);
  assert.equal(new Set(scenarios.map((scenario) => scenario.id)).size, 8);
  assert.deepEqual(
    [...scenarios.map((scenario) => scenario.id)],
    [
      "basic-flow",
      "procedural-safeguards",
      "role-separation",
      "result-notification",
      "court-route",
      "prepayment-rejection",
      "applicant-related-roles",
      "investigation-powers",
    ],
  );
});

test("全経路と補助ノードをSVGに定義している", () => {
  for (const route of allowedRoutes) {
    assert.match(indexSource, new RegExp(`data-route=["']${route}["']`), route);
  }
  for (const aux of allowedAux) {
    assert.match(indexSource, new RegExp(`data-aux=["']${aux}["']`), aux);
  }
});

test("全ストーリーが表示情報と完成段階を持つ", () => {
  for (const scenario of scenarios) {
    assert.ok(scenario.title, scenario.id);
    assert.ok(scenario.summary, scenario.id);
    assert.ok(scenario.caption, scenario.id);
    assert.ok(scenario.steps.length >= 3, scenario.id);
    assert.equal(scenario.steps.at(-1).next, "", scenario.id);
    for (const step of scenario.steps) {
      assert.ok(step.title, scenario.id);
      assert.ok(step.conclusion, `${scenario.id}: ${step.title}`);
      assert.ok(step.reason, `${scenario.id}: ${step.title}`);
      assert.ok(step.basis, `${scenario.id}: ${step.title}`);
    }
  }
});

test("段階データは既知のノード・経路・補助表示だけを参照する", () => {
  for (const scenario of scenarios) {
    for (const aux of scenario.visibleAux || []) assert.ok(allowedAux.has(aux), `${scenario.id}: ${aux}`);
    for (const step of scenario.steps) {
      for (const node of [...(step.activeNodes || []), ...(step.completeNodes || [])]) {
        assert.ok(allowedNodes.has(node), `${scenario.id}: ${node}`);
      }
      for (const route of [...(step.activeRoutes || []), ...(step.completeRoutes || []), ...(step.conditionalRoutes || [])]) {
        assert.ok(allowedRoutes.has(route), `${scenario.id}: ${route}`);
      }
      for (const aux of step.activeAux || []) assert.ok(allowedAux.has(aux), `${scenario.id}: ${aux}`);
    }
  }
});

test("土地家屋調査士と法務局職員は属性として表示する", () => {
  assert.match(indexSource, /代理人：土地家屋調査士等/);
  assert.match(indexSource, /土地家屋調査士・弁護士等の専門家/);
  assert.match(indexSource, /補助する法務局職員/);
});

test("裁判所を基本ダイヤモンドのノードにせず別ルートとする", () => {
  assert.doesNotMatch(indexSource, /data-node=["']court["']/);
  assert.match(indexSource, /data-aux=["']court["']/);
  assert.match(indexSource, /独立した別ルート/);
  assert.match(scenarioSource, /上級審ではありません/);
});

test("段階表示とアクセシビリティの要件を持つ", () => {
  assert.match(appSource, /STEP \$\{currentStep\}/);
  assert.match(scenarioSource, /不動産登記法148条/);
  assert.match(indexSource, /aria-live=["']polite["']/);
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
});

test("URLからストーリーと段階を復元し、安全な範囲へ丸める", () => {
  assert.deepEqual(
    { ...urlState.parse("?story=court-route&step=2", scenarios) },
    { scenarioIndex: 4, step: 2 },
  );
  assert.deepEqual(
    { ...urlState.parse("?story=unknown&step=99", scenarios) },
    { scenarioIndex: 0, step: 6 },
  );
  assert.deepEqual(
    { ...urlState.parse("?story=role-separation&step=-4", scenarios) },
    { scenarioIndex: 2, step: 0 },
  );
});

test("共有用URLへストーリーと段階を保存する", () => {
  assert.equal(
    urlState.build("?ref=study", "investigation-powers", 3),
    "?ref=study&story=investigation-powers&step=3",
  );
  assert.match(appSource, /popstate/);
  assert.match(indexSource, /url-state\.js[\s\S]*app\.js/);
});

test("教材のJavaScriptに構文エラーがない", () => {
  assert.doesNotThrow(() => new vm.Script(scenarioSource));
  assert.doesNotThrow(() => new vm.Script(urlStateSource));
  assert.doesNotThrow(() => new vm.Script(appSource));
});
