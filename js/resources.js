function Resources(loadHandler) {
    var pendingImages = 11;

    function imageLoaded() {
        if (--pendingImages == 0) {
            loadHandler();
        }
    }

    this.background = new Image();
    this.background.src = 'images/bg.png';
    this.background.addEventListener('load', imageLoaded, false);

    this.bullet = new Image();
    this.bullet.src = 'images/Bullet.gif';
    this.bullet.addEventListener('load', imageLoaded, false);

    this.star1 = new Image();
    this.star1.src = 'images/frontstars.png';
    this.star1.addEventListener('load', imageLoaded, false);

    this.star2 = new Image();
    this.star2.src = 'images/backstars.png';
    this.star2.addEventListener('load', imageLoaded, false);

    this.enemySprite = new Image();
    this.enemySprite.src = 'images/asteroidSprite.png';
    this.enemySprite.addEventListener('load', imageLoaded, false);

    this.sprite = new Image();
    this.sprite.src = 'images/rocketSpriteSheet.png';
    this.sprite.addEventListener('load', imageLoaded, false);

    this.startMenu = new Image();
    this.startMenu.src = 'images/main.png';
    this.startMenu.addEventListener('load', imageLoaded, false);

    this.earth = new Image();
    this.earth.src = 'images/earth.png';
    this.earth.addEventListener('load', imageLoaded, false);

    this.ed = new Image();
    this.ed.src = 'images/deadEarth.png';
    this.ed.addEventListener('load', imageLoaded, false);

    this.finish = new Image();
    this.finish.src = 'images/won.png';
    this.finish.addEventListener('load', imageLoaded, false);

    this.fail = new Image();
    this.fail.src = 'images/failed.png';
    this.fail.addEventListener('load', imageLoaded, false);

    this.klaver = new Audio("sounds/klaver.mp3");
    this.hit = new Audio("sounds/hit.mp3");
    this.shoot = new Audio("sounds/laser.wav");
    this.music = new Audio("sounds/maintheme.mp3");
}