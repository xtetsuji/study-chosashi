const scenarios = {
  before: {
    cRole: "取消し前の第三者",
    events: [
      {
        title: "最初の状態",
        label: "当初",
        from: "a",
        to: "a",
        owner: "A",
        registry: "A",
        rule: "まだ問題なし",
        relation: "―",
        conclusion: "Aが甲土地を所有し、登記名義もAです。",
        detail: "売買による所有権の移動と、登記名義の移動を別々に追います。",
        next: "AからBへ売買",
      },
      {
        title: "AからBへの売買",
        label: "A → B　売買",
        from: "a",
        to: "b",
        owner: "B",
        registry: "A",
        rule: "民法176条",
        relation: "AとB（当事者）",
        conclusion: "売買により、実体上の所有権だけがBへ移ります。",
        detail: "登記は物権変動そのものではありません。この時点の登記名義は、まだAです。",
        next: "Bへ移転登記",
      },
      {
        title: "Bへの所有権移転登記",
        label: "A → B　登記",
        from: "a",
        to: "b",
        owner: "B",
        registry: "B",
        rule: "登記が実体に追いつく",
        relation: "AとB（当事者）",
        conclusion: "登記名義がBへ移り、実体と登記が一致しました。",
        detail: "ピンクの登記名義だけが、AからBへ移動した場面です。",
        next: "BからCへ売買",
      },
      {
        title: "取消し前にCが取得",
        label: "B → C　売買",
        from: "b",
        to: "c",
        owner: "C",
        registry: "B",
        rule: "Cが第三者として登場",
        relation: "AとC（取消し前）",
        conclusion: "取消しより前に、Cが実体上の所有権を取得しました。",
        detail: "ここが分かれ目です。まだ取消しは起きておらず、Cはすでに法律上の利害関係を得ています。",
        next: "Cへ移転登記",
      },
      {
        title: "Cへの所有権移転登記",
        label: "B → C　登記",
        from: "b",
        to: "c",
        owner: "C",
        registry: "C",
        rule: "取消し前の状態",
        relation: "AとC（取消し前）",
        conclusion: "実体上の所有者も登記名義人もCです。",
        detail: "ただし、次に問題となる96条3項の第三者保護は、登記を備えたこと自体を要件としていません。",
        next: "Aが売買を取り消す",
      },
      {
        title: "取消し時点で、すでにCがいる",
        label: "A → B　取消し",
        from: "a",
        to: "b",
        owner: "C",
        registry: "C",
        rule: "民法96条3項",
        relation: "A → C　取消しを対抗できる？",
        cancel: true,
        conclusion: "取消しの瞬間、すでにAとCの関係が問題になります。",
        detail: "Aが当然に『対抗力を得る』のではありません。取消しの効果をCに対抗できるかを、Cの善意・無過失によって判定します。",
        effectOutcome: "Cに及ぶかを判定",
        next: "",
        decision: "before",
      },
    ],
  },
  after: {
    cRole: "取消し後の第三者",
    events: [
      {
        title: "最初の状態",
        label: "当初",
        from: "a",
        to: "a",
        owner: "A",
        registry: "A",
        rule: "まだ問題なし",
        relation: "―",
        conclusion: "Aが甲土地を所有し、登記名義もAです。",
        detail: "取消しの瞬間にCがいるかどうかを確認しながら進めます。",
        next: "AからBへ売買",
      },
      {
        title: "AからBへの売買",
        label: "A → B　売買",
        from: "a",
        to: "b",
        owner: "B",
        registry: "A",
        rule: "民法176条",
        relation: "AとB（当事者）",
        conclusion: "売買により、実体上の所有権だけがBへ移ります。",
        detail: "Cはまだ登場していません。",
        next: "Bへ移転登記",
      },
      {
        title: "Bへの所有権移転登記",
        label: "A → B　登記",
        from: "a",
        to: "b",
        owner: "B",
        registry: "B",
        rule: "登記が実体に追いつく",
        relation: "AとB（当事者）",
        conclusion: "実体上の所有者も登記名義人もBです。",
        detail: "このあと、Cがいない状態で取消しが起きます。",
        next: "Aが売買を取り消す",
      },
      {
        title: "取消し時点では、Cがいない",
        label: "A → B　取消し",
        from: "a",
        to: "b",
        owner: "A",
        registry: "B",
        rule: "民法121条・当事者関係",
        relation: "AとB（登記不要）",
        cancel: true,
        conclusion: "Bは取消しの当事者なので、Aは登記なしで所有権復帰をBに主張できます。",
        detail: "これは177条の対抗問題ではありません。ただし登記名義はBのままなので、『実体はA・登記はB』というズレが残ります。",
        next: "BがCへ売却",
      },
      {
        title: "取消し後にCが登場",
        label: "B → C　売買",
        from: "b",
        to: "c",
        owner: "A と Cが競合",
        registry: "B",
        rule: "民法177条へ",
        relation: "AとC（取消し後）",
        conclusion: "Aの所有権復帰と、Cの取得が競合する場面です。",
        detail: "所有権が絶対的に二つあるという意味ではありません。AとCのどちらが相手へ権利を対抗できるか、登記の先後で決着させます。",
        next: "先に登記する人を選ぶ",
      },
      {
        title: "登記の先後で決着する",
        label: "A または C　登記",
        from: "a",
        to: "c",
        owner: "未選択",
        registry: "未選択",
        rule: "民法177条",
        relation: "AとC（対抗関係）",
        conclusion: "Aの復帰登記とCの移転登記のうち、どちらが先かを選びます。",
        detail: "Cの単なる悪意だけでは、原則として177条の第三者から排除されません。ただし、背信的悪意者は別です。",
        next: "",
        decision: "after",
      },
    ],
  },
};

