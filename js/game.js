/*variables that are going to be used in the game*/

var jet, stars1, stars2; //objects
var enemies = [];
var bullets = [];

var distance, kills, power; //game properties
var earthX, earthY; //Earth coordinates
var isEarthDead, isPaused;

var animationsTimer;
var enemyCounter, enemyRand;
var animationsTimerTick;

//Canvas elements

/*rocket layer*/
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
/*background layer*/
var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
/*layer of bullets and enemies*/
var canvasBullet = document.getElementById('canvasBullet');
var ctxBullet = canvasBullet.getContext('2d');


var isGameStarted = false;
var isGameFinished = false;
var isMuted = false;
var previousUpdateTime = 0;

/*appeal to the browser to redraw the frame*/
var requestAnimFrame =  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

/*create a new resources object that says that after loading all resources call the init function*/
var resources = new Resources(init);

/*turns the music ON*/
resources.music.loop = true;
resources.music.play();

/*a function that is called at the end of resource utilization*/
function init() {
    document.addEventListener('keydown', checkKeyDown, false); /*by pressing any key call the checkKeyDown function*/
    document.addEventListener('keyup', checkKeyUp, false); /*by releasing any key - checkKeyUp*/
    resetGame();
    loop();
}

/*exposes the original values for the variables of the game and creates game objects*/
function resetGame() {
    isEarthDead = false;
    isBossDead = false;
    isPaused = false;

    jet = new Jet(resources);

    stars1 = new Stars(resources.star1, -STAR_SPEED_FRONT);
    stars2 = new Stars(resources.star2, -STAR_SPEED_MIDDLE);

    earthX = 800;
    earthY = 200;

    kills = 0;
    power = 0;
    distance = 8000;
    enemyCounter = 0;
    enemyRand = 0;

    animationsTimerTick = false;
    animationsTimer = 0;
}

// main functions
/*the main game loop that is repeated every few milliseconds*/
function loop() {
    var now = Date.now();/*take the current time in milliseconds*/
    var deltaTime = now - previousUpdateTime; /*counting the time elapsed since the previous function (frame) call*/
    previousUpdateTime = now;/*record the performance of the last frame, to know how long the last rendering and calculations took*/
    if(isPaused == false){/*if the game is not paused, we draw the next frame and do all calculations*/
        updateGame(deltaTime);
    }
    requestAnimFrame(loop);/*calls the next frame with the same function*/
}


