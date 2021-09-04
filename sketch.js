var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, groundImg, invImg;
var girl, runGirl, dieGirl, imgGirl;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var zombie;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  groundImg = loadImage("images/Background.png");
  runGirl = loadAnimation(
    "images/Run (1).png",
    "images/Run (2).png",
    "images/Run (3).png",
    "images/Run (4).png",
    "images/Run (5).png",
    "images/Run (6).png",
    "images/Run (7).png",
    "images/Run (8).png",
    "images/Run (9).png",
    "images/Run (10).png",
    "images/Run (11).png",
    "images/Run (12).png",
    "images/Run (14).png",
    "images/Run (15).png",
    "images/Run (16).png",
    "images/Run (17).png",
    "images/Run (18).png",
    "images/Run (19).png",
    "images/Run (20).png"
  );

  obstacle1 = loadImage("images/obstacle1.png ");
  jumpSound = loadSound("images/jump.mp3");
  dieSound = loadSound("images/die.mp3");
  checkPointSound = loadSound("images/checkPoint.mp3");
  gameOverImage = loadImage("images/gameOver1.png");
  restartImage = loadImage("images/restart1.png");
  dieGirl = loadImage("images/dead.png");
  imgGirl = loadImage("images/dead.png");
  zombieImage = loadImage("images/zombie.png")
}

function setup() {
  createCanvas(900, 500);

  
  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("groundImg", groundImg);
  ground.scale = 1.4;
  ground.velocityX = -1;

  zombie = createSprite(100, 420, 600, 10);
  zombie.addAnimation("zombieImage", zombieImage);
  zombie.scale = 0.2;


  girl = createSprite(300, 420, 600, 10);
  girl.addAnimation("runGirl", runGirl);
  girl.addImage("dieGirl", dieGirl);
  girl.addImage("imgGirl", imgGirl);
  girl.scale = 0.2;
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height);

  invImg = createSprite(300, 470, 600, 10);
  invImg.visible = false;

  gameOver = createSprite(400, 150);
  gameOver.addImage(gameOverImage);

  restart = createSprite(400, 250);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("white");

  
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invImg);

  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invImg);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();

    ground.velocityX = -(4 + (3 * score) / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (keyDown("space") && girl.y >= 400) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      girl.changeAnimation("imgGirl");
      gameState = END;
      dieSound.play();
    }

    if (zombie.isTouching(obstaclesGroup)) {
     zombie.velocityY = -10
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0;
    girl.changeImage("imgGirl", imgGirl);

    

    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill("purple");
  textSize(20);
  text("Score: " + score, 450, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.changeAnimation("runGirl", runGirl);
  obstaclesGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6; 

    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }
}
