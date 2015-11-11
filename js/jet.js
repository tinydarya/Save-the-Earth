function Jet(resources) {
    this.resources = resources;
    this.drawX = 100;
    this.drawY = 200;
    this.speedX = JET_SPEED_X;
    this.speedY = JET_SPEED_Y;
    this.horizontalAcceleration = 0;
    this.verticalAcceleration = 0;
    this.isShooting = false;
    this.lastBulletShotAt = 0;
    this.shootLimit = 1000;
    this.spriteWidth = 141;
    this.spriteHeight = 60;
    this.spriteX = 0;
    this.isReversed = false;
}

Jet.prototype.move = function(deltaTime){
    this.drawX += this.speedX*this.horizontalAcceleration/1000 * deltaTime;
    this.drawY += this.speedY*this.verticalAcceleration/1000 * deltaTime;
};

Jet.prototype.draw = function(changeSprite) {
    clearCtxJetEnemyBullet();

    if (changeSprite) {
        this.spriteX += this.spriteWidth;
        if (this.spriteX >= 564) {
            this.spriteX = 0;
        }
    }

    ctxBg.drawImage(this.resources.sprite, this.spriteX, this.isReversed ? this.spriteHeight : 0, this.spriteWidth, this.spriteHeight, this.drawX, this.drawY, this.spriteWidth, this.spriteHeight);
};

Jet.prototype.maybeFireBullet = function() {
    if (this.isShooting) {
        var currentMillis = Date.now();
        if (currentMillis - this.lastBulletShotAt >= this.shootLimit) {
            this.lastBulletShotAt = Date.now();
            var bullet;
            if (this.isReversed) {
                bullet = new Bullet(this.drawX, this.drawY+this.spriteHeight/2, -1, this.resources.bullet)
            } else {
                bullet = new Bullet(this.drawX+this.spriteWidth, this.drawY+this.spriteHeight/2, 1, this.resources.bullet)
            }
            if (!isMuted) {
                this.resources.shoot.play();
            }
            return bullet;
        }
    }
};