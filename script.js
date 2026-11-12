
let challengeWords = [];
let missingIndexes = [];

function showHome() {
    document.getElementById("home").style.display = "flex";
    document.getElementById("games").style.display = "none";
    document.getElementById("selected-game").style.display = "none";
}

function showGames() {
  document.getElementById("home").style.display = "none";
  document.getElementById("games").style.display = "block";
  document.getElementById("selected-game").style.display = "none";
  document.getElementById("word-match-game").style.display = "none";
}

function showGames() {
    document.getElementById("home").style.display = "none";
    document.getElementById("games").style.display = "block";
    document.getElementById("selected-game").style.display = "none";
}

function selectGame(name) {
    if (name === "Missing Words") {
        document.getElementById("games").style.display = "none";
        document.getElementById("selected-game").style.display = "block";
    } else {
        alert(name + " is coming soon!");
    }
}


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

    // Randomly choose roughly half the words
    const indexes = challengeWords.map((_, i) => i);

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

    const total = missingIndexes.length;
    const results = document.getElementById("results");

    results.replaceChildren();

    const score = document.createElement("h3");
    score.textContent = `Your score: ${correct} / ${total}`;
    results.appendChild(score);

    const message = document.createElement("p");
    message.textContent =
        correct === total
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
