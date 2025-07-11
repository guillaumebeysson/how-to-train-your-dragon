const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fireSound = new Audio('./assets/dragon-invader/laser.mp3');

const dragonImage = new Image();
dragonImage.src = './assets/dragon-invader/dragon-invader-fighter.png';

const enemyImage = new Image();
enemyImage.src = './assets/dragon-invader/Red_Death.webp';

const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");

let score = 0;
let enemySpeed = 1;

if (window.innerWidth < 768) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const scale = canvas.height / 600;
const dragon = {
    x: canvas.width / 2 - (50 * scale) / 2,
    y: canvas.height - 50 * scale - 10,
    width: 50 * scale,
    height: 50 * scale,
    speed: 5,
    movingLeft: false,
    movingRight: false
};

let fireballs = [];
let enemies = [];

function drawDragon() {
    ctx.drawImage(dragonImage, dragon.x, dragon.y, dragon.width, dragon.height);
}

function drawFireballs() {
    ctx.fillStyle = "orange";
    fireballs.forEach(fb => {
        ctx.beginPath();
        ctx.arc(fb.x, fb.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateFireballs() {
    fireballs.forEach(fb => fb.y -= fb.speed);
    fireballs = fireballs.filter(fb => fb.y > 0);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateEnemies() {
    enemies.forEach(enemy => enemy.y += enemy.speed);
    enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function spawnEnemy() {
    const scale = canvas.height / 600; // base 600px comme référence
    const width = 80 * scale;
    const height = 80 * scale;
    const x = Math.random() * (canvas.width - width);
    const y = -height;

    enemies.push({ x, y, width, height, speed: enemySpeed });
}


function checkCollisions() {
    fireballs.forEach((fb, fbIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                fb.x > enemy.x &&
                fb.x < enemy.x + enemy.width &&
                fb.y > enemy.y &&
                fb.y < enemy.y + enemy.height
            ) {
                fireballs.splice(fbIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreElement.textContent = `Score : ${score}`;

                if (score % 100 === 0) {
                    enemySpeed += 1;
                    speedElement.textContent = `Vitesse: ${enemySpeed}`;
                }
            }
        });
    });
}

function shootFireball() {
    fireSound.currentTime = 0;
    fireSound.play();
    fireballs.push({
        x: dragon.x + dragon.width / 2,
        y: dragon.y,
        speed: 7
    });
}

function updateDragonMovement() {
    if (dragon.movingLeft && dragon.x > 0) dragon.x -= dragon.speed;
    if (dragon.movingRight && dragon.x + dragon.width < canvas.width) dragon.x += dragon.speed;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateDragonMovement();
    updateFireballs();
    updateEnemies();
    checkCollisions();

    drawDragon();
    drawFireballs();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

// 🔑 Contrôles clavier
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") dragon.movingLeft = true;
    if (e.key === "ArrowRight") dragon.movingRight = true;
    if (e.key === "ArrowUp") shootFireball();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") dragon.movingLeft = false;
    if (e.key === "ArrowRight") dragon.movingRight = false;
});

// 📱 Contrôles mobile
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const fireBtn = document.getElementById("fire-btn");

const preventDefault = (e) => e.preventDefault();

let useGyro = false;
document.addEventListener("DOMContentLoaded", () => {
    const toggleControlBtn = document.getElementById("toggle-control-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettings = document.getElementById("close-settings");

    toggleControlBtn.addEventListener("click", () => {
        useGyro = !useGyro;
        toggleControlBtn.textContent = useGyro ? "🔄" : "↔️";
    });

    settingsBtn.addEventListener("click", () => {
        settingsModal.classList.remove("hidden");
    });

    closeSettings.addEventListener("click", () => {
        settingsModal.classList.add("hidden");
    });
});

leftBtn.addEventListener("touchstart", (e) => {
    preventDefault(e);
    dragon.movingLeft = true;
});

leftBtn.addEventListener("touchend", (e) => {
    preventDefault(e);
    dragon.movingLeft = false;
});

rightBtn.addEventListener("touchstart", (e) => {
    preventDefault(e);
    dragon.movingRight = true;
});

rightBtn.addEventListener("touchend", (e) => {
    preventDefault(e);
    dragon.movingRight = false;
});

fireBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    shootFireball();
});

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
        if (!useGyro) return;

        const gamma = event.gamma;

        if (gamma < -10) {
            dragon.movingLeft = true;
            dragon.movingRight = false;
        } else if (gamma > 10) {
            dragon.movingRight = true;
            dragon.movingLeft = false;
        } else {
            dragon.movingLeft = false;
            dragon.movingRight = false;
        }
    });
}

// 🚀 Start
setInterval(spawnEnemy, 1500);
gameLoop();