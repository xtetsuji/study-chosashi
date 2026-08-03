const scenarios = [
  {
    id: "spouse-and-children",
    category: "基礎",
    title: "配偶者と子どもがいる",
    summary: "もっとも基本的な組合せから、配偶者と子どもたちの法定相続分を確認します。",
    facts: [
      ["被相続人", "正人（まさと）"],
      ["家族", "配偶者・子2人"],
      ["遺言", "なし"],
    ],
    events: [
      { date: "2008", label: "婚姻", note: "正人とみどりは法律上の夫婦です。", changedPeople: ["masato", "midori"] },
      { date: "2013", label: "子ども", note: "春と葵の2人の子がいます。", changedPeople: ["haru", "aoi"] },
      { date: "2026", label: "相続開始", note: "正人が死亡しました。この時点で相続人を判定します。", changedPeople: ["masato"] },
    ],
    people: {
      masato: { name: "正人", relation: "被相続人", diedStep: 2 },
      midori: { name: "みどり", relation: "配偶者" },
      haru: { name: "春", relation: "子", bornStep: 1 },
      aoi: { name: "葵", relation: "子", bornStep: 1 },
    },
    root: ["masato", "midori"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "第一の枝", roots: ["haru"] },
      { label: "第二の枝", roots: ["aoi"] },
    ],
    answerOrder: ["midori", "haru", "aoi"],
    heirs: {
      midori: { share: "1/2", note: "配偶者の取り分" },
      haru: { share: "1/4", note: "子ども全体1/2を2人で均等" },
      aoi: { share: "1/4", note: "子ども全体1/2を2人で均等" },
    },
    nonHeirs: {},
    reasoning: [
      ["配偶者", "法律上の配偶者みどりは、常に相続人になります。"],
      ["順位", "第1順位の子である春と葵がいるため、直系尊属や兄弟姉妹は検討しません。"],
      ["相続分", "配偶者1/2、子ども全体1/2。子どもの取り分を2人で均等に分けます。"],
    ],
  },
  {
    id: "representation",
    category: "代襲",
    title: "先に死亡した子の枝を孫が継ぐ",
    summary: "子どもの一人が相続開始前に死亡している場合、その人の子どもが枝の取り分を引き継ぎます。",
    facts: [
      ["被相続人", "宗一（そういち）"],
      ["家族", "配偶者・子2人・孫2人"],
      ["先に死亡", "子・健"],
    ],
    events: [
      { date: "1998", label: "家族", note: "宗一には、配偶者の恵と2人の子がいます。", changedPeople: ["soichi", "megumi", "yui", "ken"] },
      { date: "2016", label: "孫の出生", note: "健の子として陸と海が生まれています。", changedPeople: ["riku", "umi"] },
      { date: "2024", label: "健が死亡", note: "宗一の子・健が、宗一より先に死亡しました。", changedPeople: ["ken"] },
      { date: "2026", label: "相続開始", note: "宗一が死亡しました。健の枝で代襲が起こるかを判定します。", changedPeople: ["soichi"] },
    ],
    people: {
      soichi: { name: "宗一", relation: "被相続人", diedStep: 3 },
      megumi: { name: "恵", relation: "配偶者" },
      yui: { name: "結", relation: "子" },
      ken: { name: "健", relation: "子", diedStep: 2 },
      riku: { name: "陸", relation: "孫", parent: "ken", bornStep: 1 },
      umi: { name: "海", relation: "孫", parent: "ken", bornStep: 1 },
    },
    root: ["soichi", "megumi"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "結の枝", roots: ["yui"] },
      { label: "健の枝", roots: ["ken"] },
    ],
    answerOrder: ["megumi", "yui", "ken", "riku", "umi"],
    heirs: {
      megumi: { share: "1/2", note: "配偶者の取り分" },
      yui: { share: "1/4", note: "結の枝の取り分" },
      riku: { share: "1/8", note: "健の枝1/4を2人で均等" },
      umi: { share: "1/8", note: "健の枝1/4を2人で均等" },
    },
    nonHeirs: {
      ken: "相続開始前に死亡しています。健の子である陸と海が代襲します。",
    },
    reasoning: [
      ["配偶者", "恵は配偶者として相続人になります。"],
      ["代襲", "健は先に死亡しているため、その子である陸と海が健の枝を代襲します。"],
      ["枝で分ける", "子ども全体の1/2を結の枝と健の枝で分け、健の1/4を陸と海が均等に分けます。"],
    ],
  },
  {
    id: "successive-representation",
    category: "再代襲",
    title: "子の系統では、ひ孫まで枝が続く",
    summary: "子と孫が相続開始前に死亡している事例で、ひ孫への再代襲を観察します。",
    facts: [
      ["被相続人", "文子（ふみこ）"],
      ["家族", "子2人・孫1人・ひ孫2人"],
      ["先に死亡", "子・誠、孫・翼"],
    ],
    events: [
      { date: "2000", label: "家族", note: "文子には、直と誠の2人の子がいます。", changedPeople: ["fumiko", "nao", "makoto", "tsubasa"] },
      { date: "2018", label: "ひ孫", note: "誠の子・翼には、灯と岳の2人の子がいます。", changedPeople: ["akari", "gaku"] },
      { date: "2023", label: "誠が死亡", note: "文子の子・誠が先に死亡しました。", changedPeople: ["makoto"] },
      { date: "2025", label: "翼も死亡", note: "代襲するはずだった孫・翼も、文子より先に死亡しました。", changedPeople: ["tsubasa"] },
      { date: "2026", label: "相続開始", note: "文子が死亡しました。誠の枝がどこまで続くかを判定します。", changedPeople: ["fumiko"] },
    ],
    people: {
      fumiko: { name: "文子", relation: "被相続人", diedStep: 4 },
      nao: { name: "直", relation: "子" },
      makoto: { name: "誠", relation: "子", diedStep: 2 },
      tsubasa: { name: "翼", relation: "孫", parent: "makoto", diedStep: 3 },
      akari: { name: "灯", relation: "ひ孫", parent: "tsubasa", bornStep: 1 },
      gaku: { name: "岳", relation: "ひ孫", parent: "tsubasa", bornStep: 1 },
    },
    root: ["fumiko"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "直の枝", roots: ["nao"] },
      { label: "誠の枝", roots: ["makoto"] },
    ],
    answerOrder: ["nao", "makoto", "tsubasa", "akari", "gaku"],
    heirs: {
      nao: { share: "1/2", note: "直の枝の取り分" },
      akari: { share: "1/4", note: "誠の枝1/2を2人で均等" },
      gaku: { share: "1/4", note: "誠の枝1/2を2人で均等" },
    },
    nonHeirs: {
      makoto: "相続開始前に死亡しています。",
      tsubasa: "代襲者となるはずでしたが、相続開始前に死亡しています。灯と岳が再代襲します。",
    },
    reasoning: [
      ["第1順位", "生存する子・直と、先に死亡した誠の枝が第1順位です。"],
      ["再代襲", "誠を代襲するはずの翼も先に死亡しているため、翼の子である灯と岳が再代襲します。"],
      ["枝で分ける", "直の枝と誠の枝が各1/2。誠の枝の1/2を灯と岳が均等に分けます。"],
    ],
  },
  {
    id: "sibling-no-successive-representation",
    category: "兄弟姉妹",
    title: "兄弟姉妹の系統では再代襲しない",
    summary: "甥・姪までは代襲できますが、その子へは枝が続かないことを子の系統と比較します。",
    facts: [
      ["被相続人", "浩（ひろし）"],
      ["家族", "配偶者・姉・兄の子孫"],
      ["前提", "子・直系尊属はいない"],
    ],
    events: [
      { date: "2010", label: "家族", note: "浩には配偶者の澄子、姉の玲子、兄の修がいます。子と直系尊属はいません。", changedPeople: ["hiroshi", "sumiko", "reiko", "osamu", "yu", "minato"] },
      { date: "2019", label: "修が死亡", note: "兄・修が浩より先に死亡しました。修の子・悠が代襲候補になります。", changedPeople: ["osamu"] },
      { date: "2024", label: "悠も死亡", note: "甥・悠も浩より先に死亡しました。悠には子・湊がいます。", changedPeople: ["yu"] },
      { date: "2026", label: "相続開始", note: "浩が死亡しました。兄弟姉妹の枝が湊まで続くかを判定します。", changedPeople: ["hiroshi"] },
    ],
    people: {
      hiroshi: { name: "浩", relation: "被相続人", diedStep: 3 },
      sumiko: { name: "澄子", relation: "配偶者" },
      reiko: { name: "玲子", relation: "姉" },
      osamu: { name: "修", relation: "兄", diedStep: 1 },
      yu: { name: "悠", relation: "甥", parent: "osamu", diedStep: 2 },
      minato: { name: "湊", relation: "甥の子", parent: "yu" },
    },
    treeLayout: "siblings-row",
    root: ["hiroshi", "sumiko"],
    candidateHeading: "第3順位｜兄弟姉妹の枝",
    branches: [
      { label: "玲子の枝", roots: ["reiko"] },
      { label: "修の枝", roots: ["osamu"] },
    ],
    answerOrder: ["sumiko", "reiko", "osamu", "yu", "minato"],
    heirs: {
      sumiko: { share: "3/4", note: "配偶者の取り分" },
      reiko: { share: "1/4", note: "相続できる唯一の兄弟姉妹の枝" },
    },
    nonHeirs: {
      osamu: "相続開始前に死亡しています。",
      yu: "修を代襲できる甥ですが、相続開始前に死亡しています。",
      minato: "兄弟姉妹の代襲は甥・姪までです。甥の子への再代襲はありません。",
    },
    reasoning: [
      ["第3順位", "子も直系尊属もいないため、兄弟姉妹の順位を検討します。"],
      ["再代襲なし", "修の子・悠までは代襲できますが、悠も先に死亡しています。悠の子・湊は再代襲しません。"],
      ["相続分", "配偶者が3/4、相続できる兄弟姉妹の枝は玲子だけなので、玲子が1/4を取得します。"],
    ],
  },
  {
    id: "half-blood-siblings",
    category: "半血",
    title: "半血兄弟姉妹は重みを半分にする",
    summary: "全血兄弟姉妹と半血兄弟姉妹が一緒に相続するとき、人数だけで均等にしない点を確認します。",
    facts: [
      ["被相続人", "一郎（いちろう）"],
      ["家族", "配偶者・全血の弟・半血の妹"],
      ["前提", "子・直系尊属はいない"],
    ],
    events: [
      { date: "1985", label: "きょうだい", note: "一郎と次郎は父母の双方が同じ兄弟です。", changedPeople: ["ichiro", "jiro"] },
      { date: "1995", label: "半血の妹", note: "一郎には、父だけを同じくする妹・美緒もいます。", changedPeople: ["mio"] },
      { date: "2024", label: "父母が死亡", note: "一郎の父と母は、一郎より先に死亡しました。", changedPeople: ["father", "mother"] },
      { date: "2026", label: "相続開始", note: "一郎が死亡しました。全血と半血の重みを使って相続分を計算します。", changedPeople: ["ichiro"] },
    ],
    people: {
      father: { name: "父", relation: "一郎・次郎・美緒の父", diedStep: 2 },
      mother: { name: "母", relation: "一郎・次郎の母", diedStep: 2 },
      otherMother: { name: "母（氏名不詳）", relation: "美緒の母・一郎とは親族関係なし" },
      ichiro: { name: "一郎", relation: "被相続人", diedStep: 3 },
      kaori: { name: "香織", relation: "配偶者" },
      jiro: { name: "次郎", relation: "全血の弟" },
      mio: { name: "美緒", relation: "半血の妹", bornStep: 1 },
    },
    treeLayout: "split-parent-unions",
    root: ["ichiro", "kaori"],
    candidateHeading: "第3順位｜兄弟姉妹",
    branches: [
      { label: "全血｜重み2", roots: ["jiro"] },
      { label: "半血｜重み1", roots: ["mio"] },
    ],
    answerOrder: ["kaori", "jiro", "mio"],
    heirs: {
      kaori: { share: "3/4", note: "配偶者の取り分" },
      jiro: { share: "1/6", note: "兄弟姉妹1/4 × 2/3" },
      mio: { share: "1/12", note: "兄弟姉妹1/4 × 1/3" },
    },
    nonHeirs: {},
    reasoning: [
      ["第3順位", "子も直系尊属もいないため、次郎と美緒が兄弟姉妹として相続人になります。"],
      ["全体を分ける", "配偶者は3/4、兄弟姉妹全体は1/4です。"],
      ["重みで分ける", "全血の次郎を重み2、半血の美緒を重み1として、兄弟姉妹全体の1/4を2対1で分けます。"],
    ],
  },
  {
    id: "adoption-timing",
    category: "養子・時系列",
    title: "養子の子が生まれた時期を比べる",
    summary: "養子縁組の前からいた子と、縁組後に生まれた子では、養親との親族関係が異なることを時系列で確認します。",
    facts: [
      ["被相続人", "千代（ちよ）"],
      ["養子", "太郎（2010年に縁組）"],
      ["養子の子", "花は縁組前、光は縁組後に出生"],
    ],
    events: [
      { date: "2005", label: "花が出生", note: "太郎の子・花は、千代と太郎が養子縁組する前に生まれています。", changedPeople: ["hana"] },
      { date: "2010", label: "養子縁組", note: "千代と太郎が養子縁組をしました。この日から養親子関係が生じます。", changedPeople: ["chiyo", "taro"] },
      { date: "2012", label: "光が出生", note: "太郎の子・光は、養子縁組の後に生まれました。", changedPeople: ["hikari"] },
      { date: "2024", label: "太郎が死亡", note: "養子・太郎が千代より先に死亡しました。", changedPeople: ["taro"] },
      { date: "2026", label: "相続開始", note: "千代が死亡しました。花と光が太郎を代襲できるかを判定します。", changedPeople: ["chiyo"] },
    ],
    people: {
      chiyo: { name: "千代", relation: "被相続人", diedStep: 4 },
      taro: { name: "太郎", relation: "養子", connectionStep: 1, diedStep: 3 },
      hana: { name: "花", relation: "養子の子（縁組前出生）", parent: "taro" },
      hikari: { name: "光", relation: "養子の子（縁組後出生）", parent: "taro", bornStep: 2 },
      jun: { name: "淳", relation: "千代の弟" },
    },
    treeLayout: "adoption-siblings-row",
    root: ["chiyo"],
    candidateHeading: "子の枝と、下位順位の候補",
    branches: [
      { label: "太郎の枝", roots: ["taro"], activeFrom: 1, inactiveLabel: "まだ養親子関係なし" },
      { label: "第3順位候補", roots: ["jun"] },
    ],
    answerOrder: ["taro", "hana", "hikari", "jun"],
    heirs: {
      hikari: { share: "全部", note: "太郎を代襲する唯一の直系卑属" },
    },
    nonHeirs: {
      taro: "相続開始前に死亡しています。",
      hana: "養子縁組前に生まれており、養親・千代の直系卑属ではないため、太郎を代襲しません。",
      jun: "第1順位の代襲相続人である光がいるため、第3順位の兄弟姉妹は相続人になりません。",
    },
    reasoning: [
      ["縁組の時点", "太郎は2010年の養子縁組により、千代の子として第1順位になります。"],
      ["直系卑属か", "縁組後に生まれた光は千代の直系卑属となり、太郎を代襲します。縁組前に生まれた花は該当しません。"],
      ["順位", "光が第1順位の代襲相続人になるため、第3順位の淳には移りません。"],
    ],
  },
];

