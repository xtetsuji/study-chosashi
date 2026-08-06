export const durations = [
  "永久",
  "50年",
  "30年",
  "20年",
  "10年",
  "5年",
  "3年",
  "1年",
] as const;

export type Duration = (typeof durations)[number];

export type Question = {
  id: string;
  category: string;
  prompt: string;
  choices: Duration[];
  correctChoice: Duration;
  explanation: string;
  source?: string;
  tags?: string[];
};

const storagePeriodSource = "不動産登記規則第28条（2026年8月6日確認）";

export const questions: Question[] = [
  {
    id: "storage-registration-record",
    category: "保存期間",
    prompt: "閉鎖されていない登記記録の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "閉鎖登記記録を除く登記記録は、永久に保存される。",
    source: storagePeriodSource,
    tags: ["登記記録"],
  },
  {
    id: "storage-closed-land-record",
    category: "保存期間",
    prompt: "土地に関する閉鎖登記記録の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "50年",
    explanation: "土地に関する閉鎖登記記録は、閉鎖した日から50年間保存される。",
    source: storagePeriodSource,
    tags: ["閉鎖登記記録", "土地"],
  },
  {
    id: "storage-closed-building-record",
    category: "保存期間",
    prompt: "建物に関する閉鎖登記記録の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation: "建物に関する閉鎖登記記録は、閉鎖した日から30年間保存される。",
    source: storagePeriodSource,
    tags: ["閉鎖登記記録", "建物"],
  },
  {
    id: "storage-map",
    category: "保存期間",
    prompt: "地図（閉鎖したものを含む）の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "地図は、閉鎖したものも含めて永久に保存される。",
    source: storagePeriodSource,
    tags: ["地図", "閉鎖地図"],
  },
  {
    id: "storage-map-equivalent-drawing",
    category: "保存期間",
    prompt: "地図に準ずる図面（閉鎖したものを含む）の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "地図に準ずる図面は、閉鎖したものも含めて永久に保存される。",
    source: storagePeriodSource,
    tags: ["地図に準ずる図面", "閉鎖図面"],
  },
  {
    id: "storage-building-location-map",
    category: "保存期間",
    prompt: "建物所在図（閉鎖したものを含む）の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "建物所在図は、閉鎖したものも含めて永久に保存される。",
    source: storagePeriodSource,
    tags: ["建物所在図", "閉鎖建物所在図"],
  },
  {
    id: "storage-land-building-drawings",
    category: "保存期間",
    prompt:
      "申請書類つづり込み帳につづり込まれたものを除く、土地所在図・地積測量図・建物図面・各階平面図の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation:
      "土地所在図、地積測量図、建物図面及び各階平面図は、申請書類つづり込み帳につづり込まれたものを除き、永久に保存される。",
    source: storagePeriodSource,
    tags: ["土地所在図", "地積測量図", "建物図面", "各階平面図"],
  },
  {
    id: "storage-closed-land-building-drawings",
    category: "保存期間",
    prompt:
      "閉鎖した土地所在図・地積測量図・建物図面・各階平面図の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation:
      "これらの閉鎖した図面は、閉鎖した日から30年間保存される。申請書類つづり込み帳につづり込まれたものは別の起算点による。",
    source: storagePeriodSource,
    tags: ["閉鎖図面", "土地所在図", "地積測量図", "建物図面", "各階平面図"],
  },
  {
    id: "storage-filed-drawings",
    category: "保存期間",
    prompt:
      "申請書類つづり込み帳につづり込まれた土地所在図・地積測量図・建物図面・各階平面図・地役権図面の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation:
      "これらの図面は、電磁的記録に記録して保存した日から30年間保存される。",
    source: storagePeriodSource,
    tags: ["申請書類つづり込み帳", "土地所在図", "地積測量図", "建物図面", "各階平面図", "地役権図面"],
  },
  {
    id: "storage-description-application-information",
    category: "保存期間",
    prompt: "表示に関する登記の申請情報及び添付情報（図面を除く）の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation:
      "表示に関する登記の申請情報及び添付情報は、受付の日から30年間保存される。図面には保存方法に応じた別の起算点がある。",
    source: storagePeriodSource,
    tags: ["表示に関する登記", "申請情報", "添付情報"],
  },
  {
    id: "storage-ex-officio-description-documents",
    category: "保存期間",
    prompt: "職権表示登記等書類つづり込み帳につづり込まれた書類の情報の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation: "職権表示登記等の書類に記載された情報は、立件の日から30年間保存される。",
    source: storagePeriodSource,
    tags: ["職権表示登記", "職権表示登記等書類つづり込み帳"],
  },
  {
    id: "storage-joint-collateral-list",
    category: "保存期間",
    prompt: "共同担保目録の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "5年"],
    correctChoice: "10年",
    explanation: "共同担保目録は、全ての事項を抹消した日から10年間保存される。",
    source: storagePeriodSource,
    tags: ["共同担保目録"],
  },
  {
    id: "storage-trust-register",
    category: "保存期間",
    prompt: "信託目録の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "5年"],
    correctChoice: "20年",
    explanation: "信託目録は、信託の登記を抹消した日から20年間保存される。",
    source: storagePeriodSource,
    tags: ["信託目録"],
  },
  {
    id: "storage-reception-book",
    category: "保存期間",
    prompt: "受付帳に記録された情報の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "1年"],
    correctChoice: "10年",
    explanation:
      "受付帳に記録された情報は、受付の年の翌年から10年間保存される。ただし、登記識別情報に関する証明の請求に係る受付帳は別である。",
    source: storagePeriodSource,
    tags: ["受付帳"],
  },
  {
    id: "storage-registration-identification-certificate-reception-book",
    category: "保存期間",
    prompt: "登記識別情報に関する証明の請求に係る受付帳の情報の保存期間は？",
    choices: ["永久", "10年", "5年", "3年", "1年"],
    correctChoice: "1年",
    explanation:
      "登記識別情報に関する証明の請求に係る受付帳の情報は、受付の年の翌年から1年間保存される。",
    source: storagePeriodSource,
    tags: ["受付帳", "登記識別情報", "証明の請求"],
  },
  {
    id: "storage-registration-identification-invalidation-request",
    category: "保存期間",
    prompt: "登記識別情報の失効の申出に関する情報の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "5年"],
    correctChoice: "10年",
    explanation: "登記識別情報の失効の申出に関する情報は、申出の受付の日から10年間保存される。",
    source: storagePeriodSource,
    tags: ["登記識別情報", "失効の申出"],
  },
  {
    id: "storage-request-documents",
    category: "保存期間",
    prompt:
      "登記事項証明書の交付請求書など、請求書類つづり込み帳の書類に記載された情報の保存期間は？",
    choices: ["永久", "10年", "5年", "3年", "1年"],
    correctChoice: "1年",
    explanation: "請求書類つづり込み帳の書類に記載された情報は、受付の日から1年間保存される。",
    source: storagePeriodSource,
    tags: ["登記事項証明書", "交付請求", "請求書類つづり込み帳"],
  },
];
