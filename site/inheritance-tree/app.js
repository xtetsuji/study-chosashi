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
  {
    id: "exclusion-and-representation",
    category: "廃除",
    title: "廃除された子の枝を孫が代襲する",
    summary: "子が廃除によって相続権を失った場合でも、その子の枝は孫へ続くことを確認します。",
    facts: [
      ["被相続人", "和也（かずや）"],
      ["家族", "配偶者・子2人・孫1人"],
      ["廃除", "子・玲奈について審判が確定"],
    ],
    events: [
      { date: "2010", label: "家族", note: "和也には、配偶者の智子と2人の子・翔、玲奈がいます。", changedPeople: ["kazuya", "tomoko", "sho", "rena"] },
      { date: "2018", label: "孫の出生", note: "玲奈の子として空が生まれました。", changedPeople: ["sora"] },
      { date: "2024", label: "廃除の審判", note: "玲奈について、家庭裁判所の廃除の審判が確定したものとします。", changedPeople: ["rena"] },
      { date: "2026", label: "相続開始", note: "和也が死亡しました。玲奈の枝を空が代襲するかを判定します。", changedPeople: ["kazuya"] },
    ],
    people: {
      kazuya: { name: "和也", relation: "被相続人", diedStep: 3 },
      tomoko: { name: "智子", relation: "配偶者" },
      sho: { name: "翔", relation: "子" },
      rena: { name: "玲奈", relation: "子・廃除", excludedStep: 2 },
      sora: { name: "空", relation: "孫", parent: "rena", bornStep: 1 },
    },
    root: ["kazuya", "tomoko"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "翔の枝", roots: ["sho"] },
      { label: "玲奈の枝", roots: ["rena"] },
    ],
    answerOrder: ["tomoko", "sho", "rena", "sora"],
    heirs: {
      tomoko: { share: "1/2", note: "配偶者の取り分" },
      sho: { share: "1/4", note: "翔の枝の取り分" },
      sora: { share: "1/4", note: "廃除された玲奈の枝を代襲" },
    },
    nonHeirs: {
      rena: "廃除によって相続権を失っています。ただし、玲奈の子・空は玲奈を代襲します。",
    },
    reasoning: [
      ["廃除", "玲奈は廃除によって相続権を失うため、自身は相続人になりません。"],
      ["代襲", "廃除は民法887条2項の代襲原因に含まれるため、玲奈の子・空が玲奈の枝を代襲します。"],
      ["相続分", "配偶者が1/2、子の枝全体が1/2。翔の枝と玲奈の枝を各1/4とします。"],
    ],
  },
  {
    id: "renunciation-no-representation",
    category: "相続放棄",
    title: "相続放棄では孫が代襲しない",
    summary: "子が相続放棄した場合、その子の子どもへ枝が続かない点を、廃除の事例と比較します。",
    facts: [
      ["被相続人", "直樹（なおき）"],
      ["家族", "配偶者・子2人・孫1人"],
      ["相続放棄", "子・美奈が家庭裁判所へ申述"],
    ],
    events: [
      { date: "2010", label: "家族", note: "直樹には、配偶者の彩と2人の子・航太、美奈がいます。", changedPeople: ["naoki", "aya", "kota", "mina"] },
      { date: "2018", label: "孫の出生", note: "美奈の子として悠人が生まれました。", changedPeople: ["yuto"] },
      { date: "2026", label: "相続開始", note: "直樹が死亡しました。この時点では美奈も第1順位の相続人候補です。", changedPeople: ["naoki"] },
      { date: "2026", label: "相続放棄", note: "美奈の相続放棄の申述が家庭裁判所に受理されたものとします。", changedPeople: ["mina"] },
    ],
    people: {
      naoki: { name: "直樹", relation: "被相続人", diedStep: 2 },
      aya: { name: "彩", relation: "配偶者" },
      kota: { name: "航太", relation: "子" },
      mina: { name: "美奈", relation: "子・相続放棄", renouncedStep: 3 },
      yuto: { name: "悠人", relation: "孫", parent: "mina", bornStep: 1 },
    },
    root: ["naoki", "aya"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "航太の枝", roots: ["kota"] },
      { label: "美奈の枝", roots: ["mina"] },
    ],
    answerOrder: ["aya", "kota", "mina", "yuto"],
    heirs: {
      aya: { share: "1/2", note: "配偶者の取り分" },
      kota: { share: "1/2", note: "相続放棄後に残る唯一の子" },
    },
    nonHeirs: {
      mina: "相続放棄により、初めから相続人でなかったものとみなされます。",
      yuto: "相続放棄は代襲原因ではないため、美奈を代襲しません。",
    },
    reasoning: [
      ["放棄の効力", "美奈は相続放棄により、初めから相続人でなかったものとみなされます。"],
      ["代襲なし", "民法887条2項は死亡・欠格・廃除を代襲原因としていますが、相続放棄は含みません。悠人は代襲しません。"],
      ["相続分", "配偶者の彩が1/2、相続する唯一の子・航太が子全体の1/2を取得します。"],
    ],
  },
  {
    id: "renunciation-moves-to-ascendant",
    category: "順位移動",
    title: "唯一の子が放棄すると直系尊属へ移る",
    summary: "第1順位の子が相続放棄し、孫が代襲しない結果、第2順位の母が相続人になる事例です。",
    facts: [
      ["被相続人", "春子（はるこ）"],
      ["家族", "母・子・孫（配偶者なし）"],
      ["相続放棄", "唯一の子・圭太が放棄"],
    ],
    events: [
      { date: "2015", label: "家族", note: "春子には、母・富美、子・圭太、孫・七海がいます。父と配偶者はいません。", changedPeople: ["haruko", "fumi", "keita", "nanami"] },
      { date: "2026", label: "相続開始", note: "春子が死亡しました。この時点では唯一の子・圭太が第1順位です。", changedPeople: ["haruko"] },
      { date: "2026", label: "相続放棄", note: "圭太の相続放棄の申述が家庭裁判所に受理されたものとします。", changedPeople: ["keita"] },
    ],
    people: {
      fumi: { name: "富美", relation: "母・第2順位" },
      haruko: { name: "春子", relation: "被相続人", diedStep: 1 },
      keita: { name: "圭太", relation: "子・相続放棄", parent: "haruko", renouncedStep: 2 },
      nanami: { name: "七海", relation: "孫", parent: "keita" },
    },
    treeLayout: "direct-ascendant",
    root: ["haruko"],
    candidateHeading: "第1順位から第2順位への移動",
    branches: [],
    answerOrder: ["fumi", "keita", "nanami"],
    heirs: {
      fumi: { share: "全部", note: "相続する唯一の直系尊属" },
    },
    nonHeirs: {
      keita: "相続放棄により、初めから相続人でなかったものとみなされます。",
      nanami: "相続放棄は代襲原因ではないため、圭太を代襲しません。",
    },
    reasoning: [
      ["第1順位", "圭太は相続放棄により、初めから相続人でなかったものとみなされます。七海も代襲しません。"],
      ["順位移動", "第1順位の相続人がいなくなったため、民法889条により第2順位の直系尊属を検討します。"],
      ["結論", "配偶者はおらず、最も近い直系尊属は母・富美だけなので、富美が全部を相続します。"],
    ],
  },
  {
    id: "dual-capacity-adopted-grandchild",
    category: "二重資格",
    title: "孫が養子と代襲者の二つの資格を持つ",
    summary: "被相続人の養子でもある孫が、実親の枝を代襲し、自身の子としての取り分と合わせて取得する事例です。",
    facts: [
      ["被相続人", "泰三（たいぞう）"],
      ["家族", "子2人・孫1人（配偶者なし）"],
      ["過去問論点", "令和3年度・第3問を再構成"],
    ],
    events: [
      { date: "2005", label: "家族", note: "泰三には、2人の子・大地と恵、孫・陸がいます。陸は大地の子です。", changedPeople: ["taizo", "daichi", "megumi2", "riku2"] },
      { date: "2015", label: "養子縁組", note: "泰三が孫・陸を養子にしました。陸は泰三の子としての資格も持ちます。", changedPeople: ["taizo", "riku2"] },
      { date: "2024", label: "大地が死亡", note: "泰三の子・大地が、泰三より先に死亡しました。", changedPeople: ["daichi"] },
      { date: "2026", label: "相続開始", note: "泰三が死亡しました。陸の二つの資格を分けて相続分を計算します。", changedPeople: ["taizo"] },
    ],
    people: {
      taizo: { name: "泰三", relation: "被相続人", diedStep: 3 },
      daichi: { name: "大地", relation: "子", diedStep: 2 },
      megumi2: { name: "恵", relation: "子" },
      riku2: { name: "陸", relation: "孫・泰三の養子", relationBeforeConnection: "孫", parent: "daichi", connectionStep: 1 },
    },
    treeLayout: "dual-capacity",
    root: ["taizo"],
    candidateHeading: "第1順位｜子の資格と代襲者の資格",
    branches: [
      { label: "恵の枝", roots: ["megumi2"] },
      { label: "大地の枝｜陸が代襲", roots: ["daichi"] },
    ],
    answerChoices: [
      { key: "megumi2", personId: "megumi2" },
      { key: "daichi", personId: "daichi" },
      { key: "riku2:representation", personId: "riku2", label: "陸①", detail: "大地の代襲者として" },
      { key: "riku2:adopted-child", personId: "riku2", label: "陸②", detail: "泰三の養子として" },
    ],
    correctChoiceKeys: ["megumi2", "riku2:representation", "riku2:adopted-child"],
    answerByCapacity: true,
    heirs: {
      megumi2: { share: "1/3", note: "恵自身の子としての取り分" },
      riku2: { share: "2/3", note: "養子として1/3＋大地の代襲者として1/3" },
    },
    nonHeirs: {
      daichi: "相続開始前に死亡しています。大地の枝は陸が代襲します。",
    },
    reasoning: [
      ["子の資格", "陸は泰三の養子なので、恵・大地と並ぶ泰三の子として1/3の取り分を持ちます。"],
      ["代襲者の資格", "大地が先に死亡しているため、大地の子・陸は大地の枝の1/3も代襲します。"],
      ["合算", "恵は1/3。陸は養子としての1/3と代襲による1/3を合わせ、2/3を取得します。"],
    ],
  },
  {
    id: "fetus-representation",
    category: "胎児",
    title: "相続開始時の胎児が生きて生まれる",
    summary: "相続開始時に胎児だった孫が、その後生きて生まれ、先に死亡した親を代襲する事例です。",
    facts: [
      ["被相続人", "清（きよし）"],
      ["家族", "子2人・孫1人（配偶者なし）"],
      ["過去問論点", "令和6年度・第3問を再構成"],
    ],
    events: [
      { date: "2024", label: "家族", note: "清には、2人の子・雅美と哲がいます。", changedPeople: ["kiyoshi", "masami", "tetsu"] },
      { date: "2025", label: "哲が死亡", note: "清の子・哲が先に死亡しました。哲の子は胎児として存在しています。", changedPeople: ["tetsu", "mio2"] },
      { date: "2026", label: "相続開始", note: "清が死亡しました。この時点で哲の子・澪は胎児です。", changedPeople: ["kiyoshi", "mio2"] },
      { date: "2026", label: "生きて出生", note: "澪が生きて生まれました。相続について既に生まれたものとみなせるかを判定します。", changedPeople: ["mio2"] },
    ],
    people: {
      kiyoshi: { name: "清", relation: "被相続人", diedStep: 2 },
      masami: { name: "雅美", relation: "子" },
      tetsu: { name: "哲", relation: "子", diedStep: 1 },
      mio2: { name: "澪", relation: "孫・相続開始時は胎児", parent: "tetsu", appearsStep: 1, bornStep: 3, fetalUntilStep: 3 },
    },
    root: ["kiyoshi"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "雅美の枝", roots: ["masami"] },
      { label: "哲の枝", roots: ["tetsu"] },
    ],
    answerOrder: ["masami", "tetsu", "mio2"],
    heirs: {
      masami: { share: "1/2", note: "雅美の枝の取り分" },
      mio2: { share: "1/2", note: "哲の枝を胎児として代襲" },
    },
    nonHeirs: {
      tetsu: "相続開始前に死亡しています。哲の枝は澪が代襲します。",
    },
    reasoning: [
      ["胎児", "胎児は相続について既に生まれたものとみなされます。今回は澪が生きて生まれた事例です。"],
      ["代襲", "哲は清より先に死亡しているため、哲の子・澪が哲の枝を代襲します。"],
      ["相続分", "雅美の枝と哲の枝が各1/2。澪が哲の枝の1/2を取得します。"],
    ],
  },
  {
    id: "disqualification-and-representation",
    category: "相続欠格",
    title: "相続欠格となった子の枝を孫が代襲する",
    summary: "相続欠格となった本人は相続できませんが、その子が欠格者の枝を代襲する事例です。",
    facts: [
      ["被相続人", "正雄（まさお）"],
      ["家族", "子2人・孫1人（配偶者なし）"],
      ["過去問論点", "平成30年度・第3問を再構成"],
    ],
    events: [
      { date: "2015", label: "家族", note: "正雄には、2人の子・淳と亮、孫・咲がいます。咲は亮の子です。", changedPeople: ["masao", "jun2", "ryo2", "saki2"] },
      { date: "2026", label: "相続開始", note: "正雄が死亡しました。", changedPeople: ["masao"] },
      { date: "2026", label: "相続欠格", note: "亮が民法891条の欠格事由に該当し、刑に処せられたものとします。", changedPeople: ["ryo2"] },
    ],
    people: {
      masao: { name: "正雄", relation: "被相続人", diedStep: 1 },
      jun2: { name: "淳", relation: "子" },
      ryo2: { name: "亮", relation: "子・相続欠格", disqualifiedStep: 2 },
      saki2: { name: "咲", relation: "孫", parent: "ryo2" },
    },
    root: ["masao"],
    candidateHeading: "第1順位｜子どもの枝",
    branches: [
      { label: "淳の枝", roots: ["jun2"] },
      { label: "亮の枝", roots: ["ryo2"] },
    ],
    answerOrder: ["jun2", "ryo2", "saki2"],
    heirs: {
      jun2: { share: "1/2", note: "淳の枝の取り分" },
      saki2: { share: "1/2", note: "欠格となった亮の枝を代襲" },
    },
    nonHeirs: {
      ryo2: "相続欠格により相続人となることができません。ただし、亮の子・咲は亮を代襲します。",
    },
    reasoning: [
      ["相続欠格", "亮は民法891条の欠格事由に該当するため、自身は相続人になれません。"],
      ["代襲", "相続欠格は民法887条2項の代襲原因に含まれるため、亮の子・咲が亮の枝を代襲します。"],
      ["相続分", "淳の枝と亮の枝が各1/2。咲が亮の枝の1/2を取得します。"],
    ],
  },
];

