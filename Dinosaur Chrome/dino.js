// Эт как бы наша доска, ну типо экран
let board;
let boardWidth = 1050; // ну пусть будет так, а не 1000
let boardHeight = 350; // высота как в сабвэй серф
let context;

// динозавр тут
let dinoWidth = 88; // ширина динозавра, он на диете
let dinoHeight = 94; // высота
let dinoDuckWidth = 118; // когда приседает, шире
let dinoDuckHeight = 60; // когда приседает, ниже
let dinoX = 50; // старт по X, пусть влево будет
let dinoY = boardHeight - dinoHeight; // прыгает с земли

// всякие картинки, вот это всё
let dinoImg = new Image(); // просто стоит такой динозавр
let dinoRun1 = new Image(); // первый кадр бега
let dinoRun2 = new Image(); // второй кадр бега
let dinoDead = new Image(); // динозавр упал и умер 🪦
let dinoDuck1 = new Image(); // присел 1
let dinoDuck2 = new Image(); // присел 2
let currentDinoImg; // типа что показывать сейчас

// динозавр, прям как объект в Майнкрафте
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

let velocityY = 0; // скорость по Y, пока не летит
let gravity = 0.4; // гравитация, спасибо Ньютон
let isJumping = false; // прыгает или нет, true = в полёте
let isDucking = false; // присел или нет

// кактусы, эти зелёные злобные ребята
let cactusArray = [];
let cactus1Img = new Image(); // маленький
let cactus2Img = new Image(); // побольше
let cactus3Img = new Image(); // здоровенный

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 1050;
let cactusY = boardHeight - cactusHeight;

let gameOver = false;
let gameOverImg = new Image();

let frameCount = 0;
let score = 0; // очки, ну не для зрения

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    dinoImg.src = "./img/dino.png";
    dinoRun1.src = "./img/dino-run1.png";
    dinoRun2.src = "./img/dino-run2.png";
    dinoDead.src = "./img/dino-dead.png";
    dinoDuck1.src = "./img/dino-duck1.png";
    dinoDuck2.src = "./img/dino-duck2.png";
    currentDinoImg = dinoImg;

    cactus1Img.src = "./img/cactus1.png";
    cactus2Img.src = "./img/cactus2.png";
    cactus3Img.src = "./img/cactus3.png";

    gameOverImg.src = "./img/game-over.png";

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
};

function update() {
    context.clearRect(0, 0, board.width, board.height);

    if (gameOver) {
        context.drawImage(dinoDead, dino.x, dino.y, dino.width, dino.height);
        context.drawImage(gameOverImg, boardWidth / 2 - gameOverImg.width / 2, boardHeight / 2 - gameOverImg.height / 2);
        return;
    }

    // гравитация работает
    velocityY += gravity;
    dino.y += velocityY;

    if (dino.y > boardHeight - dino.height) {
        dino.y = boardHeight - dino.height;
        velocityY = 0;
        isJumping = false;
    }

    // анимация
    frameCount++;
    if (isJumping) {
        currentDinoImg = dinoImg; // в прыжке — стоячий
    } else if (isDucking) {
        currentDinoImg = (frameCount % 20 < 10) ? dinoDuck1 : dinoDuck2;
    } else {
        currentDinoImg = (frameCount % 20 < 10) ? dinoRun1 : dinoRun2;
    }

    context.drawImage(currentDinoImg, dino.x, dino.y, dino.width, dino.height);

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x -= 5;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
        }

        if (!cactus.scored && cactus.x + cactus.width < dino.x) {
            score++;
            cactus.scored = true;
        }
    }

    cactusArray = cactusArray.filter(cactus => cactus.x + cactus.width > 0);

    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Score: " + score, 5, 20);

    requestAnimationFrame(update);
}

function keyDown(e) {
    if ((e.code === "Space" || e.code === "ArrowUp") && !isJumping && !gameOver) {
        velocityY = -12;
        isJumping = true;
    }

    if (e.code === "ArrowDown" && !isJumping && !gameOver) {
        isDucking = true;
        dino.height = dinoDuckHeight;
        dino.width = dinoDuckWidth;
        dino.y = boardHeight - dinoDuckHeight; // опускаем динозавра
    }
}

function keyUp(e) {
    if (e.code === "ArrowDown") {
        isDucking = false;
        dino.height = dinoHeight;
        dino.width = dinoWidth;
        dino.y = boardHeight - dinoHeight; // возвращаем наверх
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function placeCactus() {
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight,
        scored: false
    };

    let chance = Math.random();
    if (chance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (chance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else if (chance > 0.50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    } else {
        return;
    }

    cactusArray.push(cactus);
}
