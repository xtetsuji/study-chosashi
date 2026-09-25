import "./style.css";
import { questions, type Question, type QuestionSet } from "./questions";

type ModeId = QuestionSet | "all";

type StudyMode = {
  id: ModeId;
  label: string;
  shortLabel: string;
  description: string;
  filter: (question: Question) => boolean;
};

type QuestionProgress = {
  correct: number;
  incorrect: number;
  lastAnsweredAt: string;
  lastResult: "correct" | "incorrect";
};

type StudyProgress = {
  version: 1;
  totalAnswered: number;
  totalCorrect: number;
  questions: Record<string, QuestionProgress>;
};

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("アプリの表示領域が見つかりません。");
}

const progressStorageKey = "study-chosashi.period-flashcards.progress.v1";

let canPersistProgress = true;

const emptyProgress = (): StudyProgress => ({
  version: 1,
  totalAnswered: 0,
  totalCorrect: 0,
  questions: {},
});

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;

const loadProgress = (): StudyProgress => {
  let saved: string | null;
  try {
    saved = window.localStorage.getItem(progressStorageKey);
  } catch {
    canPersistProgress = false;
    return emptyProgress();
  }
  if (!saved) return emptyProgress();

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return emptyProgress();
  }
  if (!parsed || typeof parsed !== "object") return emptyProgress();
  const candidate = parsed as Partial<StudyProgress>;
  if (
    candidate.version !== 1 ||
    !isNonNegativeInteger(candidate.totalAnswered) ||
    !isNonNegativeInteger(candidate.totalCorrect) ||
    !candidate.questions ||
    typeof candidate.questions !== "object"
  ) {
    return emptyProgress();
  }

  const questionProgress: Record<string, QuestionProgress> = {};
  Object.entries(candidate.questions).forEach(([questionId, value]) => {
    if (!value || typeof value !== "object") return;
    const stats = value as Partial<QuestionProgress>;
    if (
      isNonNegativeInteger(stats.correct) &&
      isNonNegativeInteger(stats.incorrect) &&
      typeof stats.lastAnsweredAt === "string" &&
      (stats.lastResult === "correct" || stats.lastResult === "incorrect")
    ) {
      questionProgress[questionId] = {
        correct: stats.correct,
        incorrect: stats.incorrect,
        lastAnsweredAt: stats.lastAnsweredAt,
        lastResult: stats.lastResult,
      };
    }
  });

  return {
    version: 1,
    totalAnswered: candidate.totalAnswered,
    totalCorrect: candidate.totalCorrect,
    questions: questionProgress,
  };
};

let progress = loadProgress();

const saveProgress = (): void => {
  if (!canPersistProgress) return;

  try {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  } catch {
    canPersistProgress = false;
  }
};

const progressFor = (questionId: string): QuestionProgress | undefined => progress.questions[questionId];

const isReviewQuestion = (question: Question): boolean => {
  const questionProgress = progressFor(question.id);
  if (!questionProgress) return false;
  return questionProgress.lastResult === "incorrect" || questionProgress.incorrect > questionProgress.correct;
};

const formatRate = (correct: number, answered: number): string =>
  answered === 0 ? "未回答" : `正答率 ${Math.round((correct / answered) * 100)}%`;

const getModeProgress = (mode: StudyMode): { answered: number; correct: number; reviewCount: number } => {
  return questions.filter(mode.filter).reduce(
    (summary, question) => {
      const questionProgress = progressFor(question.id);
      if (!questionProgress) return summary;
      summary.answered += questionProgress.correct + questionProgress.incorrect;
      summary.correct += questionProgress.correct;
      if (isReviewQuestion(question)) summary.reviewCount += 1;
      return summary;
    },
    { answered: 0, correct: 0, reviewCount: 0 },
  );
};

const recordAnswer = (question: Question, isCorrect: boolean): void => {
  const previous = progressFor(question.id) ?? {
    correct: 0,
    incorrect: 0,
    lastAnsweredAt: "",
    lastResult: "incorrect" as const,
  };
  const next: QuestionProgress = {
    ...previous,
    correct: previous.correct + (isCorrect ? 1 : 0),
    incorrect: previous.incorrect + (isCorrect ? 0 : 1),
    lastAnsweredAt: new Date().toISOString(),
    lastResult: isCorrect ? "correct" : "incorrect",
  };

  progress = {
    ...progress,
    totalAnswered: progress.totalAnswered + 1,
    totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
    questions: { ...progress.questions, [question.id]: next },
  };
  saveProgress();
};