/**
 * @typedef {Object} ScenarioEvent
 * @property {string} title ステップの見出し
 * @property {string} label シーケンス図に表示する出来事
 * @property {string} from 出来事の起点となる当事者
 * @property {string} to 出来事の終点となる当事者
 * @property {string} owner 実体上の所有関係
 * @property {string} registry 登記名義
 * @property {string} rule 適用条文または判断ルール
 * @property {string} relation 問題となる当事者間の関係
 * @property {string} conclusion その時点の結論
 * @property {string} detail 結論の補足説明
 * @property {string} next 次の操作を示す文言
 * @property {boolean} [cancel] 取消しが起きるステップか
 * @property {"before" | "after"} [decision] 選択問題の種類
 * @property {string} [effectOutcome] 取消しの効果が第三者へ及ぶかの表示
 */

const { resolveAdvancedOutcome, readUrlState, buildUrlSearch } = window.CancellationThirdPartyLogic;
const initialState = readUrlState(window.location.search, {
  before: scenarios.before.events.length - 1,
  after: scenarios.after.events.length - 1,
});

let scenarioKey = initialState.scenario;
let step = initialState.step;
let result = initialState.result;
let playTimer = null;
let dTiming = initialState.dTiming;
let cIsProtected = initialState.cIsProtected;
let dIsProtected = initialState.dIsProtected;
let advancedWinner = initialState.advancedWinner;
let urlSyncEnabled = false;

/**
 * 指定したIDを持つ要素を取得する。
 *
 * @param {string} id 取得する要素のID
 * @returns {HTMLElement | null} 該当する要素。存在しない場合は`null`
 */
const byId = (id) => document.getElementById(id);
const elements = {
  title: byId("lesson-title"),
  stepLabel: byId("step-label"),
  events: byId("events"),
  explanation: byId("explanation"),
  owner: byId("owner-value"),
  registry: byId("registry-value"),
  rule: byId("rule-value"),
  relation: byId("relation-value"),
  cRole: byId("c-role"),
  cActor: document.querySelector(".actor-head--c"),
  cancelMoment: byId("cancel-moment"),
  decision: byId("decision"),
  back: byId("back-button"),
  next: byId("next-button"),
  play: byId("play-button"),
  reset: byId("reset-button"),
  share: byId("share-button"),
  shareStatus: byId("share-status"),
  advancedEntry: byId("advanced-entry"),
  advancedOpen: byId("advanced-open"),
  advancedPanel: byId("advanced-panel"),
  advancedClose: byId("advanced-close"),
  advancedEvents: byId("advanced-events"),
  advancedAnswer: byId("advanced-answer"),
  advancedRegistration: byId("advanced-registration"),
  advancedActorC: document.querySelector(".advanced-actors .c-actor"),
  advancedActorD: document.querySelector(".advanced-actors .d-actor"),
  dTimingButtons: [...document.querySelectorAll("[data-d-timing]")],
  cProtectionButtons: [...document.querySelectorAll("[data-c-protection]")],
  dProtectionButtons: [...document.querySelectorAll("[data-d-protection]")],
  advancedWinnerButtons: [...document.querySelectorAll("[data-advanced-winner]")],
  scenarioButtons: [...document.querySelectorAll("[data-scenario]")],
};