let scenarioIndex = 0;
let snapshotIndex = 0;
let selectedPeople = new Set();
let enteredShares = new Map();
let answerMode = "heirs";
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
  questionTitle: byId("question-title"),
  questionHelp: byId("question-help"),
  heirsModeButton: byId("heirs-mode-button"),
  sharesModeButton: byId("shares-mode-button"),
  answerOptions: byId("answer-options"),
  shareAnswerPanel: byId("share-answer-panel"),
  shareAnswerList: byId("share-answer-list"),
  shareAnswerTotal: byId("share-answer-total"),
  checkButton: byId("check-button"),
  resultPanel: byId("result-panel"),
  resultKicker: byId("result-kicker"),
  resultTitle: byId("result-title"),
  retryButton: byId("retry-button"),
  shareChartTotal: byId("share-chart-total"),
  shareChartBar: byId("share-chart-bar"),
  shareChartLegend: byId("share-chart-legend"),
  shareGrid: byId("share-grid"),
  reasoning: byId("reasoning"),
  notHeirs: byId("not-heirs"),
};

function currentScenario() {
  return scenarios[scenarioIndex];
}

function clearAnswerState() {
  selectedPeople = new Set();
  enteredShares = new Map();
  isRevealed = false;
}

function isVisible(person) {
  return (person.appearsStep ?? person.bornStep ?? 0) <= snapshotIndex;
}

