function Enemy(startX, startY, resources) {
    this.drawX = startX;
    this.drawY = startY;
    this.life = 6;
    this.isOutOfScreen = false;
    this.sprite = resources.enemySprite;
    this.spriteWidth = 120;
    this.spriteHeight = 119;
    this.spriteX = 0;
    this.resources = resources;
}

Enemy.prototype.collision = function(bullets) {
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];

        //check collision with bullet
        if (bullet.drawX >= this.drawX + 13 - 5 && bullet.drawX <= this.drawX + 108
        && bullet.drawY >= this.drawY + 11 - 5 && bullet.drawY <= this.drawY + 105
        && !bullet.hasHitTarget) {

            this.life = 0;

            if (!isMuted) {
                this.resources.hit.play();
            }

            if (this.life <= 0) {
                kills++;
                power++;
            }

            bullet.hasHitTarget = true;
        }
    }
};

Enemy.prototype.move = function(deltaTime){
    if(this.life == 6){
        this.speedX = ENEMY_SPEED_HIGH;
    }
    if(this.life == 4){
        this.speedX = ENEMY_SPEED_MEDIUM;
    }
    if(this.life == 2){
        this.speedX = ENEMY_SPEED_LOW;
    }
    this.drawX -= this.speedX/1000 * deltaTime;

    if (this.drawX > -10 && this.drawX < 0 && !this.isOutOfScreen) {
        power--;
        this.isOutOfScreen = true;
        if (!isMuted) {
            this.resources.klaver.play();
        }
    }
};

Enemy.prototype.draw = function(changeSprite) {
    if (changeSprite) {
        this.spriteX += 120;
        if (this.spriteX >= 840) {
            this.spriteX = 0;
        }
    }
    ctxBullet.drawImage(this.sprite, this.spriteX, 0, this.spriteWidth, this.spriteHeight, this.drawX, this.drawY, this.spriteWidth, this.spriteHeight);
    console.assert(!this.isOutOfScreen, "Enemy is out of screen, but has been drawn!");
    console.assert(this.life > 0, "Enemy is dead, but has been drawn!");
};