/**
 * 自動再生を停止し、再生ボタンを初期表示へ戻す。
 *
 * @returns {void}
 */
function stopPlaying() {
  if (playTimer) window.clearInterval(playTimer);
  playTimer = null;
  elements.play.setAttribute("aria-pressed", "false");
  elements.play.textContent = "▶ 自動再生";
}

/**
 * 現在の教材状態を、ページ遷移を起こさずURLへ反映する。
 *
 * @returns {void}
 */
function syncUrlState() {
  const search = buildUrlSearch({
    scenario: scenarioKey,
    step,
    result,
    advancedOpen: !elements.advancedPanel.hidden,
    dTiming,
    cIsProtected,
    dIsProtected,
    advancedWinner,
  });
  const url = new URL(window.location.href);
  url.search = search;
  window.history.replaceState(null, "", url.href);
}

/**
 * 現在の教材状態を含むURLをクリップボードへコピーする。
 *
 * @returns {Promise<void>}
 */
async function copyCurrentUrl() {
  syncUrlState();
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const input = document.createElement("input");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  elements.shareStatus.textContent = "コピーしました";
  window.setTimeout(() => { elements.shareStatus.textContent = ""; }, 1800);
}

/**
 * 学習者が選んだ回答を現在のステップ表示へ反映する。
 *
 * @param {ScenarioEvent} current 回答反映前のステップ情報
 * @returns {ScenarioEvent} 所有関係・登記・説明へ回答を反映したステップ情報
 */
function getEventResult(current) {
  if (!result) return current;
  if (scenarioKey === "before") {
    return result === "protected"
      ? { ...current, owner: "C", registry: "C", relation: "A → C　取消しの効果は遮断", effectOutcome: "Cで遮断される", conclusion: "Cは善意・無過失なので保護され、所有権はCに残ります。", detail: "Aは詐欺取消しをCに対抗できません。ここではCの登記の有無ではなく、96条3項の保護要件が中心です。" }
      : { ...current, owner: "A", registry: "C（抹消請求の対象）", relation: "A → C　取消しの効果が届く", effectOutcome: "Cへ及ぶ", conclusion: "Cは保護要件を満たさず、Aは取消しをCに対抗できます。", detail: "実体上の所有権はAへ復帰します。C名義の登記が残っている場合、Aはその抹消を求めることになります。" };
  }
  return result === "a"
    ? { ...current, owner: "A", registry: "A", relation: "A → C　所有権を対抗できる", conclusion: "Aが先に復帰登記を備え、Cへ所有権を対抗できます。", detail: "この結論では緑の所有権表示とピンクの登記表示がAに収束します。" }
    : { ...current, owner: "C（Aに対抗できる）", registry: "C", relation: "C → A　取得を対抗できる", conclusion: "Cが先に移転登記を備え、Aへ取得を対抗できます。", detail: "Aは取消しによる所有権復帰をCに対抗できません。単なる悪意だけでは結論は変わりません。" };
}

/**
 * CからDへの転売を含む発展問題のシーケンス図と判定結果を描画する。
 *
 * @returns {void}
 */