/*most important function - controls the whole game logic*/
/*NB! the deltaTime contains the time elapsed since the performance of the previous frame*/
function updateGame(deltaTime) {
    //ctxBullet.drawImage(resources.enemySprite, 0, 0, 120, 119, 0, 0, 120, 119);
    if (!isGameStarted) { /*if the game has not started, draw the main menu*/
        //draw start menu image
        ctxBg.drawImage(resources.startMenu, 0, 0);/*draw the startMenu picture in coordinates of (0,0)*/
    } else {/*is the game is started*/
        //draw background image
        ctxBg.drawImage(resources.background, 0, 0);/*draw the bg picture in coordinates of (0,0)*/

        if (isGameFinished) {/*if the game is already finished, so*/
            jet.draw(false);/*draw the rocket*/
            if (isEarthDead) {/*is the Earth if dead - we lose*/
                ctxBg.drawImage(resources.fail, 0, 0);/*draw the picture that we lose*/
                ctxBg.drawImage(resources.ed, earthX, earthY);/*draw the dead Earth in coordinates of (earthX,earthY)*/
            } else {/*if we won*/
                ctxBg.drawImage(resources.finish, 0, 0);/*dwar the picture that we won*/
                ctxBg.drawImage(resources.earth, earthX, earthY);/*draw the Earth alive in coordinates of (earthX,earthY)*/
            }
        } else {/*if the game has not finished yet*/

            /*the frame counter to the rocket and enemies (30 fps)*/
            if (animationsTimerTick) {
                animationsTimerTick = false;
            }
            animationsTimer+=deltaTime;
            if (animationsTimer >= FRAMES_PER_SECOND) {
                animationsTimerTick = true;
                animationsTimer = 0;
            }

            /*distance to Earth decreases with every frame*/
            //reduce distance
            if (distance > 0) {
                distance--;/*decrease by 1*/
            }

            updateDrawStars(deltaTime);/*dwar the stars on the background*/

            //draw Earth if closer than 5000km
            if (distance <= 4000) {
                //move Earth closer as distance decreases
                if (distance > 0) {
                    earthX -= 0.1;/*deduct one-tenth of a pixel*/
                }
                ctxBg.drawImage(resources.earth, earthX, earthY);/*draw the Earth in coordinates of (earthX,earthY)*/
            }

            jet.move(deltaTime);/*call the function to move the rocket*/
            var bullet = jet.maybeFireBullet();/*call the function that shot the bullet, and if it did a shot we save the into the variable bullet*/
            if (bullet != null) {/*if it did a shot*/
                console.log("Fired a bullet");
                bullets.push(bullet);/*put the new bullet into the array of all existing bullets*/
            }
            jet.draw(animationsTimerTick);/*call the function that draws the rocket*/
            drawAllBullets(deltaTime);/*call the function that draws all bullets*/

            spawnEnemy(deltaTime);/*call the function that makes a new asteroid*/
            updateDrawAllEnemies(deltaTime, animationsTimerTick);/*call the function that updates and draws all enemies*/

            if (distance <= 0) {/*if we have reached the Earth so*/
                isGameFinished = true;/*the game finishes*/
                isEarthDead = power < 0;/*if the power is less than 1 we lose*/
            }

            drawText();/*call the function that draws the text on the screen*/
        }
    }
}

/*function that makes a new enemy*/
function spawnEnemy(deltaTime){
    /*stores the number of milliseconds since the creation of the previous enemy*/
    enemyCounter+=deltaTime;/*with every frame we increase the number by the time elapsed since the previous license frame*/
    if (enemyCounter >= enemyRand) {/*if the number of milliseconds is more than a random number is to create a new enemy*/
        var randomY = Math.floor((Math.random()*550)+1);/*create a random vertical position for a new enemy*/
        var newEnemy = new Enemy(800, randomY, resources);/*create a new enemy with this provision*/
        enemies.push(newEnemy);/*add a new enemy to the array of all existing enemies*/
        enemyCounter = 0;/*reset the passed milliseconds counter*/

        /*create a random number of milliseconds
         in the range between the minimum and maximum delay before creating a new enemy*/
        enemyRand = Math.floor((Math.random()*ENEMY_SPAWN_DELAY_RANGE+ENEMY_SPAWN_MIN_DELAY));
    }
}

/*redraw the stars in the background*/
function updateDrawStars(deltaTime){
    stars1.move(deltaTime);/*call the function to move the first set of stars*/
    stars2.move(deltaTime);
    stars1.draw();/*call the function to draw the first set of stars*/
    stars2.draw();
}

/*draws all the bullets*/
function drawAllBullets(deltaTime) {
    for (var i = bullets.length - 1; i >= 0; i--) {/*pass through an array of bullets*/
        var bullet = this.bullets[i];/*take one of the bullets*/
        if (bullet.hasHitTarget) {/*if it has already hit the target*/
            console.log("Bullet has hit target");
            bullets.splice(i, 1);/*we delete it from the array*/
            continue;/*going to the next bullet*/
        }
        /*if it has NOT hit the target*/
        bullet.move(deltaTime);/*call a function that moves the bullet*/
        if (bullet.isOutOfScreen) {/*if the bullet went off the screen*/
            console.log("Bullet is out of screen");
            bullets.splice(i, 1);/*delete it from the array*/
            continue;/*going to the next bullet*/
        }
        /*if the bullet did NOT went off the screen*/
        bullet.draw();/*call a function that draws a bullet*/
    }
}