function isDead(person) {
  return person.diedStep !== undefined && person.diedStep <= snapshotIndex;
}

function isExcluded(person) {
  return person.excludedStep !== undefined && person.excludedStep <= snapshotIndex;
}

function hasRenounced(person) {
  return person.renouncedStep !== undefined && person.renouncedStep <= snapshotIndex;
}

function isDisqualified(person) {
  return person.disqualifiedStep !== undefined && person.disqualifiedStep <= snapshotIndex;
}

function isFetal(person) {
  return person.fetalUntilStep !== undefined && snapshotIndex < person.fetalUntilStep;
}

function isFinalSnapshot() {
  return snapshotIndex === currentScenario().events.length - 1;
}

function answerChoicesFor(scenario) {
  return scenario.answerChoices
    ?? scenario.answerOrder.map((personId) => ({ key: personId, personId }));
}

function choiceIsCorrect(scenario, choiceKey) {
  if (scenario.correctChoiceKeys) return scenario.correctChoiceKeys.includes(choiceKey);
  const choice = answerChoicesFor(scenario).find(({ key }) => key === choiceKey);
  return Boolean(choice && scenario.heirs[choice.personId]);
}

function personCard(personId, options = {}) {
  const scenario = currentScenario();
  const person = scenario.people[personId];
  const {
    instanceKey = "",
    capacityLabel = "",
    capacityShare = "",
    choiceKey = personId,
  } = options;
  const relation = person.connectionStep !== undefined && snapshotIndex < person.connectionStep
    ? person.relationBeforeConnection ?? person.relation
    : person.relation;
  const selectable = isFinalSnapshot()
    && !isRevealed
    && answerChoicesFor(scenario).some(({ key }) => key === choiceKey)
    && isVisible(person);
  const selected = selectedPeople.has(choiceKey);
  const correctChoice = choiceIsCorrect(scenario, choiceKey);
  const finalDecedent = isFinalSnapshot() && person.relation === "被相続人";
  const changedThisStep = scenario.events[snapshotIndex].changedPeople?.includes(personId) ?? false;
  const excluded = isExcluded(person);
  const renounced = hasRenounced(person);
  const disqualified = isDisqualified(person);
  const fetal = isFetal(person);
  const legalStatus = excluded ? "廃除" : renounced ? "相続放棄" : disqualified ? "相続欠格" : "";
  const card = document.createElement(selectable ? "button" : "div");
  card.className = "person-card";
  card.dataset.person = personId;
  card.dataset.choice = choiceKey;
  if (instanceKey) card.dataset.instance = instanceKey;
  if (capacityLabel) card.classList.add("is-duplicate-person");

  if (selectable) {
    card.type = "button";
    card.classList.add("is-selectable");
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
    card.setAttribute(
      "aria-label",
      `${person.name}（${relation}${capacityLabel ? `、${capacityLabel}、同一人物` : ""}）を${selected ? "選択解除" : "法定相続人として選択"}`,
    );
    card.addEventListener("click", () => togglePersonSelection(personId, "card", undefined, instanceKey, choiceKey));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      togglePersonSelection(personId, "card", undefined, instanceKey, choiceKey);
    });
  }

  if (!isVisible(person)) card.classList.add("is-not-born");
  if (isDead(person)) card.classList.add("is-dead");
  if (excluded) card.classList.add("is-excluded");
  if (renounced) card.classList.add("is-renounced");
  if (disqualified) card.classList.add("is-disqualified");
  if (fetal) card.classList.add("is-fetal");
  if (changedThisStep && !finalDecedent) card.classList.add("has-current-change");
  if (finalDecedent) card.classList.add("is-decedent-final");

  if (isRevealed && isFinalSnapshot()) {
    if (correctChoice) {
      card.classList.add("is-heir");
      if (!selected) card.classList.add("is-missed");
    } else if (selected) {
      card.classList.add("is-wrong");
    }
  }

  const state = selected && !isRevealed
    ? legalStatus
      ? `● 選択済み（${legalStatus}）`
      : isDead(person)
        ? "● 選択済み（死亡）"
        : "● 選択済み"
    : isDead(person)
      ? "死亡"
      : !isRevealed && legalStatus
        ? legalStatus
      : !isRevealed && fetal
        ? "胎児"
      : isRevealed && correctChoice
        ? "✓ 法定相続人"
        : isRevealed
          ? selected
            ? `選択したが対象外${legalStatus ? `（${legalStatus}）` : ""}`
            : legalStatus
              ? `対象外（${legalStatus}）`
              : "対象外"
          : "生存";
  const share = isRevealed && correctChoice
    ? `<span class="person-share">${capacityShare || scenario.heirs[personId].share}</span>`
    : "";

  card.innerHTML = `
    ${selected && !isRevealed ? '<span class="selection-mark" aria-hidden="true">選択中</span>' : ""}
    ${changedThisStep && !finalDecedent ? '<span class="change-mark">今回の変化</span>' : ""}
    ${finalDecedent ? `<span class="decedent-mark">${person.diedStep === snapshotIndex ? "相続開始" : "被相続人"}</span>` : ""}
    ${capacityLabel ? `<span class="capacity-mark">${capacityLabel}</span>` : ""}
    <span class="person-name">${person.name}</span>
    <span class="person-relation">${relation}</span>
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

function renderDirectAscendantTree() {
  const ascendantTree = document.createElement("div");
  ascendantTree.className = "direct-ascendant-tree";
  ascendantTree.append(personCard("fumi"));

  const descendants = document.createElement("div");
  descendants.className = "descendants direct-ascendant-descendants";
  descendants.append(descendantUnit("haruko"));
  ascendantTree.append(descendants);
  elements.treeStage.append(ascendantTree);
}

function renderDualCapacityTree(scenario) {
  const root = document.createElement("div");
  root.className = "tree-root";
  root.append(personCard("taizo"));
  elements.treeStage.append(root);

  const guide = document.createElement("div");
  guide.className = "dual-capacity-guide";
  guide.innerHTML = snapshotIndex < scenario.people.riku2.connectionStep
    ? "<strong>現在の陸は1人です</strong><span>まだ大地の子としてだけ家系図に現れています。</span>"
    : "<strong>2枚の陸は同一人物です</strong><span>①大地の子・代襲者として ＋ ②泰三の養子として</span>";
  elements.treeStage.append(guide);

  const heading = document.createElement("div");
  heading.className = "candidate-heading";
  heading.textContent = scenario.candidateHeading;
  elements.treeStage.append(heading);

  const branches = document.createElement("div");
  branches.className = "tree-branches dual-capacity-branches";

  const megumiBranch = document.createElement("section");
  megumiBranch.className = "family-branch";
  megumiBranch.innerHTML = '<span class="branch-label">恵｜子の資格</span>';
  const megumiPeople = document.createElement("div");
  megumiPeople.className = "branch-people";
  megumiPeople.append(personCard("megumi2"));
  megumiBranch.append(megumiPeople);

  const daichiBranch = document.createElement("section");
  daichiBranch.className = "family-branch";
  daichiBranch.innerHTML = '<span class="branch-label">大地の枝｜陸が代襲</span>';
  const daichiPeople = document.createElement("div");
  daichiPeople.className = "branch-people";
  const daichiUnit = document.createElement("div");
  daichiUnit.className = "descendant-unit";
  daichiUnit.append(personCard("daichi"));
  const representation = document.createElement("div");
  representation.className = "descendants";
  representation.append(personCard("riku2", {
    instanceKey: "representation",
    choiceKey: "riku2:representation",
    capacityLabel: "同一人物①｜代襲",
    capacityShare: "1/3",
  }));
  daichiUnit.append(representation);
  daichiPeople.append(daichiUnit);
  daichiBranch.append(daichiPeople);

  const adoptedBranch = document.createElement("section");
  adoptedBranch.className = "family-branch dual-capacity-adopted-branch";
  const beforeAdoption = snapshotIndex < scenario.people.riku2.connectionStep;
  if (beforeAdoption) adoptedBranch.classList.add("is-inactive");
  adoptedBranch.innerHTML = `<span class="branch-label">${beforeAdoption ? "まだ養子関係なし" : "陸｜泰三の養子"}</span>`;
  const adoptedPeople = document.createElement("div");
  adoptedPeople.className = "branch-people";
  if (beforeAdoption) {
    const badge = document.createElement("span");
    badge.className = "event-badge";
    badge.textContent = "養子縁組後に同一人物の陸が現れます";
    adoptedPeople.append(badge);
  } else {
    adoptedPeople.append(personCard("riku2", {
      instanceKey: "adopted-child",
      choiceKey: "riku2:adopted-child",
      capacityLabel: "同一人物②｜養子",
      capacityShare: "1/3",
    }));
  }
  adoptedBranch.append(adoptedPeople);

  branches.append(megumiBranch, daichiBranch, adoptedBranch);
  elements.treeStage.append(branches);
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

  if (scenario.treeLayout === "direct-ascendant") {
    renderDirectAscendantTree();
    return;
  }

  if (scenario.treeLayout === "dual-capacity") {
    renderDualCapacityTree(scenario);
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
      clearAnswerState();
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
  answerChoicesFor(scenario).forEach((choice) => {
    const { key, personId } = choice;
    const person = scenario.people[personId];
    if (!isVisible(person)) return;
    const label = document.createElement("label");
    label.className = "answer-choice";
    label.innerHTML = `
      <input type="checkbox" value="${key}" ${selectedPeople.has(key) ? "checked" : ""} ${isRevealed ? "disabled" : ""} />
      <span>${choice.label ?? person.name}<small>（${choice.detail ?? person.relation}）</small></span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      togglePersonSelection(personId, "checkbox", event.target.checked, "", key);
    });
    elements.answerOptions.append(label);
  });
}

