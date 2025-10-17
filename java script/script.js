// Import Firebase modular SDK v9.22.0
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEYhkdQSg0pP28yzgeBzt5m4YOthpZF3w",
  authDomain: "game-ad7c0.firebaseapp.com",
  databaseURL: "https://game-ad7c0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "game-ad7c0",
  storageBucket: "game-ad7c0.firebasestorage.app",
  messagingSenderId: "107605193533",
  appId: "1:107605193533:web:3f9d3479dda0194e81cb54",
  measurementId: "G-8FJ47Z33MW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Game Variables
let score = 0;
let multiplier = 1;
let turtleSkin = 'Assets/turtle-basick.png';
let userId = null;
let lastClickTime = 0;
const minClickInterval = 100;

// DOM Elements
const scoreDisplay = document.getElementById('score');
const targetButton = document.getElementById('targetButton');
const resetButton = document.getElementById('resetButton');
const turtleImage = document.getElementById('turtleImage');
const authSection = document.getElementById('auth-section');
const gameSection = document.getElementById('game-section');
const createAccountBtn = document.getElementById('create-account-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const statusMessage = document.getElementById('status-message');

// Utility Functions
function showStatus(message, type = 'error') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

function loadGameData() {
    if (!userId) return;
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            score = data.score || 0;
            multiplier = data.multiplier || 1;
            turtleSkin = data.turtleSkin || 'Assets/turtle-basick.png';
        } else {
            // Initialize new user data
            saveGameData();
        }
        updateDisplay();
    }, (error) => {
        showStatus('Помилка завантаження даних: ' + error.message);
    });
}

function saveGameData() {
    if (!userId) return;
    set(ref(database, `users/${userId}`), {
        score,
        multiplier,
        turtleSkin,
        lastUpdated: Date.now()
    }).catch((error) => {
        showStatus('Помилка збереження даних: ' + error.message);
    });
}

function updateDisplay() {
    scoreDisplay.textContent = `Очки: ${score} (Множник: ${multiplier})`;
    turtleImage.src = turtleSkin;
}

// Authentication Listeners
createAccountBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        showStatus('Введіть email та пароль.');
        return;
    }
    createAccountBtn.disabled = true;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            showStatus('Акаунт створено успішно!', 'success');
        })
        .catch((error) => {
            showStatus('Помилка створення акаунту: ' + error.message);
        })
        .finally(() => {
            createAccountBtn.disabled = false;
        });
});

signInBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        showStatus('Введіть email та пароль.');
        return;
    }
    signInBtn.disabled = true;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showStatus('Успішний вхід!', 'success');
        })
        .catch((error) => {
            showStatus('Помилка входу: ' + error.message);
        })
        .finally(() => {
            signInBtn.disabled = false;
        });
});

signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        showStatus('Вийшли з акаунту.', 'success');
    }).catch((error) => {
        showStatus('Помилка виходу: ' + error.message);
    });
});

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        authSection.style.display = 'none';
        signOutBtn.style.display = 'inline-block';
        gameSection.style.display = 'block';
        loadGameData();
        showStatus('Ласкаво просимо!', 'success');
    } else {
        userId = null;
        authSection.style.display = 'block';
        signOutBtn.style.display = 'none';
        gameSection.style.display = 'none';
        score = 0;
        multiplier = 1;
        turtleSkin = 'Assets/turtle-basick.png';
        updateDisplay();
    }
});

// Game Listeners
targetButton.addEventListener('click', () => {
    if (!userId) return; // Require auth
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    if (timeDiff < minClickInterval && lastClickTime !== 0) {
        showStatus('Здається, ви використовуєте автоклікер! Клікайте повільніше.');
        return;
    }
    score += multiplier;
    updateDisplay();
    saveGameData();
    lastClickTime = currentTime;
});

resetButton.addEventListener('click', () => {
    if (!userId) return;
    score = 0;
    multiplier = 1;
    turtleSkin = 'Assets/turtle-basick.png';
    updateDisplay();
    saveGameData();
    lastClickTime = 0;
    showStatus('Гру скинуто.', 'success');
});