const studyModes: StudyMode[] = [
  {
    id: "storage",
    label: "保存期間モード",
    shortLabel: "保存期間",
    description: "登記記録・図面・帳簿などの保存期間だけを集中して覚える",
    filter: (question) => !question.sets || question.sets.includes("storage"),
  },
  {
    id: "real-estate-registration",
    label: "不動産登記法モード",
    shortLabel: "不動産登記法",
    description: "申請手続、登記識別情報、登録免許税などの期限を覚える",
    filter: (question) => question.sets?.includes("real-estate-registration") ?? false,
  },
  {
    id: "boundary-determination",
    label: "筆界特定モード",
    shortLabel: "筆界特定",
    description: "筆界特定の保存期間、帳簿、通知の到達時期を覚える",
    filter: (question) => question.sets?.includes("boundary-determination") ?? false,
  },
  {
    id: "surveyor-law",
    label: "土地家屋調査士法モード",
    shortLabel: "土地家屋調査士法",
    description: "登録、懲戒、事件簿など調査士法の期間を覚える",
    filter: (question) => question.sets?.includes("surveyor-law") ?? false,
  },
  {
    id: "civil-law",
    label: "民法モード",
    shortLabel: "民法",
    description: "時効、物権、契約、相続など、民法を中心とする期間を覚える",
    filter: (question) => question.sets?.includes("civil-law") ?? false,
  },
  {
    id: "all",
    label: "総合モード",
    shortLabel: "総合",
    description: "全分野の問題を混ぜて、本番に近い切り替えを練習する",
    filter: () => true,
  },
];

let selectedMode: StudyMode | undefined;
let activeQuestions: Question[] = [];
let currentQuestion: Question | undefined;
let questionDeck: Question[] = [];
let hasAnswered = false;
let answeredCount = 0;
let correctCount = 0;
let roundQuestionNumber = 0;
let isReviewSession = false;

const homeHref = window.location.protocol === "file:" ? "../../site/index.html" : "../";

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );

const setModeQuery = (modeId?: ModeId): void => {
  const url = new URL(window.location.href);
  if (modeId) url.searchParams.set("mode", modeId);
  else url.searchParams.delete("mode");
  window.history.replaceState(null, "", url);
};

