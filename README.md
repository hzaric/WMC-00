# Fetch-API-Quiz

Das Quiz lädt einfache Fragen aus einer Online-API. Du kannst eine Kategorie wählen, Antworten anklicken und deinen Punktestand als Highscore speichern.

## So lädt JavaScript Daten

`fetch()` fragt Daten bei einer API an. Die Antwort wird mit `response.json()` in ein JavaScript-Objekt umgewandelt:

```javascript
fetch("API-URL")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

In diesem Quiz steht die erste Frage in `data.results[0]`. Die Frage selbst steht in `data.results[0].question`.

## HTML mit JavaScript ändern

Mit `getElementById()` findest du ein Element. `textContent` ändert seinen Text:

```javascript
const questionElement = document.getElementById("question");
questionElement.textContent = "Eine neue Frage";
```

## Antworten anzeigen

Die richtige und die falschen Antworten werden in einem Array gesammelt. `...` fügt die falschen Antworten in dieses Array ein.

```javascript
const answers = [
  currentQuestion.correct_answer,
  ...currentQuestion.incorrect_answers,
];
```

Für jede Antwort erstellt JavaScript einen Button. `addEventListener()` legt fest, was beim Klick passiert. `appendChild()` fügt den Button in die Seite ein.

## Highscores speichern

LocalStorage speichert Daten im Browser. `JSON.stringify()` macht aus den Daten einen Text, den LocalStorage speichern kann. `JSON.parse()` wandelt den Text wieder zurück.

```javascript
localStorage.setItem("highscores", JSON.stringify(highscores));
const savedHighscores = JSON.parse(localStorage.getItem("highscores")) || [];
```

## Kategorien laden

Die Kategorien kommen von `https://opentdb.com/api_category.php`. Die gewählte Kategorie wird als `category` an die Frage-URL angehängt. So lädt das Quiz Fragen aus dieser Kategorie.
