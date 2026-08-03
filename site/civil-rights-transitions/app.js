const states = [
  {
    title: "はじめの状態",
    conclusion: "甲土地はAが所有し、登記名義もAです。",
    detail: "「売買」と「登記」が起きるたびに、表示がどう変わるか見てみましょう。",
    next: "AからBへ売買",
  },
  {
    title: "AからBへの第一売買",
    conclusion: "AとBの合意により、Bが所有権を取得します。",
    detail: "民法176条では、物権の移転は当事者の意思表示だけで効力を生じます。ただし、登記名義はまだAのままです。",
    next: "AからCへも売買",
  },
  {
    title: "AからCへの第二売買",
    conclusion: "BとCのどちらも、まだ所有権移転登記を備えていません。",
    detail: "Bは登記がなければCに取得を対抗できません。この単純化した事例では、先に登記を備えた側が他方へ取得を対抗できます。",
    next: "先に登記する人を選ぶ",
  },
  {
    title: "登記によって対抗関係が決まる",
    conclusion: "",
    detail: "",
    next: "",
  },
];

let step = 0;
let winner = null;

const byId = (id) => document.getElementById(id);
const elements = {
  title: byId("stage-title"),
  stepLabel: byId("step-label"),
  explanation: byId("explanation"),
  registry: byId("registry"),
  ownership: byId("ownership"),
  roleA: byId("role-a"),
  roleB: byId("role-b"),
  roleC: byId("role-c"),
  lineB: byId("line-b"),
  lineC: byId("line-c"),
  parcel: byId("parcel"),
  decision: byId("decision"),
  back: byId("back-button"),
  next: byId("next-button"),
  reset: byId("reset-button"),
  timeline: byId("timeline"),
};

function render() {
  const state = states[step];
  elements.title.textContent = state.title;
  elements.stepLabel.textContent = `STEP ${step} / 3`;
  elements.lineB.classList.toggle("is-visible", step >= 1);
  elements.lineC.classList.toggle("is-visible", step >= 2);
  elements.parcel.dataset.step = String(step);

  elements.roleA.textContent = step === 0 ? "所有者・登記名義人" : "売主・登記名義人";
  elements.roleB.textContent = step === 0 ? "買主候補" : step === 3 && winner === "B" ? "登記を備えた譲受人" : "第一買主";
  elements.roleC.textContent = step < 2 ? "買主候補" : step === 3 && winner === "C" ? "登記を備えた譲受人" : "第二買主";

  if (step === 0) {
    elements.registry.textContent = "登記名義：A";
    elements.ownership.textContent = "所有者：A";
  } else if (step === 1) {
    elements.registry.textContent = "登記名義：A（未移転）";
    elements.ownership.textContent = "Bが売買により取得";
  } else if (step === 2) {
    elements.registry.textContent = "登記名義：A（未移転）";
    elements.ownership.textContent = "B ↔ C　対抗関係を確認";
  } else {
    elements.registry.textContent = `登記名義：${winner}`;
    elements.ownership.textContent = `${winner}が他方へ取得を対抗できる`;
  }

  if (step === 3) {
    const loser = winner === "B" ? "C" : "B";
    elements.explanation.innerHTML = `
      <p class="conclusion">${winner}が先に登記を備え、${loser}へ所有権取得を対抗できます。</p>
      <p>${loser}は登記を備えた${winner}に対し、自分の所有権取得を主張できません。ポイントは売買の早さではなく、第三者との関係では登記が対抗要件になることです。</p>
    `;
  } else {
    elements.explanation.innerHTML = `<p class="conclusion">${state.conclusion}</p><p>${state.detail}</p>`;
  }

  elements.decision.hidden = step !== 2;
  elements.next.hidden = step >= 2;
  elements.next.textContent = state.next;
  elements.back.disabled = step === 0;

  [...elements.timeline.children].forEach((item, index) => {
    item.classList.toggle("is-current", index === step);
    item.classList.toggle("is-past", index < step);
  });
}

elements.next.addEventListener("click", () => {
  if (step < 2) step += 1;
  render();
});

elements.back.addEventListener("click", () => {
  if (step > 0) step -= 1;
  if (step < 3) winner = null;
  render();
});

elements.reset.addEventListener("click", () => {
  step = 0;
  winner = null;
  render();
});

elements.decision.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    winner = button.dataset.winner;
    step = 3;
    render();
    elements.back.focus();
  });
});

render();
