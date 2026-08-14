import "./style.css";
import { questions, type Question } from "./questions";

type ModeId = "storage" | "civil-law" | "all";

type StudyMode = {
  id: ModeId;
  label: string;
  shortLabel: string;
  description: string;
  filter: (question: Question) => boolean;
};

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("アプリの表示領域が見つかりません。");
}

const studyModes: StudyMode[] = [
  {
    id: "storage",
    label: "保存期間モード",
    shortLabel: "保存期間",
    description: "登記記録・図面・帳簿などの保存期間だけを集中して覚える",
    filter: (question) => question.set !== "civil-law",
  },
  {
    id: "civil-law",
    label: "民法モード",
    shortLabel: "民法",
    description: "時効、物権、契約、相続など、民法を中心とする期間を覚える",
    filter: (question) => question.set === "civil-law",
  },
  {
    id: "all",
    label: "総合モード",
    shortLabel: "総合",
    description: "保存期間と民法の問題を混ぜて、本番に近い切り替えを練習する",
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
  setModeQuery();

  app.innerHTML = `
    <section class="app-shell" aria-labelledby="app-title">
      <header class="app-header">
        <a class="back-link" href="${homeHref}">← 学習ツール一覧</a>
        <p class="eyebrow">土地家屋調査士 学習ツール</p>
        <h1 id="app-title">期間フラッシュカード</h1>
        <p class="lead">覚えたい分野を選んでください。各モードでは、全問題をランダムに一巡してから次の周回へ進みます。</p>
      </header>

      <section class="mode-grid" aria-label="出題モード">
        ${studyModes
          .map((mode) => {
            const count = questions.filter(mode.filter).length;
            return `
              <button class="mode-card" type="button" data-mode="${mode.id}">
                <span class="mode-name">${mode.label}</span>
                <span class="mode-count">全${count}問</span>
                <span class="mode-description">${mode.description}</span>
              </button>
            `;
          })
          .join("")}
      </section>

      <aside class="study-note">
        民法モードは、期間ナビの整理内容を基に、重複や表記を整えたうえで現行法令と照合しています。
      </aside>
      <footer>試験学習用の教材です。個別事案への法的助言ではありません。</footer>
    </section>
  `;

  app.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((button) => {
    button.addEventListener("click", () => selectMode(button.dataset.mode as ModeId));
  });
};

const selectMode = (modeId: ModeId): void => {
  selectedMode = studyModes.find((mode) => mode.id === modeId);
  if (!selectedMode) {
    renderModePicker();
    return;
  }

  activeQuestions = questions.filter(selectedMode.filter);
  questionDeck = [];
  answeredCount = 0;
  correctCount = 0;
  roundQuestionNumber = 0;
  setModeQuery(modeId);
  renderQuestion();
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
        <p class="eyebrow">${selectedMode.label}</p>
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
