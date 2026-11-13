
// ==================================
// PAGE NAVIGATION
// ==================================

function hideAllPages() {
  document.getElementById("home").style.display = "none";
  document.getElementById("games").style.display = "none";
  document.getElementById("selected-game").style.display = "none";
  document.getElementById("word-match-game").style.display = "none";
  document.getElementById("memory-game").style.display = "none";
}

function showHome() {
  hideAllPages();
  document.getElementById("home").style.display = "flex";
}

function showGames() {
  hideAllPages();
  document.getElementById("games").style.display = "block";
}

function selectGame(name) {
  hideAllPages();

  if (name === "Missing Words") {
    document.getElementById("selected-game").style.display = "block";
  } else if (name === "Word Match") {
    document.getElementById("word-match-game").style.display = "block";
  } else if (name === "Memory Challenge") {
    document.getElementById("memory-game").style.display = "block";
  } else {
    document.getElementById("games").style.display = "block";
    alert(name + " is coming soon!");
  }
}


// ==================================
// MISSING WORDS GAME
// ==================================

let challengeWords = [];
let missingIndexes = [];

function createChallenge() {
  const quoteInput = document.getElementById("quoteInput");
  const quote = quoteInput.value.trim();

  if (!quote) {
    alert("Please enter a quote first!");
    return;
  }

  challengeWords = quote.split(/\s+/);

  if (challengeWords.length < 2) {
    alert("Please enter a longer quote!");
    return;
  }

  // Randomly choose half the words
  const indexes = challengeWords.map((word, index) => index);

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  missingIndexes = indexes.slice(
    0,
    Math.ceil(challengeWords.length / 2)
  );

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

  document.querySelector("#selected-game .quote-input-area").style.display = "none";
  document.getElementById("challengeArea").style.display = "block";
  document.getElementById("results").style.display = "none";
}