let scenarioIndex = 0;
let snapshotIndex = 0;
let selectedPeople = new Set();
let isRevealed = false;

const byId = (id) => document.getElementById(id);
const elements = {
  scenarioList: byId("scenario-list"),
  randomButton: byId("random-button"),
  storyNumber: byId("story-number"),
  storyCategory: byId("story-category"),
  storyTitle: byId("story-title"),
  storySummary: byId("story-summary"),
  storyFacts: byId("story-facts"),
  timeline: byId("timeline"),
  previousStepButton: byId("previous-step-button"),
  nextStepButton: byId("next-step-button"),
  stepLabel: byId("step-label"),
  snapshotNote: byId("snapshot-note"),
  treeStage: byId("tree-stage"),
  questionPanel: byId("question-panel"),
  questionHelp: byId("question-help"),
  answerOptions: byId("answer-options"),
  checkButton: byId("check-button"),
  resultPanel: byId("result-panel"),
  resultKicker: byId("result-kicker"),
  resultTitle: byId("result-title"),
  retryButton: byId("retry-button"),
  shareGrid: byId("share-grid"),
  reasoning: byId("reasoning"),
  notHeirs: byId("not-heirs"),
};

function currentScenario() {
  return scenarios[scenarioIndex];
}

function isVisible(person) {
  return (person.bornStep ?? 0) <= snapshotIndex;
}

