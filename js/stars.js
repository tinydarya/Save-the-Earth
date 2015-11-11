function Stars(sprite, speed) {
    this.sprite = sprite;
    this.drawX = 0;
    this.speedX = speed;
}

Stars.prototype.move = function(deltaTime){
    this.drawX += this.speedX/1000 * deltaTime;
};

Stars.prototype.draw = function() {
    if (this.drawX > -1000) {
        ctxBg.drawImage(this.sprite, this.drawX, 0);
    }
    if (this.drawX < 0) {
        ctxBg.drawImage(this.sprite, this.drawX+800, 0);
        if (this.drawX + 800 < 0) {
            ctxBg.drawImage(this.sprite, this.drawX+1600, 0);
            this.drawX = 0;
        }
    }
};