function selectedPersonIdsForShares(scenario) {
  return answerChoicesFor(scenario).reduce((personIds, choice) => {
    if (selectedPeople.has(choice.key) && !personIds.includes(choice.personId)) {
      personIds.push(choice.personId);
    }
    return personIds;
  }, []);
}

function enteredFractionFor(personId) {
  const answer = enteredShares.get(personId);
  if (!answer || answer.numerator === "" || answer.denominator === "") return null;
  const numerator = Number(answer.numerator);
  const denominator = Number(answer.denominator);
  if (!Number.isInteger(numerator) || numerator < 0 || !Number.isInteger(denominator) || denominator <= 0) {
    return null;
  }
  return { numerator, denominator };
}

function shareInputIsCorrect(personId) {
  const expectedShare = currentScenario().heirs[personId]?.share;
  const entered = enteredFractionFor(personId);
  if (!expectedShare || !entered) return false;
  const expected = shareToFraction(expectedShare);
  return entered.numerator * expected.denominator === expected.numerator * entered.denominator;
}

function updateShareAnswerTotal() {
  const personIds = selectedPersonIdsForShares(currentScenario());
  const fractions = personIds.map(enteredFractionFor);
  elements.shareAnswerTotal.classList.remove("is-complete");
  if (!personIds.length || fractions.some((fraction) => !fraction)) {
    elements.shareAnswerTotal.textContent = "入力合計 —";
    return;
  }

  let total = { numerator: 0, denominator: 1 };
  fractions.forEach((fraction) => {
    total = {
      numerator: total.numerator * fraction.denominator + fraction.numerator * total.denominator,
      denominator: total.denominator * fraction.denominator,
    };
    const divisor = greatestCommonDivisor(total.numerator, total.denominator);
    total.numerator /= divisor;
    total.denominator /= divisor;
  });
  elements.shareAnswerTotal.textContent = `入力合計 ${total.numerator}/${total.denominator}`;
  elements.shareAnswerTotal.classList.toggle("is-complete", total.numerator === total.denominator);
}