function isDead(person) {
  return person.diedStep !== undefined && person.diedStep <= snapshotIndex;
}

function isFinalSnapshot() {
  return snapshotIndex === currentScenario().events.length - 1;
}

function personCard(personId) {
  const scenario = currentScenario();
  const person = scenario.people[personId];
  const selectable = isFinalSnapshot()
    && !isRevealed
    && scenario.answerOrder.includes(personId)
    && isVisible(person);
  const selected = selectedPeople.has(personId);
  const finalDecedent = isFinalSnapshot() && person.relation === "被相続人";
  const changedThisStep = scenario.events[snapshotIndex].changedPeople?.includes(personId) ?? false;
  const card = document.createElement(selectable ? "button" : "div");
  card.className = "person-card";
  card.dataset.person = personId;

  if (selectable) {
    card.type = "button";
    card.classList.add("is-selectable");
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
    card.setAttribute(
      "aria-label",
      `${person.name}（${person.relation}）を${selected ? "選択解除" : "法定相続人として選択"}`,
    );
    card.addEventListener("click", () => togglePersonSelection(personId, "card"));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      togglePersonSelection(personId, "card");
    });
  }

  if (!isVisible(person)) card.classList.add("is-not-born");
  if (isDead(person)) card.classList.add("is-dead");
  if (changedThisStep && !finalDecedent) card.classList.add("has-current-change");
  if (finalDecedent) card.classList.add("is-decedent-final");

  if (isRevealed && isFinalSnapshot()) {
    if (scenario.heirs[personId]) {
      card.classList.add("is-heir");
      if (!selectedPeople.has(personId)) card.classList.add("is-missed");
    } else if (selectedPeople.has(personId)) {
      card.classList.add("is-wrong");
    }
  }

  const state = selected && !isRevealed
    ? isDead(person)
      ? "● 選択済み（死亡）"
      : "● 選択済み"
    : isDead(person)
      ? "死亡"
      : isRevealed && scenario.heirs[personId]
        ? "✓ 法定相続人"
        : isRevealed
          ? selectedPeople.has(personId)
            ? "選択したが対象外"
            : "対象外"
          : "生存";
  const share = isRevealed && scenario.heirs[personId]
    ? `<span class="person-share">${scenario.heirs[personId].share}</span>`
    : "";

  card.innerHTML = `
    ${selected && !isRevealed ? '<span class="selection-mark" aria-hidden="true">選択中</span>' : ""}
    ${changedThisStep && !finalDecedent ? '<span class="change-mark">今回の変化</span>' : ""}
    ${finalDecedent ? '<span class="decedent-mark">相続開始</span>' : ""}
    <span class="person-name">${person.name}</span>
    <span class="person-relation">${person.relation}</span>
    <span class="person-state">${state}</span>
    ${share}
  `;
  return card;
}

