const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../site/registration-route/scenarios.js"),
  "utf8",
);
const context = { window: {} };
vm.runInNewContext(source, context);

const scenarios = context.window.registrationRouteScenarios;
const allowedNodes = new Set([
  "person",
  "association",
  "old-association",
  "federation",
  "bureau",
  "minister",
]);
const allowedRoutes = new Set(["membership", "application", "old-notice"]);

test("論点IDが重複せず、選択表示に必要な情報を持つ", () => {
  assert.ok(Array.isArray(scenarios));
  assert.ok(scenarios.length > 0);
  assert.equal(new Set(scenarios.map((scenario) => scenario.id)).size, scenarios.length);

  for (const scenario of scenarios) {
    assert.ok(scenario.id);
    assert.ok(scenario.title);
    assert.ok(scenario.summary);
    assert.ok(scenario.lawBasis);
    assert.equal(scenario.personLines.length, 2);
    assert.ok(scenario.steps.length >= 2);
  }
});

test("各論点は暗記用の完成図で終わる", () => {
  for (const scenario of scenarios) {
    const finalStep = scenario.steps.at(-1);
    assert.equal(finalStep.isMemory, true, scenario.id);
    assert.equal(finalStep.next, "", scenario.id);
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
      for (const route of step.activeRoutes || []) {
        assert.ok(allowedRoutes.has(route), `${scenario.id}: ${route}`);
      }
    }
  }
});
