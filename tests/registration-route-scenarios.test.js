const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../site/registration-route/scenarios.js"),
  "utf8",
);
const indexSource = fs.readFileSync(
  path.join(__dirname, "../site/registration-route/index.html"),
  "utf8",
);
const context = { window: {} };
vm.runInNewContext(source, context);

const scenarios = context.window.registrationRouteScenarios;
const allowedCategories = new Set(["登録", "調査士会", "懲戒", "法人"]);
const allowedNodes = new Set([
  "person",
  "association",
  "old-association",
  "federation",
  "bureau",
  "minister",
  "gazette",
  "review-board",
  "court",
]);
const allowedRoutes = new Set([
  "membership",
  "application",
  "old-notice",
  "federation-notice",
  "association-report",
  "association-person",
  "association-bureau",
  "association-minister-via-bureau",
  "minister-association-via-bureau",
  "minister-sanction",
  "minister-association-notice",
  "minister-federation-notice",
  "federation-minister",
  "minister-gazette",
  "direct-minister",
  "person-bureau",
  "bureau-investigation",
  "federation-gazette",
  "direct-federation",
  "federation-bureau",
  "court-minister-request",
  "minister-court-opinion",
]);

test("論点IDが重複せず、選択表示に必要な情報を持つ", () => {
  assert.ok(Array.isArray(scenarios));
  assert.ok(scenarios.length > 0);
  assert.equal(new Set(scenarios.map((scenario) => scenario.id)).size, scenarios.length);

  for (const scenario of scenarios) {
    assert.ok(scenario.id);
    assert.ok(scenario.title);
    assert.ok(scenario.summary);
    assert.ok(allowedCategories.has(scenario.category), scenario.id);
    assert.ok(scenario.lawBasis);
    assert.equal(scenario.personLines.length, 2);
    assert.ok(scenario.steps.length >= 2);
  }
});

test("処分一覧は比較欄に収まる三項目である", () => {
  for (const scenario of scenarios.filter((item) => item.outcomes)) {
    assert.equal(scenario.outcomes.length, 3, scenario.id);
    assert.equal(scenario.showGazette, true, scenario.id);
  }
});

test("補足欄は二項目から四項目で要点を示す", () => {
  for (const scenario of scenarios.filter((item) => item.sidePanel)) {
    assert.ok(scenario.sidePanel.title, scenario.id);
    assert.ok(scenario.sidePanel.items.length >= 2, scenario.id);
    assert.ok(scenario.sidePanel.items.length <= 4, scenario.id);
  }
});

test("旧所属会は所属会変更シナリオだけで使用する", () => {
  const scenariosWithOldAssociation = [...scenarios]
    .filter((scenario) => scenario.showOldAssociation)
    .map((scenario) => scenario.id);
  assert.deepEqual(scenariosWithOldAssociation, ["transfer"]);
});

test("補足欄は必要な段階だけに表示し、連合会への直接線を遮らない", () => {
  for (const scenario of scenarios.filter((item) => item.sidePanel || item.outcomes)) {
    assert.ok(scenario.steps.some((step) => step.showSidePanel), scenario.id);
    for (const step of scenario.steps.filter((item) => item.activeRoutes?.includes("direct-federation"))) {
      assert.notEqual(step.showSidePanel, true, `${scenario.id}: ${step.title}`);
    }
  }
});

test("各論点は暗記用の完成図で終わる", () => {
  for (const scenario of scenarios) {
    const finalStep = scenario.steps.at(-1);
    assert.equal(finalStep.isMemory, true, scenario.id);
    assert.equal(finalStep.next, "", scenario.id);
  }
});

test("法人の成立は設立登記を先に、成立届を後に示す", () => {
  const formation = scenarios.find((scenario) => scenario.id === "corporation-formation");
  assert.ok(formation);

  const registrationStep = formation.steps.findIndex((step) =>
    step.activeRoutes?.includes("person-bureau"),
  );
  const filingStep = formation.steps.findIndex((step) =>
    step.activeRoutes?.includes("direct-federation"),
  );

  assert.ok(registrationStep >= 0);
  assert.ok(filingStep > registrationStep);
  assert.deepEqual(
    [...formation.steps[filingStep].activeRoutes],
    ["membership", "direct-federation"],
  );
});

test("追加した制度経路をそれぞれの完成図に含める", () => {
  const expectedRoutes = {
    "registration-appeal": ["federation-notice", "direct-minister"],
    "bylaw-approval-comparison": [
      "association-minister-via-bureau",
      "minister-federation-notice",
      "minister-association-via-bureau",
      "federation-minister",
    ],
    "association-guidance": ["association-person", "association-bureau"],
    "registration-administration-supervision": ["minister-federation-notice"],
    "association-membership-notice": ["association-bureau"],
  };

  for (const [scenarioId, routes] of Object.entries(expectedRoutes)) {
    const scenario = scenarios.find((item) => item.id === scenarioId);
    assert.ok(scenario, scenarioId);
    assert.deepEqual([...scenario.steps.at(-1).activeRoutes], routes, scenarioId);
  }
});

test("シナリオで許可した経路はSVGに定義されている", () => {
  for (const route of allowedRoutes) {
    assert.match(indexSource, new RegExp(`data-route=["']${route}["']`), route);
    assert.match(indexSource, new RegExp(`data-label=["']${route}["']`), route);
  }
});

test("段階データが既知のノードと経路だけを参照する", () => {
  for (const scenario of scenarios) {
    for (const step of scenario.steps) {
      for (const node of [
        ...(step.activeNodes || []),
        ...(step.completeNodes || []),
        ...(step.retiredNodes || []),
      ]) {
        assert.ok(allowedNodes.has(node), `${scenario.id}: ${node}`);
      }
      if (step.personLines) assert.equal(step.personLines.length, 2, scenario.id);
      for (const route of step.activeRoutes || []) {
        assert.ok(allowedRoutes.has(route), `${scenario.id}: ${route}`);
        assert.ok(
          step.routeLabels?.[route] || scenario.routeLabels?.[route],
          `${scenario.id}: ${route} の表示名`,
        );
      }
    }
  }
});