function renderShareAnswerPanel() {
  const scenario = currentScenario();
  elements.shareAnswerPanel.hidden = answerMode !== "shares";
  elements.shareAnswerList.replaceChildren();
  if (answerMode !== "shares") return;

  const personIds = selectedPersonIdsForShares(scenario);
  if (!personIds.length) {
    const empty = document.createElement("p");
    empty.className = "share-answer-empty";
    empty.textContent = "法定相続人だと思う人物を選ぶと、ここに相続分の入力欄が現れます。";
    elements.shareAnswerList.append(empty);
    updateShareAnswerTotal();
    return;
  }

  personIds.forEach((personId) => {
    const person = scenario.people[personId];
    const answer = enteredShares.get(personId) ?? { numerator: "", denominator: "" };
    const row = document.createElement("div");
    row.className = "share-answer-row";
    if (isRevealed) row.classList.add(shareInputIsCorrect(personId) ? "is-correct" : "is-wrong");
    const detail = scenario.answerByCapacity && personId === "riku2"
      ? "2つの資格による取り分を合算"
      : person.relation;
    const result = isRevealed
      ? scenario.heirs[personId]
        ? shareInputIsCorrect(personId)
          ? "✓ 相続分も正解です"
          : `正解は ${scenario.heirs[personId].share}`
        : "この人物は法定相続人ではありません"
      : "";
    row.innerHTML = `
      <span class="share-answer-person"><strong>${person.name}</strong><small>${detail}</small></span>
      <span class="fraction-input">
        <input type="number" min="0" max="99" step="1" inputmode="numeric" data-field="numerator" value="${answer.numerator}" aria-label="${person.name}の相続分の分子" ${isRevealed ? "disabled" : ""} />
        <span class="fraction-divider" aria-hidden="true">／</span>
        <input type="number" min="1" max="99" step="1" inputmode="numeric" data-field="denominator" value="${answer.denominator}" aria-label="${person.name}の相続分の分母" ${isRevealed ? "disabled" : ""} />
      </span>
      ${result ? `<span class="fraction-result">${result}</span>` : ""}
    `;
    row.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (event) => {
        const nextAnswer = { ...(enteredShares.get(personId) ?? { numerator: "", denominator: "" }) };
        nextAnswer[event.target.dataset.field] = event.target.value;
        enteredShares.set(personId, nextAnswer);
        updateShareAnswerTotal();
      });
    });
    elements.shareAnswerList.append(row);
  });
  updateShareAnswerTotal();
}

