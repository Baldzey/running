class Game {
  constructor() {}

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  async start() {
    if (gameState === 0) {
      player = new Player();
      var playerCountRef = await database.ref("playerCount").once("value");
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form();
      form.display();
    }

    ground = createSprite(0, 0, 0, 0);
    ground.shapeColor = "white";
    ground.addImage("ground_image", ground_image);
    ground.scale = 2;
    ground.velocityX = -1;

    zombie = createSprite(40, 420, 600, 10);
    zombie.addImage(zombieImg);
    zombie.scale = 0.2;
    zombie.debug = true;

    heart1 = createSprite(460, 230, 20, 20);
    heart1.addImage(heartImg);
    heart1.scale = 0.03;

    heart2 = createSprite(490, 230, 20, 20);
    heart2.addImage(heartImg);
    heart2.scale = 0.03;

    heart3 = createSprite(520, 230, 20, 20);
    heart3.addImage(heartImg);
    heart3.scale = 0.03;

    girl = createSprite(290, 420, 600, 10);
    girl.addAnimation("girl_running", girl_running);
    girl.addImage("girl_collided", girl_collided);
    girl.addImage("girlImage", girlImage);
    girl.scale = 0.2;
    girl.debug = true;
    girl.setCollider("rectangle", 0, 0, girl.width-50, girl.height-20);

    character=[girl]


    invisible_ground = createSprite(300, displayHeight - 50, displayWidth * 2, 10);
    invisible_ground.visible = false;

    gameOver = createSprite(displayWidth / 2, displayHeight / 2);
    gameOver.addImage(gameOverImage);

    restart = createSprite(displayWidth / 2, displayHeight / 2 + 80);
    restart.addImage(restartImage);

    obstaclesGroup = new Group();

    score = 0;
  }

  play() {
    form.hide();

    Player.getPlayerInfo();

    if (allPlayers !== undefined) {
      zombie.velocityY = zombie.velocityY + 0.6;
      zombie.collide(invisible_ground);

      girl.velocityY = girl.velocityY + 0.6;
      girl.collide(invisible_ground);

      if (frameCount % 120 === 0) {
        var obstacle = createSprite(1200, displayHeight - 90, 10, 40);
        obstacle.velocityX = -6; 
  
        console.log("inside spawnObstacles")
  
       girl.depth = obstacle.depth;
        girl.depth = girl.depth + 1;
  
        zombie.depth = obstacle.depth;
        zombie.depth = girl.depth + 1;
  
        var rand = Math.round(random(1, 6));
        obstacle.addImage(obstacle1);
        obstacle.scale = 0.1;
        obstaclesGroup.add(obstacle);
        obstacle.debug = true;
        obstacle.setCollider("circle", 0, 0, 5);
      }
      
      if (gameState === 1) {
        gameOver.visible = false;
        restart.visible = false;
        fill("pink");
        textSize(20);
        text("Score: " + score, 450, 200);

       
           var index=0;
           var x=290;
           var y;
      

        ground.velocityX = -(4 + (3 * score) / 100);

        if (ground.x < 0) {
          ground.x = ground.width / 2;
        }

       
        if (score > 0 && score % 100 === 0) {
          checkPointSound.play();
        }

        if (keyDown("space") && girl.y >= 660) {
          girl.velocityY = -12;
          jumpSound.play();
          score++;
        }

        if (girl.isTouching(obstaclesGroup)) {
          girl.changeAnimation("girlImage");
          life = life - 1;

          if (life === 2) {
            heart3.visible = false;
          } else if (life === 1) {
            heart2.visible = false;
            heart3.visible = false;
          } else if (life === 0) {
            heart1.visible = false;
            heart2.visible = false;
            heart3.visible = false;
          }

          gameState = 2;
          dieSound.play();
        }

        if (zombie.isTouching(obstaclesGroup)) {
          zombie.velocityY = -12;
        }

        for(var plr in allPlayers){
          index = index + 1 ;
  
          x = x + 200;
          y = displayHeight - allPlayers[plr].distance;
          console.log(character[index-1].x)
          character[index-1].x = x;  
          if (index === player.index){
            character[index - 1].shapeColor = "red";
            camera.position.x = displayWidth/2;
          }
         
          
        }

        if(keyIsDown(UP_ARROW) && player.index !== null){
          player.distance +=10
          player.update();
        }
        if(player.distance > 3860){
          gameState = 2;
        }

      } else if (gameState === 2) {
        gameOver.visible = true;

        restart.visible = true;
        ground.velocityX = 0;
        girl.velocityY = 0;
        girl.changeImage("girlImage", girlImage);

        obstaclesGroup.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(0);

        if (mousePressedOver(restart)) {
          if (life > 0) {
            reset();
          }
        }
      }

      
    }

    drawSprites();
  }
  spawnObstacles() {
    
  }
  end() {
    console.log("Game Ended");
  }

  reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    girl.changeAnimation("girl_running", girl_running);
    obstaclesGroup.destroyEach();
    score = 0;
  }

  
}