function descendantUnit(personId) {
  const scenario = currentScenario();
  const unit = document.createElement("div");
  unit.className = "descendant-unit";
  unit.append(personCard(personId));

  const children = Object.entries(scenario.people)
    .filter(([, person]) => person.parent === personId && isVisible(person))
    .map(([id]) => id);

  if (children.length) {
    const descendants = document.createElement("div");
    descendants.className = "descendants";
    children.forEach((childId) => descendants.append(descendantUnit(childId)));
    unit.append(descendants);
  }
  return unit;
}

function renderSplitParentUnionsTree(scenario) {
  const familyTree = document.createElement("div");
  familyTree.className = "split-family-tree";

  const parents = document.createElement("div");
  parents.className = "split-family-parents";
  parents.append(personCard("mother"));

  const firstUnion = document.createElement("span");
  firstUnion.className = "partner-line";
  firstUnion.innerHTML = '<span class="visually-hidden">母と父の夫婦関係</span>';
  parents.append(firstUnion, personCard("father"));

  const secondUnion = document.createElement("span");
  secondUnion.className = "partner-line partner-line--other";
  secondUnion.innerHTML = '<span class="visually-hidden">父と氏名不詳の母の関係</span>';
  parents.append(secondUnion, personCard("otherMother"));
  familyTree.append(parents);

  const branches = document.createElement("div");
  branches.className = "split-family-branches";

  const fullBloodBranch = document.createElement("section");
  fullBloodBranch.className = "split-family-branch";
  fullBloodBranch.innerHTML = '<span class="branch-label">父母の双方が同じ｜重み2</span>';
  const fullBloodChildren = document.createElement("div");
  fullBloodChildren.className = "split-family-children";

  const decedentCouple = document.createElement("div");
  decedentCouple.className = "split-family-child split-family-couple";
  decedentCouple.append(personCard("ichiro"));
  const coupleLine = document.createElement("span");
  coupleLine.className = "couple-line";
  coupleLine.innerHTML = '<span class="visually-hidden">一郎と香織の夫婦関係</span>';
  decedentCouple.append(coupleLine, personCard("kaori"));

  const fullSibling = document.createElement("div");
  fullSibling.className = "split-family-child";
  fullSibling.append(personCard("jiro"));
  fullBloodChildren.append(decedentCouple, fullSibling);
  fullBloodBranch.append(fullBloodChildren);

  const halfBloodBranch = document.createElement("section");
  halfBloodBranch.className = "split-family-branch split-family-branch--half";
  halfBloodBranch.innerHTML = '<span class="branch-label">父のみ同じ｜重み1</span>';
  const halfBloodChildren = document.createElement("div");
  halfBloodChildren.className = "split-family-children split-family-children--single";
  const halfSibling = document.createElement("div");
  halfSibling.className = "split-family-child";
  halfSibling.append(personCard("mio"));
  halfBloodChildren.append(halfSibling);
  halfBloodBranch.append(halfBloodChildren);

  branches.append(fullBloodBranch, halfBloodBranch);
  familyTree.append(branches);
  elements.treeStage.append(familyTree);
}

