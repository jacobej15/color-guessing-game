const colorMap = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#facc15",
    purple: "#a855f7",
    orange: "#f97316",
    pink: "#ec4899",
    teal: "#14b8a6"
};

const HIGH_SCORE_KEY = "guessTheColorHighScore";

const game = {
    score: 0,
    timeLeft: 10,
    timerId: null,
    currentColor: "",
    choices: [],
    started: false,
    ended: false,
    playerName: "",
    highscores: []
};

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const targetEl = document.getElementById("targetColor");
const statusEl = document.getElementById("status");
const choicesEl = document.getElementById("choices");
const resultBox = document.getElementById("resultBox");
const highScoreEl = document.getElementById("highScore");
const dateTimeEl = document.getElementById("dateTime");
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");

function nowString() {
    return new Date().toLocaleString();
}

function updateDateTime() {
    dateTimeEl.textContent = `Date: ${nowString()}`;
}

function getHighScores() {
    const saved = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
}

function saveHighScore() {
    const name = (playerNameInput.value || "Player").trim() || "Player";
    const entry = {
        name,
        score: game.score,
        date: nowString()
    };

    game.highscores = getHighScores();
    game.highscores.push(entry);
    game.highscores.sort((a, b) => b.score - a.score);
    game.highscores = game.highscores.slice(0, 5);

    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(game.highscores));

    const top = game.highscores[0];
    highScoreEl.textContent = `High Score: ${top ? top.score : 0}`;
}

function updateScore() {
    scoreEl.textContent = `Score: ${game.score}`;
}

function updateTimer() {
    timerEl.textContent = `Time: ${game.timeLeft}`;
}

function setStatus(message) {
    statusEl.textContent = message;
}

function clearTimer() {
    if (game.timerId) {
        clearInterval(game.timerId);
        game.timerId = null;
    }
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function setResult(message) {
    resultBox.textContent = message;
    resultBox.classList.remove("hidden");
}

function clearResult() {
    resultBox.textContent = "";
    resultBox.classList.add("hidden");
}

function startTimer() {
    clearTimer();
    game.timeLeft = 10;
    updateTimer();

    game.timerId = setInterval(() => {
        game.timeLeft -= 1;
        updateTimer();

        if (game.timeLeft <= 0) {
            clearTimer();
            endGame("lost");
        }
    }, 1000);
}

function nextRound() {
    if (!game.started || game.ended) {
        return;
    }

    const colorNames = Object.keys(colorMap);
    const shuffledColors = shuffle(colorNames);
    const answerIndex = Math.floor(Math.random() * shuffledColors.length);

    game.currentColor = shuffledColors[answerIndex];
    game.choices = shuffle(shuffledColors).slice(0, 4);

    if (!game.choices.includes(game.currentColor)) {
        game.choices[0] = game.currentColor;
        game.choices = shuffle(game.choices);
    }

    targetEl.style.backgroundColor = colorMap[game.currentColor];
    targetEl.textContent = "";
    setStatus("Pick the matching color!");

    choicesEl.innerHTML = "";
    game.choices.forEach((colorName) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-btn";
        button.title = colorName;
        button.setAttribute("aria-label", colorName);
        button.style.backgroundColor = colorMap[colorName];
        button.addEventListener("click", () => checkGuess(colorName));
        choicesEl.appendChild(button);
    });

    startTimer();
}

function checkGuess(selectedColor) {
    if (!game.started || game.ended) {
        return;
    }

    clearTimer();

    if (selectedColor === game.currentColor) {
        game.score += 1;
        updateScore();
        setStatus("Correct! Great job!");
        setTimeout(nextRound, 700);
    } else {
        game.score = Math.max(0, game.score - 1);
        updateScore();
        setStatus("Not quite. Try again!");
        setTimeout(nextRound, 700);
    }
}

function endGame(reason) {
    game.started = false;
    game.ended = true;
    clearTimer();
    choicesEl.innerHTML = "";
    targetEl.style.backgroundColor = "#d1d5db";
    targetEl.textContent = "";

    const name = (playerNameInput.value || "Player").trim() || "Player";
    const finalMessage = reason === "lost"
        ? `You lost! Final score: ${game.score}.`
        : `Game ended! Final score: ${game.score}.`;

    setStatus(reason === "lost" ? "Game over!" : "Round ended.");
    setResult(`${finalMessage}\nName: ${name}\nDate: ${nowString()}`);
    saveHighScore();
}

function startGame() {
    game.started = true;
    game.ended = false;
    game.score = 0;
    updateScore();
    clearResult();
    setStatus("Pick the matching color!");
    updateDateTime();
    nextRound();
}

startBtn.addEventListener("click", startGame);
endBtn.addEventListener("click", () => endGame("ended"));
playerNameInput.addEventListener("input", () => {
    game.playerName = playerNameInput.value.trim();
});

updateDateTime();
const topHighScore = getHighScores()[0];
highScoreEl.textContent = `High Score: ${topHighScore ? topHighScore.score : 0}`;
updateScore();
setStatus("Press Start to begin.");

