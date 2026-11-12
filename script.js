
// PAGE NAVIGATION

function showGames() {
  document.getElementById("home").style.display = "none";
  document.getElementById("games").style.display = "block";
  document.getElementById("selected-game").style.display = "none";
  document.getElementById("word-match-game").style.display = "none";
}

function showHome() {
  document.getElementById("games").style.display = "none";
  document.getElementById("home").style.display = "flex";
  document.getElementById("selected-game").style.display = "none";
  document.getElementById("word-match-game").style.display = "none";
}

function selectGame(name) {
  document.getElementById("games").style.display = "none";
  document.getElementById("selected-game").style.display =
    name === "Missing Words" ? "block" : "none";
  document.getElementById("word-match-game").style.display =
    name === "Word Match" ? "block" : "none";

  if (name !== "Missing Words" && name !== "Word Match") {
    document.getElementById("games").style.display = "block";
    alert(name + " is coming soon!");
  }
}


// MISSING WORDS GAME

let challengeWords = [];
let missingIndexes = [];

function createChallenge() {
  const quote = document.getElementById("quoteInput").value.trim();

  if (!quote) {
    alert("Please enter a quote first!");
    return;
  }

  challengeWords = quote.split(/\s+/);

  if (challengeWords.length < 2) {
    alert("Please enter a longer quote!");
    return;
  }

  const indexes = challengeWords.map((_, i) => i);

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  missingIndexes = indexes.slice(0, Math.ceil(challengeWords.length / 2));
  missingIndexes.sort((a, b) => a - b);

  const display = document.getElementById("quoteDisplay");
  display.replaceChildren();

  challengeWords.forEach((word, index) => {
    if (missingIndexes.includes(index)) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "missing-input";
      input.placeholder = "?";
      input.dataset.index = index;
      input.autocomplete = "off";
      display.appendChild(input);
    } else {
      const text = document.createElement("span");
      text.textContent = word + " ";
      display.appendChild(text);
    }
  });

  document.querySelector(".quote-input-area").style.display = "none";
  document.getElementById("challengeArea").style.display = "block";
  document.getElementById("results").style.display = "none";
}

function normaliseWord(word) {
  return word.toLowerCase().replace(/[.,!?;:"“”‘’()]/g, "").trim();
}

function checkAnswers() {
  const inputs = document.querySelectorAll(".missing-input");
  let correct = 0;

  inputs.forEach(input => {
    const index = Number(input.dataset.index);
    const answer = normaliseWord(input.value);
    const correctAnswer = normaliseWord(challengeWords[index]);

    if (answer === correctAnswer) {
      correct++;
      input.classList.add("answer-correct");
      input.classList.remove("answer-wrong");
    } else {
      input.classList.add("answer-wrong");
      input.classList.remove("answer-correct");
    }
  });

  const results = document.getElementById("results");
  results.replaceChildren();

  const score = document.createElement("h3");
  score.textContent = `Your score: ${correct} / ${missingIndexes.length}`;
  results.appendChild(score);

  const message = document.createElement("p");
  message.textContent = correct === missingIndexes.length
    ? "Perfect! You remembered every missing word!"
    : "Good effort! Check the highlighted answers and try again.";
  results.appendChild(message);

  const answers = document.createElement("p");
  answers.className = "correct-answers";
  answers.textContent = "Correct answers: " +
    missingIndexes.map(i => challengeWords[i]).join(", ");
  results.appendChild(answers);

  results.style.display = "block";
}


// WORD MATCH GAME

let wordMatchWords = [];

function createWordMatch() {
  const inputs = document.querySelectorAll(".real-word-input");
  const words = Array.from(inputs).map(input => input.value.trim());

  if (words.some(word => !word)) {
    alert("Please enter all 5 words!");
    return;
  }

  if (new Set(words.map(word => word.toLowerCase())).size !== 5) {
    alert("Please enter 5 different words!");
    return;
  }

  if (words.some(word => word.length < 2)) {
    alert("Each word must have at least 2 letters!");
    return;
  }

  wordMatchWords = words;
  document.getElementById("word-input-area").style.display = "none";
  document.getElementById("word-match-area").style.display = "block";

  buildWordMatchRound();
}

function buildWordMatchRound() {
  const options = [];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  wordMatchWords.forEach(word => {
    options.push({ word: word, real: true });
  });

  wordMatchWords.forEach(word => {
    let created = 0;
    let attempts = 0;

    while (created < 3 && attempts < 200) {
      attempts++;

      const letters = word.split("");
      const position = Math.floor(Math.random() * letters.length);
      const originalLetter = letters[position].toLowerCase();

      let newLetter = originalLetter;

      while (newLetter === originalLetter) {
        newLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      }

      letters[position] = newLetter;
      const fakeWord = letters.join("");

      const alreadyUsed = options.some(
        option => option.word.toLowerCase() === fakeWord.toLowerCase()
      );

      if (!alreadyUsed) {
        options.push({ word: fakeWord, real: false });
        created++;
      }
    }
  });

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const container = document.getElementById("word-options");
  container.replaceChildren();

  options.forEach(option => {
    const button = document.createElement("button");
    button.className = "word-option";
    button.textContent = option.word;
    button.dataset.real = option.real;
    button.type = "button";

    button.addEventListener("click", () => {
      button.classList.toggle("word-selected");
    });

    container.appendChild(button);
  });

  document.getElementById("word-results").style.display = "none";
}

function checkWordMatch() {
  const options = document.querySelectorAll(".word-option");
  let correct = 0;
  let fakeSelected = 0;
  const missedWords = [];

  options.forEach(button => {
    const isReal = button.dataset.real === "true";
    const isSelected = button.classList.contains("word-selected");

    button.classList.remove("word-correct", "word-wrong");

    if (isReal && isSelected) {
      correct++;
      button.classList.add("word-correct");
    } else if (!isReal && isSelected) {
      fakeSelected++;
      button.classList.add("word-wrong");
    } else if (isReal) {
      missedWords.push(button.textContent);
      button.classList.add("word-wrong");
    }
  });

  const results = document.getElementById("word-results");
  results.replaceChildren();

  const score = document.createElement("h3");
  score.textContent = `Your score: ${correct} / 5`;
  results.appendChild(score);

  const message = document.createElement("p");
  message.textContent =
    correct === 5 && fakeSelected === 0
      ? "Perfect! You found all 5 real words!"
      : `You found ${correct} real words and selected ${fakeSelected} fake words.`;
  results.appendChild(message);

  if (missedWords.length > 0) {
    const missed = document.createElement("p");
    missed.textContent = "Missed real words: " + missedWords.join(", ");
    results.appendChild(missed);
  }

  results.style.display = "block";
}

function resetWordMatch() {
  buildWordMatchRound();
}