function renderSiblingsRowTree() {
  const siblingTree = document.createElement("div");
  siblingTree.className = "sibling-row-tree";

  const generation = document.createElement("div");
  generation.className = "sibling-generation";

  const sisterUnit = document.createElement("div");
  sisterUnit.className = "sibling-unit";
  sisterUnit.append(descendantUnit("reiko"));

  const decedentUnit = document.createElement("div");
  decedentUnit.className = "sibling-unit sibling-decedent-unit";
  const decedentCouple = document.createElement("div");
  decedentCouple.className = "sibling-couple";
  decedentCouple.append(personCard("hiroshi"));
  const spouseLine = document.createElement("span");
  spouseLine.className = "couple-line";
  spouseLine.innerHTML = '<span class="visually-hidden">浩と澄子の夫婦関係</span>';
  decedentCouple.append(spouseLine, personCard("sumiko"));
  decedentUnit.append(decedentCouple);

  const brotherUnit = document.createElement("div");
  brotherUnit.className = "sibling-unit";
  brotherUnit.append(descendantUnit("osamu"));

  generation.append(sisterUnit, decedentUnit, brotherUnit);
  siblingTree.append(generation);
  elements.treeStage.append(siblingTree);
}

function renderAdoptionSiblingsRowTree() {
  const siblingTree = document.createElement("div");
  siblingTree.className = "sibling-row-tree adoption-sibling-row-tree";

  const generation = document.createElement("div");
  generation.className = "sibling-generation adoption-sibling-generation";

  const decedentUnit = document.createElement("div");
  decedentUnit.className = "sibling-unit";
  const adoptionLineage = document.createElement("div");
  adoptionLineage.className = "adoption-lineage-unit";
  adoptionLineage.append(personCard("chiyo"));

  const adoptionDescendants = document.createElement("div");
  adoptionDescendants.className = "descendants adoption-descendants";
  const beforeAdoption = snapshotIndex < 1;
  if (beforeAdoption) adoptionDescendants.classList.add("is-inactive");
  adoptionDescendants.append(descendantUnit("taro"));
  adoptionLineage.append(adoptionDescendants);

  if (beforeAdoption) {
    const badge = document.createElement("span");
    badge.className = "event-badge";
    badge.textContent = "養子縁組の出来事で千代の枝につながります";
    adoptionLineage.append(badge);
  }
  decedentUnit.append(adoptionLineage);

  const brotherUnit = document.createElement("div");
  brotherUnit.className = "sibling-unit";
  brotherUnit.append(personCard("jun"));

  generation.append(decedentUnit, brotherUnit);
  siblingTree.append(generation);
  elements.treeStage.append(siblingTree);
}