function renderAnswerModeSwitch() {
  elements.heirsModeButton.setAttribute("aria-pressed", String(answerMode === "heirs"));
  elements.sharesModeButton.setAttribute("aria-pressed", String(answerMode === "shares"));
  elements.heirsModeButton.disabled = isRevealed;
  elements.sharesModeButton.disabled = isRevealed;
}

function updateQuestionHelp() {
  const scenario = currentScenario();
  if (answerMode === "shares") {
    elements.questionHelp.textContent = scenario.answerByCapacity
      ? "陸は資格ごとに選び、相続分は2つの資格による取り分を合算して入力します。"
      : "相続人を選ぶと相続分の入力欄が現れます。分子と分母を入力してください。";
    return;
  }
  if (scenario.answerByCapacity) {
    elements.questionHelp.textContent = selectedPeople.size
      ? `${selectedPeople.size}つの資格を選択中です。水色の人物カードが、現在選んでいる資格です。`
      : "同じ人物でも、相続する資格ごとに人物カードまたは選択肢から選んでください。";
    return;
  }
  elements.questionHelp.textContent = selectedPeople.size
    ? `${selectedPeople.size}人を選択中です。水色の人物カードが、現在選んでいる人です。`
    : "家系図の人物カード、または下の選択肢から選べます。";
}