function renderAdvanced() {
  const isBefore = dTiming === "before";
  const outcome = resolveAdvancedOutcome({
    timing: dTiming,
    cIsProtected,
    dIsProtected,
    winner: advancedWinner,
  });
  const items = isBefore
    ? [
        { label: "A → B　詐欺による売買", from: "a", to: "b" },
        { label: "B → C　転売", from: "b", to: "c" },
        { label: "C → D　転売", from: "c", to: "d", dEvent: true },
        { label: "A → B　取消し", from: "a", to: "b", cancel: true },
      ]
    : [
        { label: "A → B　詐欺による売買", from: "a", to: "b" },
        { label: "A → B　取消し", from: "a", to: "b", cancel: true },
        { label: "B → C　転売", from: "b", to: "c" },
        { label: "C → D　転売", from: "c", to: "d", dEvent: true },
      ];

  elements.advancedEvents.innerHTML = items.map((item, index) => {
    const classes = [item.cancel ? "is-cancel" : "", item.dEvent ? "is-d-event" : ""].filter(Boolean).join(" ");
    return `
      <li class="${classes}" data-from="${item.from}" data-to="${item.to}" style="top:${index * 66 + 4}px">
        <span class="advanced-step">${index + 1}</span>
        <i class="advanced-event-line" aria-hidden="true"></i>
        <strong>${item.label}</strong>
        ${item.cancel ? '<em>取消しの瞬間</em>' : ""}
      </li>`;
  }).join("");

  if (isBefore) {
    let heading;
    let body;
    if (outcome.code === "both_routes") {
      heading = "Dは保護される";
      body = "CもDも善意・無過失です。D自身が96条3項の第三者として保護されるうえ、保護されたCの地位を承継するルートもあります。";
    } else if (outcome.code === "via_c") {
      heading = "DはCの保護された地位を承継する";
      body = "D自身が善意・無過失でなくても、Cは96条3項により確定的に保護されています。通説的な整理では、DはCからその権利を承継します。";
    } else if (outcome.code === "via_d") {
      heading = "Cは保護されなくても、Dは保護される";
      body = "Dは取消し前に独立した法律上の利害関係を取得しています。D自身が善意・無過失なら、96条3項の第三者として保護され得ます。";
    } else {
      heading = "C・Dとも96条3項では保護されない";
      body = "CもDも善意・無過失の要件を満たしません。Aは取消しの効果をDに対抗でき、所有権復帰を主張できます。";
    }
    elements.advancedAnswer.innerHTML = `
      <p class="advanced-answer__label">取消しの線より上にC・Dがいる</p>
      <h3>${heading}</h3>
      <p>${body}</p>
      <p class="advanced-route">保護ルート：${outcome.route}</p>
      <p class="advanced-caution">CからDへの承継は、96条3項により保護された者が確定的に権利を取得するとする通説的な整理によります。</p>`;
  } else {
    const winnerIsA = outcome.protectedParty === "A";
    elements.advancedAnswer.innerHTML = `
      <p class="advanced-answer__label">取消しの線より下にC・Dがいる</p>
      <h3>${winnerIsA ? "AがDへ所有権復帰を対抗できる" : "DがAへ取得を対抗できる"}</h3>
      <p>取消し時点ではCもDも存在しないため、96条3項の善意・無過失による保護の場面ではありません。この基本事例では、${winnerIsA ? "Aの復帰登記" : "Dまでの移転登記"}が先なので${winnerIsA ? "A" : "D"}が優先します。</p>
      <p class="advanced-route">C：${cIsProtected ? "善意・無過失" : "それ以外"} ／ D：${dIsProtected ? "善意・無過失" : "それ以外"} → 結論を左右しない</p>
      <p class="advanced-caution">177条では単なる悪意も原則として排除されませんが、背信的悪意者は別です。この教材では背信的悪意者を除外しています。</p>`;
  }

  elements.advancedRegistration.hidden = isBefore;
  elements.advancedActorC.dataset.state = cIsProtected ? "善無" : "非保護";
  elements.advancedActorD.dataset.state = dIsProtected ? "善無" : "非保護";
  elements.advancedActorC.classList.toggle("is-unprotected", !cIsProtected);
  elements.advancedActorD.classList.toggle("is-unprotected", !dIsProtected);

  elements.dTimingButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.dTiming === dTiming));
  });
  elements.cProtectionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String((button.dataset.cProtection === "protected") === cIsProtected));
  });
  elements.dProtectionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String((button.dataset.dProtection === "protected") === dIsProtected));
  });
  elements.advancedWinnerButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.advancedWinner === advancedWinner));
  });
  if (urlSyncEnabled) syncUrlState();
}

/**
 * 所有者・登記名義の表示文から対応する当事者コードを取り出す。
 *
 * @param {string} value 所有関係または登記名義の表示文
 * @returns {"a" | "b" | "c" | null} 当事者コード。判定できない場合は`null`
 */