const shuffleQuestions = (): Question[] => {
  const shuffled = [...activeQuestions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const pickQuestion = (): Question => {
  if (questionDeck.length === 0) {
    questionDeck = shuffleQuestions();
    roundQuestionNumber = 0;
  }

  const nextQuestion = questionDeck.pop();
  if (!nextQuestion) throw new Error("出題できる問題がありません。");

  roundQuestionNumber += 1;
  return nextQuestion;
};

const renderModePicker = (): void => {
  selectedMode = undefined;
  currentQuestion = undefined;
  isReviewSession = false;
  setModeQuery();

  const reviewCount = questions.filter(isReviewQuestion).length;
  const progressNotice = canPersistProgress
    ? "このブラウザに回答結果を保存しています。別のブラウザや端末には引き継がれません。"
    : "この環境では成績を保存できません。今回の学習は続けられますが、ページを閉じると成績は失われます。";

  app.innerHTML = `
    <section class="app-shell" aria-labelledby="app-title">
      <header class="app-header">
        <a class="back-link" href="${homeHref}">← 学習ツール一覧</a>
        <p class="eyebrow">土地家屋調査士 学習ツール</p>
        <h1 id="app-title">期間フラッシュカード</h1>
        <p class="lead">覚えたい分野を選んでください。各モードでは、全問題をランダムに一巡してから次の周回へ進みます。</p>
        <div class="saved-score" aria-live="polite">
          <span>累計 回答 ${progress.totalAnswered}問</span>
          <span>累計 正解 ${progress.totalCorrect}問</span>
          <span>${formatRate(progress.totalCorrect, progress.totalAnswered)}</span>
        </div>
      </header>

      <section class="mode-grid" aria-label="出題モード">
        ${studyModes
          .map((mode) => {
            const count = questions.filter(mode.filter).length;
            const modeProgress = getModeProgress(mode);
            return `
              <button class="mode-card" type="button" data-mode="${mode.id}">
                <span class="mode-name">${mode.label}</span>
                <span class="mode-count">全${count}問</span>
                <span class="mode-description">${mode.description}</span>
                <span class="mode-progress">${formatRate(modeProgress.correct, modeProgress.answered)}${modeProgress.reviewCount ? `・要復習 ${modeProgress.reviewCount}問` : ""}</span>
              </button>
            `;
          })
          .join("")}
      </section>

      <section class="review-panel" aria-labelledby="review-title">
        <h2 id="review-title">軽い振り返り</h2>
        <p>直近で不正解だった問題、または不正解数が正解数を上回る問題を「要復習」としてまとめます。</p>
        <button class="review-button" type="button" ${reviewCount ? "" : "disabled"}>要復習 ${reviewCount}問を解く</button>
      </section>

      <aside class="study-note">
        各問題は、根拠となる現行法令と照合し、条文と確認基準日を記録しています。${progressNotice}
      </aside>
      <button class="clear-progress" type="button" ${canPersistProgress || progress.totalAnswered ? "" : "disabled"}>このブラウザの成績を消去する</button>
      <footer>試験学習用の教材です。個別事案への法的助言ではありません。</footer>
    </section>
  `;

  app.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((button) => {
    button.addEventListener("click", () => selectMode(button.dataset.mode as ModeId));
  });
  app.querySelector<HTMLButtonElement>(".review-button")?.addEventListener("click", startReview);
  app.querySelector<HTMLButtonElement>(".clear-progress")?.addEventListener("click", clearProgress);
};

const selectMode = (modeId: ModeId): void => {
  selectedMode = studyModes.find((mode) => mode.id === modeId);
  if (!selectedMode) {
    renderModePicker();
    return;
  }

  activeQuestions = questions.filter(selectedMode.filter);
  questionDeck = [];
  isReviewSession = false;
  answeredCount = 0;
  correctCount = 0;
  roundQuestionNumber = 0;
  setModeQuery(modeId);
  renderQuestion();
};

const startReview = (): void => {
  const reviewQuestions = questions.filter(isReviewQuestion);
  if (reviewQuestions.length === 0) return;

  selectedMode = {
    id: "all",
    label: "要復習モード",
    shortLabel: "要復習",
    description: "要復習の問題だけを出題します",
    filter: isReviewQuestion,
  };
  activeQuestions = reviewQuestions;
  questionDeck = [];
  isReviewSession = true;
  answeredCount = 0;
  correctCount = 0;
  roundQuestionNumber = 0;
  setModeQuery();
  renderQuestion();
};

const clearProgress = (): void => {
  if (!window.confirm("このブラウザに保存した累計成績と問題ごとの回答履歴を消去します。元に戻せません。")) return;

  if (canPersistProgress) {
    try {
      window.localStorage.removeItem(progressStorageKey);
    } catch {
      canPersistProgress = false;
      renderModePicker();
      return;
    }
  }
  progress = emptyProgress();
  renderModePicker();
};

const renderQuestion = (): void => {
  if (!selectedMode) {
    renderModePicker();
    return;
  }

  currentQuestion = pickQuestion();
  hasAnswered = false;
  const importance = currentQuestion.importance
    ? `<span class="importance" aria-label="試験重要度 ${currentQuestion.importance}">重要度 ${"★".repeat(currentQuestion.importance)}</span>`
    : "";

  app.innerHTML = `
    <section class="app-shell" aria-labelledby="app-title">
      <header class="app-header">
        <div class="header-links">
          <a class="back-link" href="${homeHref}">← 学習ツール一覧</a>
          <button class="change-mode" type="button">モードを選び直す</button>
        </div>
        <p class="eyebrow">${selectedMode.label}${isReviewSession ? "・苦手を振り返る" : ""}</p>
        <h1 id="app-title">期間フラッシュカード</h1>
        <div class="score" aria-live="polite">
          <span>第${roundQuestionNumber}問 / 全${activeQuestions.length}問</span>
          <span>挑戦 ${answeredCount}問</span>
          <span>正解 ${correctCount}問</span>
        </div>
      </header>

      <article class="card">
        <div class="question-meta">
          <p class="category">${escapeHtml(currentQuestion.category)}</p>
          ${importance}
        </div>
        <h2>${escapeHtml(currentQuestion.prompt)}</h2>
        <div class="choices" role="group" aria-label="回答の選択肢">
          ${currentQuestion.choices
            .map(
              (choice, index) => `
                <button class="choice-button" type="button" data-choice="${escapeHtml(choice)}">
                  <kbd>${index + 1}</kbd>
                  <span>${escapeHtml(choice)}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="keyboard-hint">数字キーで回答できます</p>
        <section class="feedback" aria-live="polite" hidden></section>
        <button class="next-button" type="button" hidden>次の問題</button>
      </article>

      <footer>試験学習用の教材です。個別事案への法的助言ではありません。</footer>
    </section>
  `;

  app.querySelector<HTMLButtonElement>(".change-mode")?.addEventListener("click", renderModePicker);
  app.querySelectorAll<HTMLButtonElement>(".choice-button").forEach((button) => {
    button.addEventListener("click", () => answer(button.dataset.choice ?? ""));
  });
  app.querySelector<HTMLButtonElement>(".next-button")?.addEventListener("click", renderQuestion);
};

const answer = (selectedChoice: string): void => {
  if (hasAnswered || !currentQuestion || !selectedMode) return;

  hasAnswered = true;
  answeredCount += 1;
  const isCorrect = selectedChoice === currentQuestion.correctChoice;
  if (isCorrect) correctCount += 1;
  recordAnswer(currentQuestion, isCorrect);

  app.querySelectorAll<HTMLButtonElement>(".choice-button").forEach((button) => {
    button.disabled = true;
    const choice = button.dataset.choice;
    if (choice === currentQuestion?.correctChoice) button.classList.add("is-correct");
    if (!isCorrect && choice === selectedChoice) button.classList.add("is-incorrect");
  });

  const feedback = app.querySelector<HTMLElement>(".feedback");
  const nextButton = app.querySelector<HTMLButtonElement>(".next-button");
  const score = app.querySelector<HTMLElement>(".score");
  if (!feedback || !nextButton || !score) return;

  const source = currentQuestion.source
    ? currentQuestion.sourceUrl
      ? `<a href="${currentQuestion.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(currentQuestion.source)}</a>`
      : escapeHtml(currentQuestion.source)
    : "";

  feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  feedback.innerHTML = `
    <p class="result">${isCorrect ? "正解！" : "不正解"}</p>
    <p><strong>正解：${escapeHtml(currentQuestion.correctChoice)}</strong></p>
    <p>${escapeHtml(currentQuestion.explanation)}</p>
    ${source ? `<p class="source">根拠：${source}</p>` : ""}
  `;
  feedback.hidden = false;
  nextButton.hidden = false;
  nextButton.textContent = questionDeck.length === 0 ? "もう一周する" : "次の問題";
  score.innerHTML = `
    <span>第${roundQuestionNumber}問 / 全${activeQuestions.length}問</span>
    <span>挑戦 ${answeredCount}問</span>
    <span>正解 ${correctCount}問</span>
  `;
  nextButton.focus();
};

const handleKeyboard = (event: KeyboardEvent): void => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || !currentQuestion) return;

  if (!hasAnswered && /^[1-9]$/.test(event.key)) {
    const choiceIndex = Number(event.key) - 1;
    const selectedChoice = currentQuestion.choices[choiceIndex];
    if (selectedChoice) {
      event.preventDefault();
      answer(selectedChoice);
    }
    return;
  }

  if (hasAnswered && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    renderQuestion();
  }
};

document.addEventListener("keydown", handleKeyboard);

const initialMode = new URL(window.location.href).searchParams.get("mode") as ModeId | null;
if (initialMode && studyModes.some((mode) => mode.id === initialMode)) selectMode(initialMode);
else renderModePicker();
