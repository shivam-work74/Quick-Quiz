// DOM
const homeScreen = document.getElementById('home');
const rulesScreen = document.getElementById('rules');
const quizScreen = document.getElementById('quiz');
const scoreScreen = document.getElementById('score');

const startBtn = document.getElementById('start-btn');
const rulesBtn = document.getElementById('rules-btn');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const goHomeBtn = document.getElementById('go-home-btn');

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answer-buttons');
const questionNumEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const progressEl = document.querySelector('.progress');
const timerEl = document.querySelector('.timer-sec');
const questionCounterEl = document.querySelector('.question-counter');

const finalScoreEl = document.getElementById('final-score');
const maxScoreEl = document.getElementById('max-score');
const correctAnswersEl = document.getElementById('correct-answers');
const wrongAnswersEl = document.getElementById('wrong-answers');

// State
let current = 0, score = 0, correct = 0, wrong = 0;
let timer = null, timeLeft = 15;

const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "High Tech Multi Language", correct: false },
      { text: "Hyper Transfer Markup Language", correct: false },
      { text: "Home Tool Markup Language", correct: false },
    ]
  },
  {
    question: "Which property changes the background color in CSS?",
    answers: [
      { text: "color", correct: false },
      { text: "bgcolor", correct: false },
      { text: "background-color", correct: true },
      { text: "background", correct: false },
    ]
  },
  {
    question: "Which is NOT a JavaScript data type?",
    answers: [
      { text: "String", correct: false },
      { text: "Boolean", correct: false },
      { text: "Float", correct: true },
      { text: "Object", correct: false },
    ]
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Creative Style Sheets", correct: false },
      { text: "Computer Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Colorful Style Sheets", correct: false },
    ]
  },
  {
    question: "Which symbols are used for comments in JS?",
    answers: [
      { text: "// and /* */", correct: true },
      { text: "# and ##", correct: false },
      { text: "<!-- and -->", correct: false },
      { text: "-- and ++", correct: false },
    ]
  },
];

// Events
startBtn.addEventListener('click', startQuiz);
rulesBtn.addEventListener('click', () => showOnly(rulesScreen));
backBtn?.addEventListener('click', () => showOnly(homeScreen));
playAgainBtn?.addEventListener('click', startQuiz);
goHomeBtn?.addEventListener('click', () => showOnly(homeScreen));
nextBtn.addEventListener('click', () => {
  current++;
  setNextQuestion();
});

// Helpers
function showOnly(section){
  // hide all
  [homeScreen, rulesScreen, quizScreen, scoreScreen].forEach(s => s.classList.add('hidden'));
  // show target
  section.classList.remove('hidden');
}

function startQuiz(){
  current = 0; score = 0; correct = 0; wrong = 0;
  totalQuestionsEl.textContent = questions.length;
  maxScoreEl.textContent = questions.length;
  showOnly(quizScreen);
  setNextQuestion();
}

function setNextQuestion(){
  resetState();
  if(current >= questions.length){ showScore(); return; }
  const q = questions[current];
  questionEl.textContent = q.question;
  questionNumEl.textContent = current + 1;
  questionCounterEl.textContent = `${current + 1} of ${questions.length} Questions`;

  q.answers.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = a.text;
    if(a.correct) btn.dataset.correct = 'true';
    btn.addEventListener('click', selectAnswer);
    answersEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function resetState(){
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;
  document.querySelector('.timer').classList.remove('warning');
  nextBtn.classList.add('hidden');
  while(answersEl.firstChild){ answersEl.removeChild(answersEl.firstChild); }
}

function selectAnswer(e){
  clearInterval(timer);
  const selected = e.target;
  const isCorrect = selected.dataset.correct === 'true';

  if(isCorrect){ selected.classList.add('correct'); score++; correct++; }
  else{
    selected.classList.add('wrong'); wrong++;
    Array.from(answersEl.children).forEach(b => b.dataset.correct && b.classList.add('correct'));
  }

  Array.from(answersEl.children).forEach(b => b.disabled = true);

  if(current < questions.length - 1) nextBtn.classList.remove('hidden');
  else showScore();
}

function startTimer(){
  timerEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(timeLeft <= 5) document.querySelector('.timer').classList.add('warning');
    if(timeLeft <= 0){ clearInterval(timer); timeUp(); }
  }, 1000);
}

function timeUp(){
  Array.from(answersEl.children).forEach(b => {
    b.disabled = true;
    if(b.dataset.correct) b.classList.add('correct');
  });
  wrong++;
  if(current < questions.length - 1) nextBtn.classList.remove('hidden');
  else showScore();
}

function updateProgress(){
  const pct = ((current + 1) / questions.length) * 100;
  progressEl.style.width = `${pct}%`;
}

function showScore(){
  showOnly(scoreScreen);
  finalScoreEl.textContent = score;
  correctAnswersEl.textContent = correct;
  wrongAnswersEl.textContent = wrong;
}