function partyFromValue(value) {
  if (value.startsWith("A")) return "a";
  if (value.startsWith("B")) return "b";
  if (value.startsWith("C")) return "c";
  return null;
}

/**
 * 実体上の所有関係と登記名義を示す状態トークンを生成する。
 *
 * @param {ScenarioEvent} event 表示対象のステップ情報
 * @returns {string} 状態トークンのHTML文字列
 */
function stateTokens(event) {
  const tokens = [];
  if (event.owner.includes("A と C")) {
    tokens.push('<span class="state-token state-token--owner state-token--claim party-a" title="Aの所有権復帰">実</span>');
    tokens.push('<span class="state-token state-token--owner state-token--claim party-c" title="Cの取得主張">実</span>');
  } else {
    const ownerParty = partyFromValue(event.owner);
    if (ownerParty) tokens.push(`<span class="state-token state-token--owner party-${ownerParty}" title="実体上の所有権：${event.owner}">実</span>`);
  }
  const registryParty = partyFromValue(event.registry);
  if (registryParty) tokens.push(`<span class="state-token state-token--registry party-${registryParty}" title="登記名義：${event.registry}">登</span>`);
  return tokens.join("");
}

/**
 * 現在の進行状況に合わせて基本事例のシーケンス図を描画する。
 *
 * @param {ScenarioEvent[]} events 表示する基本事例の全ステップ
 * @returns {void}
 */
function renderEvents(events) {
  elements.events.innerHTML = events.map((event, index) => {
    if (index === 0) return "";
    const displayEvent = index === step ? getEventResult(event) : event;
    const classNames = ["event"];
    if (index < step) classNames.push("is-past");
    if (index === step) classNames.push("is-current");
    if (event.cancel) classNames.push("is-cancel");
    const top = (index - 1) * 68 + 8;
    return `
      <li class="${classNames.join(" ")}" data-from="${event.from}" data-to="${event.to}" style="top:${top}px">
        <span class="event-line" aria-hidden="true"></span>
        <span class="event-label">${event.label}</span>
        ${stateTokens(displayEvent)}
        <span class="event-state">実体 ${displayEvent.owner} ／ 登記 ${displayEvent.registry}</span>
      </li>`;
  }).join("");
}

/**
 * 最終ステップの判断ボタンを描画し、回答操作を設定する。
 *
 * @param {ScenarioEvent} current 表示中のステップ情報
 * @returns {void}
 */
function renderDecision(current) {
  if (!current.decision) {
    elements.decision.hidden = true;
    elements.decision.innerHTML = "";
    return;
  }

  elements.decision.hidden = false;
  if (current.decision === "before") {
    elements.decision.innerHTML = `
      <p>Cの状態を選び、取消しによる復帰の効果がCへ届くか確かめてください。</p>
      <div>
        <button type="button" data-result="protected" aria-pressed="${result === "protected"}">Cは善意・無過失</button>
        <button type="button" data-result="unprotected" aria-pressed="${result === "unprotected"}">Cは悪意または有過失</button>
      </div>`;
  } else {
    elements.decision.innerHTML = `
      <p>どちらが先に登記を備えますか？</p>
      <div>
        <button type="button" data-result="a" aria-pressed="${result === "a"}">Aが先に復帰登記</button>
        <button type="button" data-result="c" aria-pressed="${result === "c"}">Cが先に移転登記</button>
      </div>`;
  }

  elements.decision.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      result = button.dataset.result;
      stopPlaying();
      render();
      elements.back.focus();
    });
  });
}

/**
 * 現在の事例・ステップ・回答に基づいて教材画面全体を描画する。
 *
 * @returns {void}
 */
