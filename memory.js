const images = [
    'img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png',
    'img6.png', 'img7.png', 'img8.png', 'img9.png', 'img10.png'
];

const cards = [...images, ...images];
cards.sort(() => 0.5 - Math.random());

const gameContainer = document.getElementById('memory-game');
let flippedCards = [];
let lockBoard = false;

cards.forEach((imgSrc) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    const img = document.createElement('img');
    img.src = `./assets/memory/${imgSrc}`;
    front.appendChild(img);

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = "";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card, imgSrc));
    gameContainer.appendChild(card);
});

function flipCard(card, img) {
    if (lockBoard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push({ card, img });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.img === second.img) {
        flippedCards = [];
    } else {
        lockBoard = true;
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}
