"use strict";
var Ball = (function () {
    function Ball(gameInstance) {
        this._xspeed = 2;
        this._yspeed = 2;
        this.maxSpeed = 20;
        this.gameInstance = gameInstance;
        this.div = document.createElement("ball");
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        this.x = Math.random() * (window.innerWidth - this.div.clientWidth);
        this.y = Math.random() * (window.innerHeight - this.div.clientHeight);
    }
    Object.defineProperty(Ball.prototype, "xspeed", {
        get: function () { return this._xspeed; },
        set: function (xspeed) { this._xspeed = xspeed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "yspeed", {
        get: function () { return this._yspeed; },
        set: function (yspeed) { this._yspeed = yspeed; },
        enumerable: true,
        configurable: true
    });
    Ball.prototype.getRectangle = function () {
        return this.div.getBoundingClientRect();
    };
    Ball.prototype.update = function () {
        var _a;
        this.x += this.xspeed;
        this.y += this.yspeed;
        var rightWall = window.innerWidth - this.div.clientWidth;
        var bottomWall = window.innerHeight - this.div.clientHeight;
        if (this.x > rightWall) {
            this.xspeed *= -1;
            this.gameInstance.score++;
            document.getElementsByTagName("score")[0].innerHTML = "Score: " + this.gameInstance.score;
        }
        if (this.y > bottomWall || this.y < 0) {
            this.yspeed *= -1;
        }
        if (this.xspeed > this.maxSpeed) {
            this.xspeed = this.maxSpeed;
        }
        if (this.x < 0) {
            console.log("removing ball from array");
            var index = this.gameInstance.balls.indexOf(this);
            this.gameInstance.balls.splice(index, 1);
            this.gameInstance.score--;
            document.getElementsByTagName("score")[0].innerHTML = "Score: " + this.gameInstance.score;
            (_a = this.div.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.div);
        }
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Ball;
}());
var Game = (function () {
    function Game() {
        this.balls = [];
        this.powerups = [];
        this.ballAmountStart = 10;
        this._statePowerup = 0;
        this._score = 0;
        for (var i = 0; i < this.ballAmountStart; i++) {
            this.balls.push(new Ball(this));
        }
        this.paddle = new Paddle();
        this.gameLoop();
    }
    Object.defineProperty(Game.prototype, "score", {
        get: function () { return this._score; },
        set: function (score) { this._score = score; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "statePowerup", {
        get: function () { return this._statePowerup; },
        set: function (statePowerup) { this._statePowerup = statePowerup; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        if (this.ballAmountStart > this.balls.length) {
            for (var i = 0; i < this.ballAmountStart - this.balls.length; i++) {
                this.balls.push(new Ball(this));
            }
        }
        this.paddle.update();
        for (var _i = 0, _a = this.balls; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
        }
        for (var i = 0; i < this.balls.length; i++) {
            var hit = this.checkCollision(this.balls[i].getRectangle(), this.paddle.getRectangle());
            if (hit) {
                this.balls[i].xspeed *= -2;
            }
        }
        if (this.score > 5) {
            switch (this.statePowerup) {
                case 0:
                    setTimeout(function () { return _this.powerups.push(new Powerup(_this)); }, Math.random() * 10000);
                    this.statePowerup = 1;
                    console.log("pushpowerup");
                    break;
                case 1:
                    if (this.score > 20) {
                        setTimeout(function () { return _this.powerups.push(new Powerup(_this)); }, Math.random() * 10000);
                        this.statePowerup = 2;
                        console.log("powerup 2");
                        break;
                    }
            }
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Paddle = (function () {
    function Paddle() {
        var _this = this;
        this.downSpeed = 0;
        this.upSpeed = 0;
        this.div = document.createElement("paddle");
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        this.upkey = 87;
        this.downkey = 83;
        this.x = 0;
        this.y = 200;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    }
    Paddle.prototype.getRectangle = function () {
        return this.div.getBoundingClientRect();
    };
    Paddle.prototype.onKeyDown = function (e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 5;
                break;
            case this.downkey:
                this.downSpeed = 5;
                break;
        }
    };
    Paddle.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 0;
                break;
            case this.downkey:
                this.downSpeed = 0;
                break;
        }
    };
    Paddle.prototype.update = function () {
        var newY = this.y - this.upSpeed + this.downSpeed;
        if (newY > 0 && newY + 100 < window.innerHeight)
            this.y = newY;
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Paddle;
}());
var Powerup = (function () {
    function Powerup(gameInstance) {
        var _this = this;
        this.gameInstance = gameInstance;
        this.type = this.gameInstance.statePowerup;
        this.div = document.createElement("powerup");
        var game = document.getElementsByTagName("game")[0];
        this.div.addEventListener("click", function () { return _this.activatePowerup(); });
        game.appendChild(this.div);
        this.x = Math.random() * (window.innerWidth - this.div.clientWidth);
        this.y = Math.random() * (window.innerHeight - this.div.clientHeight);
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
        if (this.gameInstance.statePowerup == 1) {
            this.div.innerHTML = "+ 10 BALLS";
        }
        if (this.gameInstance.statePowerup == 2) {
            this.div.innerHTML = "+ 20 BALLS";
            this.div.style.backgroundColor = "rgb(148, 28, 128)";
        }
    }
    Powerup.prototype.activatePowerup = function () {
        var _a, _b;
        var game = document.getElementsByTagName("game")[0];
        switch (this.type) {
            case 1:
                var p1 = document.createElement("p");
                p1.innerHTML = "Balls multiplied";
                game.appendChild(p1);
                this.gameInstance.score += 5;
                this.gameInstance.ballAmountStart += 10;
                (_a = this.div.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.div);
            case 2:
                console.log("powerup 2 succesful");
                var p2 = document.createElement("p");
                p2.innerHTML = "Balls multiplied x2";
                game.appendChild(p2);
                this.gameInstance.score += 5;
                this.gameInstance.ballAmountStart += 20;
                (_b = this.div.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.div);
        }
    };
    return Powerup;
}());
//# sourceMappingURL=main.js.map