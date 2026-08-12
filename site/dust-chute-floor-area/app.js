const states = {
  inside: {
    title: "設備部分の全部を、各階床面積に算入",
    status: "現在の判定｜各階に算入",
    caption: (equipment) => `${equipment}の全部が外壁線の内側にあります。`,
    conclusion: (equipment) => `全部が内部にあるため、${equipment}部分の全部を各階へ算入します。`,
    planText: "設備部分を算入",
  },
  straddle: {
    title: "張出部分を含む設備全体を、各階床面積に算入",
    status: "現在の判定｜張出部分も含めて各階に算入",
    caption: (equipment) => `${equipment}は建物内部から外壁線の外側へ一部張り出しています。`,
    conclusion: (equipment) => `内部にある${equipment}の一部が外側へ及ぶ場合なので、張出部分を含む設備全体を各階へ算入します。`,
    planText: "張出部分も算入",
  },
  outside: {
    title: "設備部分を各階床面積に算入しない",
    status: "現在の判定｜不算入",
    caption: (equipment) => `${equipment}の全部が外壁線の外側にあります。`,
    conclusion: (equipment) => `全部が建物外側にある${equipment}なので、各階床面積には算入しません。`,
    planText: "設備部分は不算入",
  },
};

const equipmentNames = { chute: "ダストシュート", chimney: "煙突" };
const positions = ["inside", "straddle", "outside"];
const positionLabels = { inside: "全部内部", straddle: "一部張出し", outside: "全部外部" };
let equipment = "chute";
let position = "inside";
let playTimer = null;
let dragPointerId = null;
let dragOffsetX = 0;

const byId = (id) => document.getElementById(id);
const elements = {
  scene: byId("building-scene"),
  shaft: byId("draggable-shaft"),
  plans: byId("floor-plans"),
  shaftLabel: byId("shaft-label"),
  caption: byId("scene-caption"),
  status: byId("result-status"),
  title: byId("state-title"),
  specialRule: byId("special-rule"),
  conclusion: byId("conclusion"),
  play: byId("play-button"),
  equipmentControls: document.querySelectorAll('input[name="equipment"]'),
  positionControls: document.querySelectorAll('input[name="position"]'),
  planTexts: document.querySelectorAll(".mini-plan p"),
};

function render() {
  const state = states[position];
  const name = equipmentNames[equipment];
  elements.scene.dataset.position = position;
  elements.scene.dataset.equipment = equipment;
  elements.plans.dataset.position = position;
  elements.shaftLabel.innerHTML = equipment === "chute" ? "ダスト<br>シュート" : "煙突";
  elements.caption.textContent = state.caption(name);
  elements.status.textContent = state.status;
  elements.title.textContent = state.title;
  elements.specialRule.textContent = `建物内部の${name}は、床がなくても各階床面積へ算入します。`;
  elements.conclusion.textContent = state.conclusion(name);
  elements.planTexts.forEach((text) => { text.textContent = state.planText; });
  elements.scene.setAttribute("aria-label", `3階建物の断面模式図。${name}は${position === "inside" ? "全部内部" : position === "straddle" ? "一部張出し" : "全部外部"}。`);
  elements.shaft.setAttribute("aria-valuenow", String(positions.indexOf(position) + 1));
  elements.shaft.setAttribute("aria-valuetext", positionLabels[position]);
}

function stopPlayback() {
  if (playTimer === null) return;
  window.clearInterval(playTimer);
  playTimer = null;
  elements.play.setAttribute("aria-pressed", "false");
  elements.play.textContent = "▶ 3状態を再生";
}

function selectPosition(nextPosition, stop = true) {
  if (stop) stopPlayback();
  position = nextPosition;
  elements.shaft.style.removeProperty("--drag-left");
  document.querySelector(`input[name="position"][value="${position}"]`).checked = true;
  render();
}

function positionFromLeft(leftPercent) {
  if (leftPercent <= 48) return "inside";
  if (leftPercent >= 67) return "outside";
  return "straddle";
}

function updateDrag(clientX) {
  const sceneRect = elements.scene.getBoundingClientRect();
  const rawLeft = ((clientX - sceneRect.left - dragOffsetX) / sceneRect.width) * 100;
  const leftPercent = Math.min(75, Math.max(45, rawLeft));
  const nextPosition = positionFromLeft(leftPercent);
  elements.shaft.style.setProperty("--drag-left", `${leftPercent}%`);

  if (nextPosition !== position) {
    position = nextPosition;
    document.querySelector(`input[name="position"][value="${position}"]`).checked = true;
    render();
  }
}

function finishDrag(event) {
  if (event.pointerId !== dragPointerId) return;
  if (elements.shaft.hasPointerCapture(event.pointerId)) {
    elements.shaft.releasePointerCapture(event.pointerId);
  }
  dragPointerId = null;
  elements.scene.classList.remove("is-dragging");
  selectPosition(position, false);
}

elements.equipmentControls.forEach((control) => {
  control.addEventListener("change", () => {
    stopPlayback();
    equipment = control.value;
    render();
  });
});

elements.positionControls.forEach((control) => {
  control.addEventListener("change", () => selectPosition(control.value));
});

elements.shaft.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  stopPlayback();
  const shaftRect = elements.shaft.getBoundingClientRect();
  dragPointerId = event.pointerId;
  dragOffsetX = event.clientX - shaftRect.left;
  elements.shaft.setPointerCapture(event.pointerId);
  elements.scene.classList.add("is-dragging");
  elements.shaft.focus({ preventScroll: true });
});

elements.shaft.addEventListener("pointermove", (event) => {
  if (event.pointerId !== dragPointerId) return;
  updateDrag(event.clientX);
});

elements.shaft.addEventListener("pointerup", finishDrag);
elements.shaft.addEventListener("pointercancel", finishDrag);

elements.shaft.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  let nextIndex = positions.indexOf(position);
  if (event.key === "ArrowLeft") nextIndex = Math.max(0, nextIndex - 1);
  if (event.key === "ArrowRight") nextIndex = Math.min(positions.length - 1, nextIndex + 1);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = positions.length - 1;
  selectPosition(positions[nextIndex]);
});

elements.play.addEventListener("click", () => {
  if (playTimer !== null) {
    stopPlayback();
    return;
  }
  elements.play.setAttribute("aria-pressed", "true");
  elements.play.textContent = "■ 再生を止める";
  selectPosition("inside", false);
  playTimer = window.setInterval(() => {
    const nextIndex = (positions.indexOf(position) + 1) % positions.length;
    selectPosition(positions[nextIndex], false);
  }, 1600);
});

render();
