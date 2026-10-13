let colors = ["Red", "Blue", "Green"];
let answer = getColor();

document.getElementById("target").textContent = answer;

function getColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function guess(color) {
    if (color.toLowerCase() === answer.toLowerCase()) {
        alert("Good Job! 🎉");

        answer = getColor();

        document.getElementById("target").textContent = answer;
    } else {
        alert("Try Again!");
    }
}