/*renews and renders all enemies*/
function updateDrawAllEnemies(deltaTime, changeSprite) {
    for (var i=enemies.length-1; i>=0; i--) {/*pass through an array of enemies*/
        var enemy = enemies[i];/*take one of the enemies*/
        enemy.move(deltaTime);/*call functions for the enemy's movement*/
        if (enemy.isOutOfScreen) {/*if the enemy has went off the screen*/
            enemies.splice(i, 1);/*delete the enemy from the array*/
            continue;/*going to the next enemy*/
        }
        /*if it has NOT gone off the screen*/
        enemy.collision(bullets);/*call the function that checks a collision with any of the enemy bullets*/
        if (enemy.life <= 0) {/*if it is dead*/
            enemies.splice(i, 1);/*delete it from the array*/
            continue;/*going to the next one*/
        }
        /*if the enemy if still alive*/
        enemy.draw(changeSprite);/*call the function to draw the enemy*/
    }
}

/*draws the text*/
function drawText(){
    ctxBg.lineWidth=1;
    ctxBg.fillStyle="#FFFFFF";
    ctxBg.lineStyle="#ffff00";
    ctxBg.font="18px sans-serif";
    ctxBg.fillText("POWER: " + power, 20, 25);
    ctxBg.fillText("DESTROYED: " + kills, 130, 25);
    ctxBg.fillText(distance + " KM TO EARTH", 615, 25);
}

/*clean background layer*/
function clearCtxBg() {
    ctxBg.clearRect(0, 0, 800, 600);
}

/*clear layer with rockets and bullets and enemies*/
function clearCtxJetEnemyBullet() {
    ctxJet.clearRect(0, 0, 800, 600);
    ctxBullet.clearRect(0, 0, 800, 600);
}

// event functions
/*call by pressing any key*/
function checkKeyDown(e) {
    e.preventDefault();
    var keyID = e.keyCode || e.which;

    /*if the letter M is pressed*/
    if (keyID === 77 ) { // M
        if (isMuted) {
            resources.music.play();
        } else {
            resources.music.pause();
        }
        isMuted = !isMuted;
    }

    /*if the enter is pressed*/
    if (keyID === 13 ) { //enter
        if (!isGameStarted) {/*if the game is not started, start the game*/
            isGameStarted = true;
        }
        if(isGameFinished){/*if the game is finished*/
            resetGame();/*reset all game variables to the initial values*/
            isGameFinished = false;/*start a new game*/
            isGameStarted = true;
        }
    }

    /*if the game is started but now finished yet*/
    if (isGameStarted && !isGameFinished) {
        if (keyID === 38 || keyID === 87) { //up arrow, W key
            jet.verticalAcceleration = -0.8;
        }
        if (keyID === 39 || keyID === 68) { //right arrow, D key
            jet.horizontalAcceleration = 1;
            jet.isReversed = false;
        }
        if (keyID === 40 || keyID === 83) { //down arrow, S key
            jet.verticalAcceleration = 1;
        }
        if (keyID === 37 || keyID === 65) { //left arrow, A key
            jet.horizontalAcceleration = -1;
            jet.isReversed = true;
        }

        if (keyID === 80) { // P
            isPaused = !isPaused;
        }

        if (keyID === 32) { // space
            jet.isShooting = true;
        }
    }
}

/*if the key is pressed, then this function is called*/
function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (isGameStarted && !isGameFinished) {
        if (keyID === 38 || keyID === 87) { //up arrow, W key
            jet.verticalAcceleration = 0;
        }
        if (keyID === 39 || keyID === 68) { //right arrow, D key
            jet.horizontalAcceleration = 0;
        }
        if (keyID === 40 || keyID === 83) { //down arrow, S key
            jet.verticalAcceleration = 0;
        }
        if (keyID === 37 || keyID === 65) { //left arrow, A key
            jet.horizontalAcceleration = 0;
        }
        if (keyID === 32) { // space
            jet.isShooting = false;
        }
    }
}
// end of event functions