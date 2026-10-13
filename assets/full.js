
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

const game = {
    score: 0,
    timeLeft: 10,
    timerId: null,
    currentColor: "",
    choices: []
};

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const targetEl = document.getElementById("targetColor");
const statusEl = document.getElementById("status");
const choicesEl = document.getElementById("choices");

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
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

function startTimer() {
    clearTimer();
    game.timeLeft = 10;
    updateTimer();

    game.timerId = setInterval(() => {
        game.timeLeft -= 1;
        updateTimer();

        if (game.timeLeft <= 0) {
            clearTimer();
            setStatus("Time is up! New round starting...");
            setTimeout(nextRound, 800);
        }
    }, 1000);
}

function nextRound() {
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
        button.setAttribute("aria-label", colorName);
        button.title = colorName;
        button.style.backgroundColor = colorMap[colorName];
        button.addEventListener("click", () => checkGuess(colorName));
        choicesEl.appendChild(button);
    });

    startTimer();
}

function checkGuess(selectedColor) {
    clearTimer();

    if (selectedColor === game.currentColor) {
        game.score += 1;
        updateScore();
        setStatus("Correct! Great job!");
    } else {
        game.score = Math.max(0, game.score - 1);
        updateScore();
        setStatus("Not quite. Try the next one!");
    }

    setTimeout(nextRound, 800);
}

updateScore();
nextRound();

