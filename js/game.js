const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const nextPhaseButton = document.getElementById('next-phase');

const charactersPhase1 = [
    'hierophant',
    'fortune',
    'death',
    'moon',
    'sun',
];

const charactersPhase2 = [
    'hierophant',
    'fortune',
    'death',
    'moon',
    'sun',
    'hierophant',
    'fortune',
    'death',
    'moon',
    'sun',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

let firstCard = null;
let secondCard = null;
let canFlip = true;
let phase = 1;
let countdownInterval;
let currentTime = 0;

const checkEndGamePhase1 = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length === 10) {
        clearInterval(countdownInterval);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo na primeira fase foi de: ${timer.innerHTML}`);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Você concluiu a primeira fase!`);
        phase = 2;
        startSecondPhase();
    }
};

const checkEndGamePhase2 = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (phase === 2 && disabledCards.length === 20) {
        clearInterval(countdownInterval);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo na segunda fase foi de: ${timer.innerHTML}`);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Você concluiu ambas as fases do jogo.`);
    }
};

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        firstCard = null;
        secondCard = null;

        canFlip = true;

        if (phase === 1) {
            checkEndGamePhase1();
        } else {
            checkEndGamePhase2();
        }

    } else {
        setTimeout(resetCards, 1000);
    }
};

const resetCards = () => {
    firstCard.classList.remove('reveal-card');
    secondCard.classList.remove('reveal-card');
    firstCard = null;
    secondCard = null;
    canFlip = true;
};

const revealCard = ({ target }) => {
    const card = target.parentNode;
    if (card.className.includes('reveal-card') || !canFlip) {
        return;
    }

    card.classList.add('reveal-card');

    if (firstCard === null) {
        firstCard = card;
    } else if (secondCard === null) {
        secondCard = card;
        canFlip = false;
        checkCards();
    }
};

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../image/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
};

const loadGame = (phaseCharacters) => {
    const duplicateCharacters = [...phaseCharacters, ...phaseCharacters];

    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
};

const startTimer = () => {
    countdownInterval = setInterval(() => {
        currentTime++;
        const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const seconds = (currentTime % 60).toString().padStart(2, '0');
        timer.innerHTML = `${minutes}:${seconds}`;
    }, 1000);
};

const startSecondPhase = () => {
    grid.innerHTML = '';
    loadGame(charactersPhase2);
    canFlip = true;
    currentTime = 0;
    startTimer();
};


window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player');
    loadGame(charactersPhase1);
    startTimer();
};