function togglePersonSelection(personId, source, forceSelected, instanceKey = "", choiceKey = personId) {
  if (!isFinalSnapshot() || isRevealed) return;
  const shouldSelect = forceSelected ?? !selectedPeople.has(choiceKey);
  if (shouldSelect) selectedPeople.add(choiceKey);
  else selectedPeople.delete(choiceKey);

  renderTree();
  renderAnswerOptions();
  renderShareAnswerPanel();
  updateQuestionHelp();

  if (source === "card") {
    const instanceSelector = instanceKey ? `[data-instance="${instanceKey}"]` : "";
    elements.treeStage.querySelector(`[data-choice="${choiceKey}"]${instanceSelector}`)?.focus();
  } else {
    elements.answerOptions.querySelector(`input[value="${choiceKey}"]`)?.focus();
  }
}

function selectedHeirsAreCorrect() {
  const scenario = currentScenario();
  const correctChoiceKeys = scenario.correctChoiceKeys ?? Object.keys(scenario.heirs);
  return correctChoiceKeys.length === selectedPeople.size
    && correctChoiceKeys.every((key) => selectedPeople.has(key));
}

function enteredSharesAreCorrect() {
  if (answerMode !== "shares") return true;
  return Object.keys(currentScenario().heirs).every(shareInputIsCorrect);
}

function selectedAnswerIsCorrect() {
  return selectedHeirsAreCorrect() && enteredSharesAreCorrect();
}

function hasMissedOneDualCapacity() {
  const scenario = currentScenario();
  if (!scenario.answerByCapacity) return false;
  return selectedPeople.has("riku2:representation") !== selectedPeople.has("riku2:adopted-child");
}

function shareToFraction(share) {
  if (share === "全部") return { numerator: 1, denominator: 1 };
  const [numerator, denominator] = share.split("/").map(Number);
  return { numerator, denominator };
}

