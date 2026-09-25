const API_URL = "https://opentdb.com/api.php?amount=1&difficulty=easy";
const CATEGORY_URL = "https://opentdb.com/api_category.php";

let currentQuestion = null;
let score = 0;

// HTML-Elemente holen
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");
const nextButton = document.getElementById("nextButton");
const categoryElement = document.getElementById("category");
const highscoresElement = document.getElementById("highscores");
const saveButton = document.getElementById("saveButton");


// Kategorien laden
loadCategories();

// Erste Frage laden
loadQuestion();

// Highscores anzeigen
displayHighscores();

// --------------------------------------------------
// FRAGE LADEN
// --------------------------------------------------

function loadQuestion() {
  resultElement.textContent = "";
  answersElement.innerHTML = "";

  let url = API_URL;

  // Falls eine Kategorie ausgewählt wurde  BONUS!!!
  if (categoryElement.value !== "") {
    url += "&category=" + categoryElement.value;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      currentQuestion = data.results[0];

      displayQuestion();
    })
    .catch((error) => {
      console.error("Fehler:", error);

      questionElement.textContent = "Die Frage konnte nicht geladen werden.";
    });
}

// --------------------------------------------------
// FRAGE ANZEIGEN
// --------------------------------------------------

function displayQuestion() {
  questionElement.innerHTML = currentQuestion.question;

  answersElement.innerHTML = "";

  // Richtige + falsche Antworten zusammenfügen
  const answers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];

  // Antworten mischen
  shuffle(answers);

  // Für jede Antwort einen Button erstellen
  answers.forEach((answer) => {
    const button = document.createElement("button");

    button.classList.add("answer-button");

    button.innerHTML = answer;

    button.addEventListener("click", function () {
      checkAnswer(answer, button);
    });

    answersElement.appendChild(button);
  });
}

// --------------------------------------------------
// ANTWORT ÜBERPRÜFEN
// --------------------------------------------------

function checkAnswer(answer, clickedButton) {
  // Alle Buttons deaktivieren
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

// --------------------------------------------------
// NÄCHSTE FRAGE
// --------------------------------------------------

nextButton.addEventListener("click", function () {
  loadQuestion();
});

// --------------------------------------------------
// ANTWORTEN MISCHEN
// --------------------------------------------------

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

// --------------------------------------------------
// KATEGORIEN LADEN
// --------------------------------------------------

function loadCategories() {
  fetch(CATEGORY_URL)
    .then((response) => response.json())
    .then((data) => {
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

// --------------------------------------------------
// KATEGORIE GEÄNDERT
// --------------------------------------------------

categoryElement.addEventListener("change", function () {
  score = 0;

  loadQuestion();
});

// --------------------------------------------------
// HIGHSCORE SPEICHERN
// --------------------------------------------------

saveButton.addEventListener("click", saveHighscore);
function saveHighscore() {
  const name = prompt("Dein Name:");

  if (name === null || name.trim() === "") {
    return;
  }

  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  const newScore = {
    name: name,

    score: score,
  };

  highscores.push(newScore);

  highscores.sort(function (a, b) {
    return b.score - a.score;
  });

  localStorage.setItem("highscores", JSON.stringify(highscores));

  displayHighscores();
}

// --------------------------------------------------
// HIGHSCORES ANZEIGEN
// --------------------------------------------------

function displayHighscores() {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  highscoresElement.innerHTML = "";

  highscores.forEach(function (entry) {
    const li = document.createElement("li");

    li.textContent = entry.name + " - " + entry.score + " Punkte";

    highscoresElement.appendChild(li);
  });
}
