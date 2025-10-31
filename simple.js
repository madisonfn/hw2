let jazzLoop;

let bread, lettuce, tomato, cheese, turkey, cucumber, pepper, board;
let breadImg, lettuceImg, tomatoImg, cheeseImg, cucumberImg, turkeyImg, pepperImg;

let gameOver = false;
let gameStarted = false;
let buttonX = 300, buttonY = 250, buttonW = 200, buttonH = 60;

let containerPositions = [
  [460, 240, 174, 151], // bread
  [753, 215, 94, 183],  // lettuce
  [480, 30, 92, 177],   // tomato
  [753, 28, 89, 182],   // cheese
  [665, 30, 85, 176],   // cucumber
  [570, 30, 92, 176],   // turkey
  [655, 215, 92, 183],  // pepper
];

let draggableIngredients = [];
let placedIngredients = [];
let dragged = null;

let player;
let currentOrder;
let allIngredients = ["bread", "lettuce", "tomato", "cheese", "cucumber", "turkey", "pepper"];

let minTime = 7, maxTime = 20;
let timeLimit, orderStartTime, lives = 3, completedOrders = 0;

function preload() {
  jazzLoop = loadSound("assets/jazz.wav");

  bread = loadImage("assets/bread.png");
  lettuce = loadImage("assets/lettuce.png");
  tomato = loadImage("assets/tomato.png");
  cheese = loadImage("assets/cheese.png");
  cucumber = loadImage("assets/cucumber.png");
  turkey = loadImage("assets/turkey.png");
  pepper = loadImage("assets/pepper.png");
  board = loadImage("assets/board.png");

  breadImg = loadImage("assets/bread2.png");
  lettuceImg = loadImage("assets/lettuce2.png");
  tomatoImg = loadImage("assets/tomato2.png");
  cheeseImg = loadImage("assets/cheese2.png");
  cucumberImg = loadImage("assets/cucumber2.png");
  turkeyImg = loadImage("assets/turkey2.png");
  pepperImg = loadImage("assets/pepper2.png");
}

function setup() {
  createCanvas(856, 432);

  draggableIngredients = [
    new Ingredient("bread", breadImg, 0, 0, 131, 156),
    new Ingredient("lettuce", lettuceImg, 0, 0, 96, 100),
    new Ingredient("tomato", tomatoImg, 0, 0, 102, 98),
    new Ingredient("cheese", cheeseImg, 0, 0, 86, 146),
    new Ingredient("cucumber", cucumberImg, 0, 0, 110, 109),
    new Ingredient("turkey", turkeyImg, 0, 0, 108, 106),
    new Ingredient("pepper", pepperImg, 0, 0, 109, 104),
  ];

  player = new Player();
  currentOrder = new Order(allIngredients);

  timeLimit = int(random(minTime, maxTime + 1));
  orderStartTime = millis();
}

function draw() {
  background(255);

  if (!gameStarted) {
    startScreen();
    return;
  }

  if (gameOver) {
    gameOverScreen();
    return;
  }

  currentOrder.display(50, 50);

  // draw static ingredient containers
  image(bread, 460, 240, 174, 151);
  image(lettuce, 753, 215, 94, 183);
  image(tomato, 480, 30, 92, 177);
  image(cheese, 753, 28, 89, 182);
  image(cucumber, 665, 30, 85, 176);
  image(turkey, 570, 30, 92, 176);
  image(pepper, 655, 215, 92, 183);

  image(board, 20, 200, 386, 189);

  for (let ing of placedIngredients) ing.display();
  if (dragged) {
    dragged.update();
    dragged.display();
  }

  // timer
  let elapsed = (millis() - orderStartTime) / 1000;
  let timeLeft = max(0, timeLimit - elapsed);

  if (timeLeft === 0) {
    lives--;
    if (lives <= 0) {
      gameOver = true;
    } else {
      resetBoard();
      timeLimit = int(random(minTime, maxTime + 1));
      orderStartTime = millis();
    }
  }

  fill(0);
  textSize(20);
  textAlign(LEFT);
  text(`Time: ${int(timeLeft)}`, 180, 50);
  text(`Lives: ${lives}`, 180, 80);
  text(`Score: ${completedOrders}`, 180, 110);

  // check order completion
  if (player.myIngredients.length === currentOrder.ingredients.length) {
    completedOrders++;
    resetBoard();
    timeLimit = int(random(minTime, maxTime + 1));
    orderStartTime = millis();
  }
}

function mousePressed() {
  if (gameOver &&
      mouseX > buttonX && mouseX < buttonX + buttonW &&
      mouseY > buttonY && mouseY < buttonY + buttonH) {
    resetGame();
    return;
  }

  for (let i = 0; i < containerPositions.length; i++) {
    let [x, y, w, h] = containerPositions[i];
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      let ing = draggableIngredients[i];
      dragged = new Ingredient(ing.name, ing.img, mouseX - ing.w / 2, mouseY - ing.h / 2, ing.w, ing.h);
      dragged.startDrag();
      break;
    }
  }
}

function mouseReleased() {
  if (!dragged) return;
  dragged.stopDrag();

  let boardX = 20, boardY = 200, boardW = 386, boardH = 189;

  if (mouseX > boardX && mouseX < boardX + boardW && mouseY > boardY && mouseY < boardY + boardH) {
    let nextIndex = player.myIngredients.length;

    let correctIngredient =
      nextIndex < currentOrder.ingredients.length &&
      dragged.name === currentOrder.ingredients[nextIndex];

    let correctPlacement = false;
    if (placedIngredients.length === 0) correctPlacement = true;
    else correctPlacement = collision(dragged, placedIngredients[placedIngredients.length - 1]);

    if (correctIngredient && correctPlacement) {
      placedIngredients.push(dragged);
      player.addIngredient(dragged.name);
    } else {
      lives--;
      if (lives <= 0) gameOver = true;
      else {
        resetBoard();
        timeLimit = int(random(minTime, maxTime + 1));
        orderStartTime = millis();
      }
    }
  }

  dragged = null;
}

function collision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function keyPressed() {
  if (key === " " && !gameStarted) {
    gameStarted = true;
    jazzLoop.loop();
  }
}

function startScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(40);
  text("Sandwich Stack!", width / 2, height / 2 - 100);
  textSize(20);
  text("Drag ingredients to match each order before time runs out.", width / 2, height / 2);
  text("You lose a life for every wrong move or missed order.", width / 2, height / 2 + 40);
  text("Press SPACE to start!", width / 2, height / 2 + 120);
}

function gameOverScreen() {
  if (jazzLoop.isPlaying()) jazzLoop.stop();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You did not master the art of the sandwich", width / 2, height / 2 - 60);
  fill(200, 100, 100);
  rect(buttonX, buttonY, buttonW, buttonH, 10);
  fill(255);
  textSize(24);
  text("Start Over?", buttonX + buttonW / 2, buttonY + buttonH / 2);
}

function resetBoard() {
  placedIngredients = [];
  dragged = null;
  player.reset();
  currentOrder = new Order(allIngredients);
}

function resetGame() {
  lives = 3;
  completedOrders = 0;
  timeLimit = int(random(minTime, maxTime + 1));
  resetBoard();
  gameOver = false;
}