function greatestCommonDivisor(left, right) {
  let a = left;
  let b = right;
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function leastCommonMultiple(left, right) {
  return (left * right) / greatestCommonDivisor(left, right);
}

function renderShareChart(scenario) {
  elements.shareChartBar.replaceChildren();
  elements.shareChartLegend.replaceChildren();
  const heirEntries = Object.entries(scenario.heirs);
  const commonDenominator = heirEntries
    .map(([, share]) => shareToFraction(share.share).denominator)
    .reduce(leastCommonMultiple, 1);
  elements.shareChartTotal.textContent = `全体 ＝ ${commonDenominator}/${commonDenominator}`;

  heirEntries.forEach(([personId, share], index) => {
    const person = scenario.people[personId];
    const fraction = shareToFraction(share.share);
    const ratio = fraction.numerator / fraction.denominator;
    const commonNumerator = fraction.numerator * (commonDenominator / fraction.denominator);
    const commonShare = `${commonNumerator}/${commonDenominator}`;
    const showOriginalShare = commonShare !== share.share;
    const tone = `share-tone-${(index % 4) + 1}`;

    const segment = document.createElement("span");
    segment.className = `share-chart-segment ${tone}`;
    if (ratio < 0.22) segment.classList.add("is-compact");
    if (ratio < 0.3) segment.classList.add("has-no-original-label");
    segment.style.flexGrow = String(ratio);
    segment.innerHTML = `
      <span class="share-chart-number">${index + 1}</span>
      <span class="share-chart-segment-label">
        <strong>${person.name}</strong>
        <small>${commonShare}</small>
        ${showOriginalShare ? `<em class="share-chart-original">＝ ${share.share}</em>` : ""}
      </span>
    `;
    elements.shareChartBar.append(segment);

    const legendItem = document.createElement("div");
    legendItem.className = "share-chart-legend-item";
    legendItem.innerHTML = `
      <span class="share-chart-number ${tone}" aria-hidden="true">${index + 1}</span>
      <span><strong>${person.name}</strong><small>${person.relation}</small></span>
      <span class="share-chart-values">
        <b>${commonShare}</b>
        ${showOriginalShare ? `<small>＝ ${share.share}</small>` : ""}
      </span>
    `;
    elements.shareChartLegend.append(legendItem);
  });
}

function renderResult() {
  const scenario = currentScenario();
  const isCorrect = selectedAnswerIsCorrect();
  const heirsCorrect = selectedHeirsAreCorrect();
  elements.resultPanel.hidden = !isRevealed;
  if (!isRevealed) return;

  elements.resultKicker.textContent = isCorrect
    ? "正解です"
    : heirsCorrect && answerMode === "shares"
      ? "相続人の選択は正解です"
      : "家系図で見直しましょう";
  elements.resultTitle.textContent = isCorrect
    ? answerMode === "shares"
      ? "法定相続人と法定相続分を正しく判定できました。"
      : "順位と代襲関係を正しく判定できました。"
    : heirsCorrect && answerMode === "shares"
      ? "法定相続分を見直しましょう。"
    : hasMissedOneDualCapacity()
      ? "陸が相続人になることは判定できましたが、もう一つの資格を見落としています。"
      : "「✓ 法定相続人」と表示された人物・資格が正解です。";

  renderShareChart(scenario);

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
  elements.questionTitle.textContent = answerMode === "shares"
    ? "法定相続人と、その法定相続分を回答してください"
    : currentScenario().answerByCapacity
      ? "法定相続人になる人・資格をすべて選んでください"
      : "法定相続人になる人を全員選んでください";
  renderAnswerModeSwitch();
  renderAnswerOptions();
  renderShareAnswerPanel();
  elements.checkButton.textContent = answerMode === "shares"
    ? "相続人と相続分を答え合わせ"
    : "答え合わせをする";
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
  clearAnswerState();
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
  clearAnswerState();
  render();
}

elements.previousStepButton.addEventListener("click", () => moveToSnapshot(snapshotIndex - 1));
elements.nextStepButton.addEventListener("click", () => moveToSnapshot(snapshotIndex + 1));
elements.heirsModeButton.addEventListener("click", () => {
  if (isRevealed) return;
  answerMode = "heirs";
  renderQuestion();
});
elements.sharesModeButton.addEventListener("click", () => {
  if (isRevealed) return;
  answerMode = "shares";
  renderQuestion();
});

elements.checkButton.addEventListener("click", () => {
  isRevealed = true;
  renderTree();
  renderQuestion();
  renderResult();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.snapshotNote.textContent = selectedAnswerIsCorrect()
    ? "正解です。オレンジの枠と「✓ 法定相続人」の表示で、相続人と相続分を確認してください。"
    : selectedHeirsAreCorrect() && answerMode === "shares"
      ? "法定相続人の選択は正解です。入力した相続分と、結果欄の正しい相続分を見比べてください。"
    : hasMissedOneDualCapacity()
      ? "陸の2枚は同一人物ですが、代襲者と養子の両方の資格をそれぞれ選ぶ必要があります。"
      : "答え合わせを表示しました。「✓ 法定相続人」と表示された人物・資格と、選んだ内容を見比べてください。";
  elements.resultTitle.focus({ preventScroll: true });
  elements.resultTitle.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
});

elements.retryButton.addEventListener("click", () => {
  clearAnswerState();
  renderTree();
  renderQuestion();
  renderResult();
  elements.answerOptions.querySelector("input")?.focus();
});

render();
