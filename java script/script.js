let score = localStorage.getItem('turtleScore') ? parseInt(localStorage.getItem('turtleScore')) : 0;
let multiplier = localStorage.getItem('turtleMultiplier') ? parseInt(localStorage.getItem('turtleMultiplier')) : 1;
let turtleSkin = localStorage.getItem('turtleSkin') || 'Assets/turtle-basick.png';
const scoreDisplay = document.getElementById('score');
const targetButton = document.getElementById('targetButton');
const resetButton = document.getElementById('resetButton');
const turtleImage = document.getElementById('turtleImage');
let lastClickTime = 0;
const minClickInterval = 100; // Мінімальний інтервал між кліками в мілісекундах (0.1 секунди)

scoreDisplay.textContent = `Очки: ${score}`;
turtleImage.src = turtleSkin;

// Перевірка на людський клік
targetButton.addEventListener('click', () => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    // Якщо інтервал між кліками занадто малий або клік перший
    if (timeDiff < minClickInterval && lastClickTime !== 0) {
        alert("Здається, ви використовуєте автоклікер! Клікайте повільніше.");
        return; // Ігноруємо клік
    }

    score += multiplier;
    scoreDisplay.textContent = `Очки: ${score}`;
    localStorage.setItem('turtleScore', score);
    lastClickTime = currentTime; // Оновлюємо час останнього кліку
});

// Скидання гри
resetButton.addEventListener('click', () => {
    score = 0;
    multiplier = 1;
    turtleSkin = 'Assets/turtle-basick.png';
    turtleImage.src = turtleSkin;
    scoreDisplay.textContent = `Очки: ${score}`;
    localStorage.setItem('turtleScore', score);
    localStorage.setItem('turtleMultiplier', multiplier);
    localStorage.setItem('turtleSkin', turtleSkin);
    lastClickTime = 0; // Скидаємо час при ресеті
});