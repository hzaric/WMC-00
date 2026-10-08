const API_URL = "https://opentdb.com/api.php?amount=1&difficulty=easy";
const CATEGORY_URL = "https://opentdb.com/api_category.php";

let currentQuestion = null;
let score = 0;

// HTML-Elemente auswählen
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");
const nextButton = document.getElementById("nextButton");
const categoryElement = document.getElementById("category");
const highscoresElement = document.getElementById("highscores");
const saveButton = document.getElementById("saveButton");


loadCategories();
loadQuestion();
displayHighscores();

// Lädt eine Frage aus der API.
function loadQuestion() {
  resultElement.textContent = ""; // entfernen der alten Ergebnisse
  answersElement.innerHTML = ""; // entfernen der alten Antwort

  let url = API_URL;

  // Hängt die ausgewählte Kategorie an die Anfrage an.
  if (categoryElement.value !== "") {
    url += "&category=" + categoryElement.value;
  }

  fetch(url).then((response) => response.json()) .then((data) => {
      currentQuestion = data.results[0];
      displayQuestion();
    })
    .catch((error) => {
      console.error("Fehler:", error);
      questionElement.textContent = "Die Frage konnte nicht geladen werden.";
    });
}

// Zeigt die Frage und ihre Antworten an.
function displayQuestion() {
  questionElement.innerHTML = currentQuestion.question;
  answersElement.innerHTML = ""; // entfernen der alten Antworten
  // Fügt richtige und falsche Antworten zusammen.
  const answers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];
  shuffle(answers);
  // Erstellt für jede Antwort einen Button.
  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("answer-button");
    button.innerHTML = answer;
    button.addEventListener("click", () => checkAnswer(answer));
    answersElement.appendChild(button);
  });
}

// Prüft die Antwort und sperrt alle Antwort-Buttons.
function checkAnswer(answer) {
  const buttons = document.querySelectorAll(".answer-button");
  buttons.forEach((button) => {
    button.disabled = true;
  });
  if (answer === currentQuestion.correct_answer) {
    resultElement.textContent = "Richtig!";
    score++;
  } else {
    resultElement.textContent =
      "Falsch! Richtige Antwort: " + currentQuestion.correct_answer;
  }
}

nextButton.addEventListener("click", loadQuestion);
// Mischt die Antworten zufällig.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Lädt die Kategorien aus der API.
function loadCategories() {
  fetch(CATEGORY_URL).then((response) => response.json()).then((data) => {
      data.trivia_categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Kategorien konnten nicht geladen werden:", error);
    });
}

categoryElement.addEventListener("change", () => {
  score = 0;
  loadQuestion();
});

saveButton.addEventListener("click", saveHighscore);
// Speichert den Punktestand im Browser.
function saveHighscore() {
  const name = prompt("Dein Name:");
  if (name === null || name.trim() === "") {
    return;
  }
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const newScore = { name: name.trim(), score };
  highscores.push(newScore);
  highscores.sort((a, b) => b.score - a.score);
  localStorage.setItem("highscores", JSON.stringify(highscores));
  displayHighscores();
}

// Zeigt gespeicherte Punktestände an.
function displayHighscores() {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  highscoresElement.innerHTML = ""; 
  highscores.forEach(function (entry) {
    const li = document.createElement("li");
    li.textContent = entry.name + " - " + entry.score + " Punkte";
    highscoresElement.appendChild(li);
  });
}
