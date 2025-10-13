let score = 0;
const scoreDisplay = document.getElementById('score');
const targetButton = document.getElementById('targetButton');
const resetButton = document.getElementById('resetButton');

targetButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = `Очки: ${score}`;
    targetButton.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
});

resetButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = `Очки: ${score}`;
    targetButton.style.backgroundColor = '#ff4444';
});