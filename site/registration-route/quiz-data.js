window.registrationRouteQuizData = {
  routes: {
    membership: {
      choice: "下頂点 → 調査士会",
      nodes: ["person", "association"],
    },
    application: {
      choice: "下頂点 → 調査士会を経由 → 連合会",
      nodes: ["person", "association", "federation"],
    },
    "old-notice": {
      choice: "下頂点 → 旧所属会",
      nodes: ["person", "old-association"],
    },
    "federation-notice": {
      choice: "連合会 → 下頂点",
      nodes: ["federation", "person"],
    },
    "association-report": {
      choice: "調査士会 → 法務大臣へ直接",
      nodes: ["association", "minister"],
    },
    "association-person": {
      choice: "調査士会 → 下頂点",
      nodes: ["association", "person"],
    },
    "association-bureau": {
      choice: "調査士会 → 法務局・地方法務局",
      nodes: ["association", "bureau"],
    },
    "association-minister-via-bureau": {
      choice: "調査士会 → 法務局長等を経由 → 法務大臣",
      nodes: ["association", "bureau", "minister"],
    },
    "minister-association-via-bureau": {
      choice: "法務大臣 → 法務局長等を経由 → 調査士会",
      nodes: ["minister", "bureau", "association"],
    },
    "minister-sanction": {
      choice: "法務大臣 → 下頂点",
      nodes: ["minister", "person"],
    },
    "minister-association-notice": {
      choice: "法務大臣 → 調査士会",
      nodes: ["minister", "association"],
    },
    "minister-federation-notice": {
      choice: "法務大臣 → 連合会",
      nodes: ["minister", "federation"],
    },
    "federation-minister": {
      choice: "連合会 → 法務大臣",
      nodes: ["federation", "minister"],
    },
    "minister-gazette": {
      choice: "法務大臣 → 官報",
      nodes: ["minister", "gazette"],
    },
    "direct-minister": {
      choice: "下頂点 → 法務大臣へ直接",
      nodes: ["person", "minister"],
    },
    "person-bureau": {
      choice: "下頂点 → 法務局・地方法務局へ直接",
      nodes: ["person", "bureau"],
    },
    "bureau-investigation": {
      choice: "法務局・地方法務局の内部",
      nodes: ["bureau"],
    },
    "federation-gazette": {
      choice: "連合会 → 官報",
      nodes: ["federation", "gazette"],
    },
    "direct-federation": {
      choice: "下頂点 → 連合会へ直接",
      nodes: ["person", "federation"],
    },
    "federation-bureau": {
      choice: "連合会 → 法務局・地方法務局",
      nodes: ["federation", "bureau"],
    },
    "court-minister-request": {
      choice: "地方裁判所 → 法務大臣",
      nodes: ["court", "minister"],
    },
    "minister-court-opinion": {
      choice: "法務大臣 → 地方裁判所",
      nodes: ["minister", "court"],
    },
  },
};
