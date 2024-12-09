let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// Snake and apple images
let normalMonkeyImg = new Image();
normalMonkeyImg.src = "monkey.png"; // Replace with your normal monkey image path
let warningMonkeyImg = new Image();
warningMonkeyImg.src = "monkey_an.png"; // Replace with your warning monkey image path
let currentMonkeyImg = normalMonkeyImg;

let appleImg = new Image();
appleImg.src = "apple.png"; // Replace with your apple image file path

// Snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Game variables
let speed = 7;
let tileCount = 20;
let tileSize = (canvas.width / tileCount - 2) * 1.5;

let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let timeLeft = 10; // Set initial time left to 10 seconds
let appleTimer = 5; // Timer to regenerate apple

let gulpSound = new Audio("gulp.mp3");

// Game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  updateApplePosition(); // Update apple if timer runs out
  updateMonkeyImage(); // Change monkey image based on time left
  drawSnake();
  drawScore();
  drawTimer();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  // Decrease timers
  timeLeft -= 1 / speed;
  appleTimer -= 1 / speed;

  if (timeLeft <= 0) {
    displayGameOver();
    return;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  // Walls collision
  if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
    gameOver = true;
  }

  // Self-collision
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    displayGameOver();
  }

  return gameOver;
}

function displayGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";

  let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");

  ctx.fillStyle = gradient;
  ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score: " + score, canvas.width - 60, 10);
}

function drawTimer() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Time Left: " + Math.ceil(timeLeft), 10, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  // Draw the snake head as the current monkey image
  ctx.drawImage(
    currentMonkeyImg,
    headX * tileCount,
    headY * tileCount,
    tileSize,
    tileSize
  );

  snakeParts.push(new SnakePart(headX, headY)); // Add new head to the snake

  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // Remove the oldest part of the snake
  }
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.drawImage(
    appleImg,
    appleX * tileCount,
    appleY * tileCount,
    tileSize,
    tileSize
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    score++;
    gulpSound.play();

    // Reset timers
    timeLeft = 10; // Reset time left to 10 seconds
    appleTimer = 5; // Reset apple timer
  }
}

function updateApplePosition() {
  if (appleTimer <= 0) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    appleTimer = 5; // Reset apple timer to 5 seconds
  }
}

function updateMonkeyImage() {
  if (timeLeft < 5) {
    currentMonkeyImg = warningMonkeyImg; // Change to warning monkey
  } else {
    currentMonkeyImg = normalMonkeyImg; // Revert to normal monkey
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  // Up
  if ((event.keyCode == 38 || event.keyCode == 87) && inputsYVelocity !== 1) {
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  // Down
  if ((event.keyCode == 40 || event.keyCode == 83) && inputsYVelocity !== -1) {
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  // Left
  if ((event.keyCode == 37 || event.keyCode == 65) && inputsXVelocity !== 1) {
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  // Right
  if ((event.keyCode == 39 || event.keyCode == 68) && inputsXVelocity !== -1) {
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();