function render() {
  const scenario = scenarios[scenarioKey];
  const baseEvent = scenario.events[step];
  const current = getEventResult(baseEvent);
  const cancelIndex = scenario.events.findIndex((event) => event.cancel);

  elements.title.textContent = current.title;
  elements.stepLabel.textContent = `STEP ${step} / ${scenario.events.length - 1}`;
  elements.owner.textContent = current.owner;
  elements.registry.textContent = current.registry;
  elements.rule.textContent = current.rule;
  elements.relation.textContent = current.relation;
  elements.cRole.textContent = scenario.cRole;
  elements.cActor.classList.toggle("is-absent", scenarioKey === "after" && step < 4);
  const effectFlow = current.effectOutcome
    ? `<div class="effect-flow" aria-label="取消しの効果の二段階">
        <span><b>1</b>取消しにより<br />所有権復帰の効果が発生</span>
        <i aria-hidden="true">→</i>
        <span><b>2</b>96条3項<br /><strong>${current.effectOutcome}</strong></span>
      </div>`
    : "";
  elements.explanation.innerHTML = `<p class="conclusion">${current.conclusion}</p><p>${current.detail}</p>${effectFlow}`;

  renderEvents(scenario.events);
  renderDecision(baseEvent);

  const cancelTop = (cancelIndex - 1) * 68 + 104;
  elements.cancelMoment.style.top = `${cancelTop}px`;
  elements.cancelMoment.classList.toggle("is-visible", step >= cancelIndex);

  elements.back.disabled = step === 0;
  elements.next.hidden = step >= scenario.events.length - 1;
  elements.next.textContent = current.next || "次へ";
  elements.advancedEntry.hidden = !(step === scenario.events.length - 1 && result);
  if (elements.advancedEntry.hidden) {
    elements.advancedPanel.hidden = true;
    elements.advancedOpen.setAttribute("aria-expanded", "false");
  }

  elements.scenarioButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.scenario === scenarioKey));
  });
  if (urlSyncEnabled) syncUrlState();
}

/**
 * 現在の基本事例を先頭ステップへ戻し、回答と発展問題を閉じる。
 *
 * @returns {void}
 */
function reset() {
  stopPlaying();
  step = 0;
  result = null;
  elements.advancedPanel.hidden = true;
  elements.advancedOpen.setAttribute("aria-expanded", "false");
  render();
}

elements.scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scenarioKey = button.dataset.scenario;
    reset();
  });
});

elements.next.addEventListener("click", () => {
  const lastStep = scenarios[scenarioKey].events.length - 1;
  if (step < lastStep) step += 1;
  result = null;
  render();
});

elements.back.addEventListener("click", () => {
  stopPlaying();
  if (step > 0) step -= 1;
  result = null;
  render();
});

elements.reset.addEventListener("click", reset);
elements.share.addEventListener("click", copyCurrentUrl);

elements.advancedOpen.addEventListener("click", () => {
  const willOpen = elements.advancedPanel.hidden;
  elements.advancedPanel.hidden = !willOpen;
  elements.advancedOpen.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) renderAdvanced();
  else if (urlSyncEnabled) syncUrlState();
});

elements.advancedClose.addEventListener("click", () => {
  elements.advancedPanel.hidden = true;
  elements.advancedOpen.setAttribute("aria-expanded", "false");
  if (urlSyncEnabled) syncUrlState();
  elements.advancedOpen.focus();
});

elements.dTimingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dTiming = button.dataset.dTiming;
    renderAdvanced();
  });
});

elements.cProtectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cIsProtected = button.dataset.cProtection === "protected";
    renderAdvanced();
  });
});

elements.dProtectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dIsProtected = button.dataset.dProtection === "protected";
    renderAdvanced();
  });
});

elements.advancedWinnerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    advancedWinner = button.dataset.advancedWinner;
    renderAdvanced();
  });
});

elements.play.addEventListener("click", () => {
  if (playTimer) {
    stopPlaying();
    return;
  }
  if (step >= scenarios[scenarioKey].events.length - 1) reset();
  elements.play.setAttribute("aria-pressed", "true");
  elements.play.textContent = "■ 一時停止";
  playTimer = window.setInterval(() => {
    const lastStep = scenarios[scenarioKey].events.length - 1;
    if (step >= lastStep - 1) {
      step = lastStep;
      stopPlaying();
    } else {
      step += 1;
    }
    result = null;
    render();
  }, 1400);
});

render();
if (initialState.advancedOpen && !elements.advancedEntry.hidden) {
  elements.advancedPanel.hidden = false;
  elements.advancedOpen.setAttribute("aria-expanded", "true");
  renderAdvanced();
}
urlSyncEnabled = true;
syncUrlState();
