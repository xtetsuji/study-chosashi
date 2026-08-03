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

export const questions: Question[] = [
  {
    id: "storage-closed-land-record",
    category: "保存期間",
    prompt: "土地に関する閉鎖登記記録の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "50年",
    explanation: "土地に関する閉鎖登記記録は、閉鎖した日から50年間保存される。",
    source: "不動産登記規則第28条",
    tags: ["閉鎖登記記録", "土地"],
  },
  {
    id: "storage-closed-building-record",
    category: "保存期間",
    prompt: "建物に関する閉鎖登記記録の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "30年",
    explanation: "建物に関する閉鎖登記記録は、閉鎖した日から30年間保存される。",
    source: "不動産登記規則第28条",
    tags: ["閉鎖登記記録", "建物"],
  },
  {
    id: "storage-map",
    category: "保存期間",
    prompt: "地図の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "地図は永久に保存される。",
    source: "不動産登記規則第28条",
    tags: ["地図"],
  },
  {
    id: "storage-map-equivalent-drawing",
    category: "保存期間",
    prompt: "地図に準ずる図面の保存期間は？",
    choices: ["永久", "50年", "30年", "20年", "10年"],
    correctChoice: "永久",
    explanation: "地図に準ずる図面は永久に保存される。",
    source: "不動産登記規則第28条",
    tags: ["地図に準ずる図面"],
  },
  {
    id: "storage-joint-collateral-list",
    category: "保存期間",
    prompt: "共同担保目録の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "5年"],
    correctChoice: "10年",
    explanation: "共同担保目録は、全ての事項を抹消した日から10年間保存される。",
    source: "不動産登記規則第28条",
    tags: ["共同担保目録"],
  },
  {
    id: "storage-trust-register",
    category: "保存期間",
    prompt: "信託目録の保存期間は？",
    choices: ["永久", "30年", "20年", "10年", "5年"],
    correctChoice: "20年",
    explanation: "信託目録は、信託の登記を抹消した日から20年間保存される。",
    source: "不動産登記規則第28条",
    tags: ["信託目録"],
  },
];
