import "./style.css";
import { questions, type Duration, type Question } from "./questions";

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("アプリの表示領域が見つかりません。");
}

let currentQuestion: Question;
let questionDeck: Question[] = [];
let hasAnswered = false;
let answeredCount = 0;
let correctCount = 0;
let roundQuestionNumber = 0;

const homeHref = window.location.protocol === "file:" ? "../../site/index.html" : "../";

const shuffleQuestions = (): Question[] => {
  const shuffled = [...questions];

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

const renderQuestion = (): void => {
  currentQuestion = pickQuestion();
  hasAnswered = false;

  app.innerHTML = `
    <section class="app-shell" aria-labelledby="app-title">
      <header class="app-header">
        <a class="back-link" href="${homeHref}">← 学習ツール一覧</a>
        <p class="eyebrow">土地家屋調査士 学習ツール</p>
        <h1 id="app-title">期間フラッシュカード</h1>
        <div class="score" aria-live="polite">
          <span>第${roundQuestionNumber}問 / 全${questions.length}問</span>
          <span>挑戦 ${answeredCount}問</span>
          <span>正解 ${correctCount}問</span>
        </div>
      </header>

      <article class="card">
        <p class="category">${currentQuestion.category}</p>
        <h2>${currentQuestion.prompt}</h2>
        <div class="choices" role="group" aria-label="回答の選択肢">
          ${currentQuestion.choices
            .map(
              (choice, index) => `
                <button class="choice-button" type="button" data-choice="${choice}">
                  <kbd>${index + 1}</kbd>
                  <span>${choice}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="keyboard-hint">数字キーで回答できます</p>
        <section class="feedback" aria-live="polite" hidden></section>
        <button class="next-button" type="button" hidden>次の問題</button>
      </article>

      <footer>
        学習用のため、根拠法令の最新条文も確認してください。
      </footer>
    </section>
  `;

  app.querySelectorAll<HTMLButtonElement>(".choice-button").forEach((button) => {
    button.addEventListener("click", () => answer(button.dataset.choice as Duration));
  });
  app.querySelector<HTMLButtonElement>(".next-button")?.addEventListener("click", renderQuestion);
};

const answer = (selectedChoice: Duration): void => {
  if (hasAnswered) return;

  hasAnswered = true;
  answeredCount += 1;
  const isCorrect = selectedChoice === currentQuestion.correctChoice;
  if (isCorrect) correctCount += 1;

  app.querySelectorAll<HTMLButtonElement>(".choice-button").forEach((button) => {
    button.disabled = true;
    const choice = button.dataset.choice;
    if (choice === currentQuestion.correctChoice) button.classList.add("is-correct");
    if (!isCorrect && choice === selectedChoice) button.classList.add("is-incorrect");
  });

  const feedback = app.querySelector<HTMLElement>(".feedback");
  const nextButton = app.querySelector<HTMLButtonElement>(".next-button");
  const score = app.querySelector<HTMLElement>(".score");
  if (!feedback || !nextButton || !score) return;

  feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  feedback.innerHTML = `
    <p class="result">${isCorrect ? "正解！" : "不正解"}</p>
    <p><strong>正解：${currentQuestion.correctChoice}</strong></p>
    <p>${currentQuestion.explanation}</p>
    ${currentQuestion.source ? `<p class="source">根拠：${currentQuestion.source}</p>` : ""}
  `;
  feedback.hidden = false;
  nextButton.hidden = false;
  nextButton.textContent = questionDeck.length === 0 ? "もう一周する" : "次の問題";
  score.innerHTML = `
    <span>第${roundQuestionNumber}問 / 全${questions.length}問</span>
    <span>挑戦 ${answeredCount}問</span>
    <span>正解 ${correctCount}問</span>
  `;
  nextButton.focus();
};

const handleKeyboard = (event: KeyboardEvent): void => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;

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
renderQuestion();