function renderTree() {
  const scenario = currentScenario();
  elements.treeStage.replaceChildren();

  if (scenario.treeLayout === "split-parent-unions") {
    renderSplitParentUnionsTree(scenario);
    return;
  }

  if (scenario.treeLayout === "siblings-row") {
    renderSiblingsRowTree();
    return;
  }

  if (scenario.treeLayout === "adoption-siblings-row") {
    renderAdoptionSiblingsRowTree();
    return;
  }

  const root = document.createElement("div");
  root.className = "tree-root";
  scenario.root.forEach((personId) => root.append(personCard(personId)));
  elements.treeStage.append(root);

  const heading = document.createElement("div");
  heading.className = "candidate-heading";
  heading.textContent = scenario.candidateHeading;
  elements.treeStage.append(heading);

  const branches = document.createElement("div");
  branches.className = "tree-branches";
  scenario.branches.forEach((branchData) => {
    const branch = document.createElement("section");
    branch.className = "family-branch";
    const isInactive = branchData.activeFrom !== undefined && snapshotIndex < branchData.activeFrom;
    if (isInactive) branch.classList.add("is-inactive");

    const label = document.createElement("span");
    label.className = "branch-label";
    label.textContent = isInactive ? branchData.inactiveLabel : branchData.label;
    branch.append(label);

    const people = document.createElement("div");
    people.className = "branch-people";
    branchData.roots.forEach((personId) => people.append(descendantUnit(personId)));
    branch.append(people);

    if (isInactive) {
      const badge = document.createElement("span");
      badge.className = "event-badge";
      badge.textContent = "縁組の出来事で線がつながります";
      branch.append(badge);
    }
    branches.append(branch);
  });
  elements.treeStage.append(branches);
}

