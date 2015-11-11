function Bullet(startX, startY, direction, sprite) {
    this.drawX = startX;
    this.drawY = startY;
    this.sprite = sprite;
    this.speedX = LASER_BULLET_SPEED;
    this.gravity = 0.01;
    this.speedX *= direction;
    this.hasHitTarget = false;
    this.isOutOfScreen = false;
}

Bullet.prototype.move = function(deltaTime){
    console.assert(!this.isOutOfScreen, "Bullet is out of screen, but has been moved!");
    this.drawX += this.speedX/1000 * deltaTime;
    this.drawY += this.gravity / 1000 * deltaTime;
    if (this.drawX < 0 || this.drawX > 800) {
        this.isOutOfScreen = true;
    }
};

Bullet.prototype.draw = function() {
    console.assert(!this.hasHitTarget, "Bullet has already hit target, but has been drawn!");
    ctxBullet.drawImage(this.sprite, this.drawX, this.drawY);
};