function normaliseWord(word) {
  return word
    .toLowerCase()
    .replace(/[.,!?;:"“”‘’()]/g, "")
    .trim();
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
  message.textContent =
    correct === missingIndexes.length
      ? "Perfect! You remembered every missing word!"
      : "Good effort! Check the highlighted answers and try again.";

  results.appendChild(message);

  const answers = document.createElement("p");
  answers.textContent =
    "Correct answers: " +
    missingIndexes.map(index => challengeWords[index]).join(", ");

  results.appendChild(answers);
  results.style.display = "block";
}

function resetMissingWords() {
  challengeWords = [];
  missingIndexes = [];

  document.getElementById("quoteInput").value = "";
  document.querySelector("#selected-game .quote-input-area").style.display = "block";
  document.getElementById("challengeArea").style.display = "none";
  document.getElementById("results").style.display = "none";
}


// ==================================
// WORD MATCH GAME
// ==================================

let wordMatchWords = [];

function createWordMatch() {
  const inputs = document.querySelectorAll(".real-word-input");
  const words = Array.from(inputs).map(input => input.value.trim());

  if (words.some(word => word === "")) {
    alert("Please enter all 5 words!");
    return;
  }

  if (words.some(word => word.length < 2)) {
    alert("Each word must have at least 2 letters!");
    return;
  }

  const uniqueWords = new Set(words.map(word => word.toLowerCase()));

  if (uniqueWords.size !== 5) {
    alert("Please enter 5 different words!");
    return;
  }

  wordMatchWords = words;
  buildWordMatchRound();

  document.getElementById("word-input-area").style.display = "none";
  document.getElementById("word-match-area").style.display = "block";
}

function buildWordMatchRound() {
  const options = [];
  const usedWords = new Set(
    wordMatchWords.map(word => word.toLowerCase())
  );

  // Add the five real words
  wordMatchWords.forEach(word => {
    options.push({ word: word, real: true });
  });

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // Generate fake words by changing one letter
  wordMatchWords.forEach(word => {
    let created = 0;

    for (let position = 0; position < word.length && created < 3; position++) {
      for (let letter of alphabet) {
        if (created >= 3) break;

        const letters = word.split("");

        if (letters[position].toLowerCase() === letter) {
          continue;
        }

        letters[position] = letter;

        const fakeWord = letters.join("");
        const key = fakeWord.toLowerCase();

        if (!usedWords.has(key)) {
          usedWords.add(key);
          options.push({ word: fakeWord, real: false });
          created++;
        }
      }
    }
  });

  // If there aren't enough unique one-letter fakes,
  // make additional fake words with two changed letters.
  let attempts = 0;

  while (options.length < 20 && attempts < 2000) {
    attempts++;

    const source = wordMatchWords[
      Math.floor(Math.random() * wordMatchWords.length)
    ];

    const letters = source.split("");
    const first = Math.floor(Math.random() * letters.length);
    const second = Math.floor(Math.random() * letters.length);

    letters[first] = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters[second] = alphabet[Math.floor(Math.random() * alphabet.length)];

    const fakeWord = letters.join("");
    const key = fakeWord.toLowerCase();

    if (!usedWords.has(key)) {
      usedWords.add(key);
      options.push({ word: fakeWord, real: false });
    }
  }

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const container = document.getElementById("word-options");
  container.replaceChildren();

  options.forEach(option => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "word-option";
    button.textContent = option.word;
    button.dataset.real = option.real;

    button.addEventListener("click", () => {
      if (container.dataset.checked === "true") return;
      button.classList.toggle("word-selected");
    });

    container.appendChild(button);
  });

  container.dataset.checked = "false";
  document.getElementById("word-results").style.display = "none";
}

function checkWordMatch() {
  const container = document.getElementById("word-options");
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

  container.dataset.checked = "true";

  const results = document.getElementById("word-results");
  results.replaceChildren();

  const score = document.createElement("h3");
  score.textContent = `Your score: ${correct} / 5`;
  results.appendChild(score);

  const message = document.createElement("p");

  if (correct === 5 && fakeSelected === 0) {
    message.textContent = "Perfect! You found all 5 real words!";
  } else {
    message.textContent =
      `You found ${correct} real words and selected ${fakeSelected} fake words.`;
  }

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

function resetWordMatchSetup() {
  document.querySelectorAll(".real-word-input").forEach(input => {
    input.value = "";
  });

  document.getElementById("word-input-area").style.display = "block";
  document.getElementById("word-match-area").style.display = "none";
  document.getElementById("word-results").style.display = "none";
  document.getElementById("word-options").replaceChildren();

  wordMatchWords = [];
}

// ==================================
// MEMORY CHALLENGE - FLASHCARDS
// ==================================

let flashcards = [];
let flashcardOrder = [];
let currentFlashcard = 0;

function addFlashcardInput() {
  const container = document.getElementById("flashcard-inputs");

  const entry = document.createElement("div");
  entry.className = "flashcard-entry";

  const wordInput = document.createElement("input");
  wordInput.className = "flashcard-word";
  wordInput.type = "text";
  wordInput.placeholder = "Enter a word";

  const definitionInput = document.createElement("textarea");
  definitionInput.className = "flashcard-definition";
  definitionInput.placeholder = "Enter its definition";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "secondary-button";
  removeButton.textContent = "REMOVE";

  removeButton.addEventListener("click", () => {
    entry.remove();
  });

  entry.append(wordInput, definitionInput, removeButton);
  container.appendChild(entry);
}

function createFlashcards() {
  const entries = document.querySelectorAll(".flashcard-entry");

  const cards = Array.from(entries).map(entry => ({
    word: entry.querySelector(".flashcard-word").value.trim(),
    definition: entry.querySelector(".flashcard-definition").value.trim()
  }));

  if (cards.length === 0 || cards.some(card => !card.word || !card.definition)) {
    alert("Please fill in every word and definition.");
    return;
  }

  flashcards = cards;
  startFlashcardRound();

  document.getElementById("flashcard-setup").style.display = "none";
  document.getElementById("flashcard-area").style.display = "block";
}

function startFlashcardRound() {
  // Create a shuffled order of all the cards
  flashcardOrder = flashcards.map((card, index) => index);

  for (let i = flashcardOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcardOrder[i], flashcardOrder[j]] =
      [flashcardOrder[j], flashcardOrder[i]];
  }

  currentFlashcard = 0;
  showFlashcard();
}

function showFlashcard() {
  const cardIndex = flashcardOrder[currentFlashcard];
  const card = flashcards[cardIndex];

  document.getElementById("flashcard-question").textContent = card.word;
  document.getElementById("flashcard-answer").textContent = card.definition;

  document.getElementById("flashcard-progress").textContent =
    `Card ${currentFlashcard + 1} of ${flashcards.length}`;

  // Always show the word side first
  document.getElementById("flashcard-inner").classList.remove("flipped");
}

function flipFlashcard() {
  document.getElementById("flashcard-inner").classList.toggle("flipped");
}

function nextFlashcard() {
  if (currentFlashcard < flashcardOrder.length - 1) {
    currentFlashcard++;
    showFlashcard();
  } else {
    alert("You've gone through all your flashcards! Shuffle to practise again.");
  }
}

function restartFlashcards() {
  startFlashcardRound();
}

function editFlashcards() {
  document.getElementById("flashcard-setup").style.display = "block";
  document.getElementById("flashcard-area").style.display = "none";
}
