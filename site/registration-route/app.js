const modes = {
  registration: {
    stepTotal: 3,
    personKicker: "申請者",
    personLines: ["調査士となる", "資格を有する者"],
    associationKicker: "事務所予定地に対応",
    associationLabel: "調査士会",
    showOldAssociation: false,
    steps: [
      {
        title: "まず、固定配置を確認",
        conclusion: "五つの主体は、場面が変わっても同じ位置にあります。",
        detail: "この登録申請では左側だけを使います。右側の法務局・地方法務局と法務大臣は、薄いまま残ります。",
        activeNodes: [],
        activeRoutes: [],
        next: "入会手続を見る",
      },
      {
        title: "調査士会への入会手続",
        conclusion: "登録申請と同時に、経由する調査士会へ入会する手続をとります。",
        detail: "まだ調査士会の会員になったわけではありません。実際に会員になるのは、連合会による登録の時です。",
        activeNodes: ["person", "association"],
        activeRoutes: ["membership"],
        next: "登録申請を見る",
      },
      {
        title: "調査士会を経由して登録申請",
        conclusion: "登録申請書の提出先は連合会で、所在地に対応する調査士会を経由します。",
        detail: "法務局・地方法務局は、経由する調査士会を決める管轄の基準として登場しますが、申請書の経由先ではありません。",
        activeNodes: ["person", "association", "federation"],
        activeRoutes: ["application"],
        next: "完成図を重ねる",
      },
      {
        title: "この一枚を覚える",
        conclusion: "入会手続と、調査士会を経由する登録申請が一枚につながりました。",
        detail: "調査士会までの二本の線を見分けます。入会手続は調査士会まで、登録申請は調査士会を経由して連合会まで進み、右側は使いません。",
        activeNodes: ["person", "association", "federation"],
        activeRoutes: ["membership", "application"],
        isMemory: true,
        next: "",
      },
    ],
  },
  transfer: {
    stepTotal: 4,
    personKicker: "申請者",
    personLines: ["土地家屋", "調査士"],
    associationKicker: "新事務所所在地に対応",
    associationLabel: "新調査士会",
    showOldAssociation: true,
    steps: [
      {
        title: "新旧二つの調査士会を確認",
        conclusion: "事務所を他の管轄区域へ移すため、所属会も変わります。",
        detail: "三角形の固定位置には、これから所属する新調査士会を置きます。旧所属会は、今回だけ左外側に現れます。",
        activeNodes: [],
        activeRoutes: [],
        next: "同時に行う手続を見る",
      },
      {
        title: "新会への入会手続・旧会への届出",
        conclusion: "新調査士会への入会手続と、旧所属会への届出を行います。",
        detail: "変更登録の申請と同時に新会への入会手続をとり、現に所属する旧会には、その申請をする旨を届け出ます。",
        activeNodes: ["person", "association", "old-association"],
        activeRoutes: ["membership", "old-notice"],
        next: "変更登録申請を見る",
      },
      {
        title: "新調査士会を経由して変更登録申請",
        conclusion: "変更登録申請は、新しい事務所所在地に対応する調査士会を経由します。",
        detail: "旧所属会を経由するのではありません。提出先は連合会で、法務局・地方法務局も経由しません。",
        activeNodes: ["person", "association", "federation"],
        activeRoutes: ["application"],
        next: "変更登録の効果を見る",
      },
      {
        title: "変更登録と同時に所属が切り替わる",
        conclusion: "連合会が変更登録をすると、新会へ入会し、旧会を退会します。",
        detail: "入会・退会の効力が生じる基準時は、事務所を移転した時や申請した時ではなく、変更登録の時です。",
        activeNodes: ["federation", "association"],
        completeNodes: ["association"],
        retiredNodes: ["old-association"],
        activeRoutes: [],
        next: "完成図を重ねる",
      },
      {
        title: "この一枚を覚える",
        conclusion: "旧会への届出、新会への入会手続、新会経由の変更登録申請が一枚につながりました。",
        detail: "経由するのは新調査士会です。連合会による変更登録の時に、新会へ入会し、旧会を退会します。右側は使いません。",
        activeNodes: ["person", "federation"],
        completeNodes: ["association"],
        retiredNodes: ["old-association"],
        activeRoutes: ["membership", "old-notice", "application"],
        isMemory: true,
        next: "",
      },
    ],
  },
};

let currentMode = "registration";
let currentStep = 0;

const byId = (id) => document.getElementById(id);
const elements = {
  stepLabel: byId("step-label"),
  title: byId("lab-title"),
  explanation: byId("explanation"),
  next: byId("next-button"),
  back: byId("back-button"),
  reset: byId("reset-button"),
  memoryBadge: byId("memory-badge"),
  associationKicker: byId("association-kicker"),
  associationLabel: byId("association-label"),
  personKicker: byId("person-kicker"),
  personLine1: byId("person-label-line1"),
  personLine2: byId("person-label-line2"),
  oldAssociation: document.querySelector("[data-node='old-association']"),
  oldNoticeRoute: document.querySelector("[data-route='old-notice']"),
  oldNoticeLabel: document.querySelector("[data-label='old-notice']"),
};

function setActiveItems(selector, activeNames, className) {
  document.querySelectorAll(selector).forEach((item) => {
    const name = item.dataset.node || item.dataset.route || item.dataset.label;
    item.classList.toggle(className, activeNames.includes(name));
  });
}

function render() {
  const mode = modes[currentMode];
  const state = mode.steps[currentStep];

  elements.stepLabel.textContent = `STEP ${currentStep} / ${mode.stepTotal}`;
  elements.title.textContent = state.title;
  elements.memoryBadge.hidden = !state.isMemory;
  elements.explanation.innerHTML = `
    <p class="conclusion">${state.conclusion}</p>
    <p>${state.detail}</p>
  `;

  elements.associationKicker.textContent = mode.associationKicker;
  elements.associationLabel.textContent = mode.associationLabel;
  elements.personKicker.textContent = mode.personKicker;
  elements.personLine1.textContent = mode.personLines[0];
  elements.personLine2.textContent = mode.personLines[1];

  elements.oldAssociation.hidden = !mode.showOldAssociation;
  elements.oldNoticeRoute.hidden = !mode.showOldAssociation;
  elements.oldNoticeLabel.hidden = !mode.showOldAssociation;

  const activeNodes = state.activeNodes || [];
  const activeRoutes = state.activeRoutes || [];
  setActiveItems("[data-node]", activeNodes, "is-active");
  setActiveItems("[data-node]", state.completeNodes || [], "is-complete");
  setActiveItems("[data-node]", state.retiredNodes || [], "is-retired");
  setActiveItems("[data-route]", activeRoutes, "is-active");
  setActiveItems("[data-label]", activeRoutes, "is-active");

  const applicationLabel = document.querySelector("[data-label='application']");
  applicationLabel.textContent =
    currentMode === "registration" ? "登録申請（経由）" : "変更登録申請（経由）";

  elements.back.disabled = currentStep === 0;
  elements.next.hidden = currentStep === mode.stepTotal;
  elements.next.textContent = state.next;
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode;
    currentStep = 0;
    document.querySelectorAll("[data-mode]").forEach((candidate) => {
      const isSelected = candidate === button;
      candidate.classList.toggle("is-selected", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });
    render();
  });
});

elements.next.addEventListener("click", () => {
  if (currentStep < modes[currentMode].stepTotal) currentStep += 1;
  render();
});

elements.back.addEventListener("click", () => {
  if (currentStep > 0) currentStep -= 1;
  render();
});

elements.reset.addEventListener("click", () => {
  currentStep = 0;
  render();
});

render();