function renderScenarioButtons() {
  elements.scenarioList.replaceChildren();
  scenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-button";
    button.setAttribute("aria-pressed", String(index === scenarioIndex));
    button.innerHTML = `<small>${String(index + 1).padStart(2, "0")} / ${scenario.category}</small><strong>${scenario.title}</strong>`;
    button.addEventListener("click", () => selectScenario(index));
    elements.scenarioList.append(button);
  });
}

function renderStory() {
  const scenario = currentScenario();
  elements.storyNumber.textContent = String(scenarioIndex + 1).padStart(2, "0");
  elements.storyCategory.textContent = scenario.category;
  elements.storyTitle.textContent = scenario.title;
  elements.storySummary.textContent = scenario.summary;
  elements.storyFacts.innerHTML = scenario.facts
    .map(([term, detail]) => `<div><dt>${term}</dt><dd>${detail}</dd></div>`)
    .join("");
}

function renderTimeline() {
  const scenario = currentScenario();
  elements.timeline.style.setProperty("--timeline-count", scenario.events.length);
  elements.timeline.replaceChildren();
  scenario.events.forEach((event, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("is-current", index === snapshotIndex);
    button.classList.toggle("is-past", index < snapshotIndex);
    button.setAttribute("aria-current", index === snapshotIndex ? "step" : "false");
    button.innerHTML = `<strong>${event.date}｜${event.label}</strong><small>${event.note}</small>`;
    button.addEventListener("click", () => {
      snapshotIndex = index;
      selectedPeople = new Set();
      isRevealed = false;
      render();
    });
    item.append(button);
    elements.timeline.append(item);
  });
  elements.previousStepButton.disabled = snapshotIndex === 0;
  elements.nextStepButton.disabled = isFinalSnapshot();
}

