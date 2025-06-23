const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dragonImage = new Image();
dragonImage.src = './assets/dragon-invader/dragon-invader-fighter.png';

const enemyImage = new Image();
enemyImage.src = './assets/dragon-invader/Red_Death.webp';

const dragon = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 80,
    width: window.innerWidth < 768 ? 80 : 50,
    height: window.innerWidth < 768 ? 80 : 50,
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
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 70 : 40;
    const height = isMobile ? 70 : 40;
    const x = Math.random() * (canvas.width - width);
    enemies.push({ x, y: 0, width, height, speed: 2 });
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
            }
        });
    });
}

function shootFireball() {
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

// 🚀 Start
setInterval(spawnEnemy, 1500);
gameLoop();