function renderAnswerOptions() {
  const scenario = currentScenario();
  elements.answerOptions.replaceChildren();
  scenario.answerOrder.forEach((personId) => {
    const person = scenario.people[personId];
    if (!isVisible(person)) return;
    const label = document.createElement("label");
    label.className = "answer-choice";
    label.innerHTML = `
      <input type="checkbox" value="${personId}" ${selectedPeople.has(personId) ? "checked" : ""} ${isRevealed ? "disabled" : ""} />
      <span>${person.name}<small>（${person.relation}）</small></span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      togglePersonSelection(personId, "checkbox", event.target.checked);
    });
    elements.answerOptions.append(label);
  });
}

function updateQuestionHelp() {
  elements.questionHelp.textContent = selectedPeople.size
    ? `${selectedPeople.size}人を選択中です。水色の人物カードが、現在選んでいる人です。`
    : "家系図の人物カード、または下の選択肢から選べます。";
}

function togglePersonSelection(personId, source, forceSelected) {
  if (!isFinalSnapshot() || isRevealed) return;
  const shouldSelect = forceSelected ?? !selectedPeople.has(personId);
  if (shouldSelect) selectedPeople.add(personId);
  else selectedPeople.delete(personId);

  renderTree();
  renderAnswerOptions();
  updateQuestionHelp();

  if (source === "card") {
    elements.treeStage.querySelector(`[data-person="${personId}"]`)?.focus();
  } else {
    elements.answerOptions.querySelector(`input[value="${personId}"]`)?.focus();
  }
}

function selectedAnswerIsCorrect() {
  const heirIds = Object.keys(currentScenario().heirs);
  return heirIds.length === selectedPeople.size && heirIds.every((id) => selectedPeople.has(id));
}

function renderResult() {
  const scenario = currentScenario();
  const isCorrect = selectedAnswerIsCorrect();
  elements.resultPanel.hidden = !isRevealed;
  if (!isRevealed) return;

  elements.resultKicker.textContent = isCorrect ? "正解です" : "家系図で見直しましょう";
  elements.resultTitle.textContent = isCorrect
    ? "順位と代襲関係を正しく判定できました。"
    : "「✓ 法定相続人」と表示された人物が正解です。";

  elements.shareGrid.innerHTML = Object.entries(scenario.heirs)
    .map(([personId, share]) => `
      <article class="share-card">
        <span>${scenario.people[personId].name}（${scenario.people[personId].relation}）</span>
        <strong>${share.share}</strong>
        <small>${share.note}</small>
      </article>
    `)
    .join("");

  elements.reasoning.innerHTML = scenario.reasoning
    .map(([title, text]) => `<li><strong>${title}</strong>${text}</li>`)
    .join("");

  const nonHeirEntries = Object.entries(scenario.nonHeirs);
  elements.notHeirs.hidden = nonHeirEntries.length === 0;
  elements.notHeirs.innerHTML = nonHeirEntries.length
    ? `<h4>相続人にならない理由</h4><ul>${nonHeirEntries
        .map(([personId, reason]) => `<li><strong>${scenario.people[personId].name}：</strong>${reason}</li>`)
        .join("")}</ul>`
    : "";
}

function renderQuestion() {
  const final = isFinalSnapshot();
  elements.questionPanel.hidden = !final;
  if (!final) return;
  renderAnswerOptions();
  elements.checkButton.disabled = isRevealed;
  if (isRevealed) elements.questionHelp.textContent = "答えと理由を家系図の下に表示しています。";
  else updateQuestionHelp();
}

function render() {
  const scenario = currentScenario();
  const event = scenario.events[snapshotIndex];
  elements.stepLabel.textContent = `時点 ${snapshotIndex + 1} / ${scenario.events.length}｜${event.date} ${event.label}`;
  elements.snapshotNote.textContent = isFinalSnapshot()
    ? `${event.note} 家系図の人物カードを直接選び、法定相続人になる人を回答してください。`
    : `${event.note} 黄色の「今回の変化」が付いた人物を確認して、次の出来事へ進めます。`;
  renderScenarioButtons();
  renderStory();
  renderTimeline();
  renderTree();
  renderQuestion();
  renderResult();
}

function selectScenario(index) {
  scenarioIndex = index;
  snapshotIndex = 0;
  selectedPeople = new Set();
  isRevealed = false;
  render();
  elements.storyTitle.focus?.();
}

elements.randomButton.addEventListener("click", () => {
  let nextIndex = scenarioIndex;
  while (nextIndex === scenarioIndex) nextIndex = Math.floor(Math.random() * scenarios.length);
  selectScenario(nextIndex);
});

function moveToSnapshot(index) {
  snapshotIndex = Math.max(0, Math.min(index, currentScenario().events.length - 1));
  selectedPeople = new Set();
  isRevealed = false;
  render();
}

elements.previousStepButton.addEventListener("click", () => moveToSnapshot(snapshotIndex - 1));
elements.nextStepButton.addEventListener("click", () => moveToSnapshot(snapshotIndex + 1));

elements.checkButton.addEventListener("click", () => {
  isRevealed = true;
  renderTree();
  renderQuestion();
  renderResult();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.snapshotNote.textContent = selectedAnswerIsCorrect()
    ? "正解です。オレンジの枠と「✓ 法定相続人」の表示で、相続人と相続分を確認してください。"
    : "答え合わせを表示しました。「✓ 法定相続人」と表示された人物と、選んだ人物を見比べてください。";
  elements.treeStage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
});

elements.retryButton.addEventListener("click", () => {
  selectedPeople = new Set();
  isRevealed = false;
  renderTree();
  renderQuestion();
  renderResult();
  elements.answerOptions.querySelector("input")?.focus();
});

render();
