//GLOBALS
var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var array_random_speed = [0.2, 0.3, 0.4, 0.5, 0.55, 0.65, 0.6, 0.7, 0.8, 0.9];
var LVL = 1;

class Pos {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
        this.Z = 0;
    }
}

class Score {
    constructor(GameArea_ID, HTMLscore_ID, X, Y) {
        this.PlayerScore = 0;
        this.Pos = new Pos(X, Y);

        this.playground = document.getElementById(GameArea_ID);
        this.HTMLscore = document.createElement('div');
        this.playground.appendChild(this.HTMLscore);
        this.HTMLscore.id = HTMLscore_ID;
        this.HTMLscore.className = "flex"

    }

    UpdateScore(Points) {
        this.PlayerScore = this.PlayerScore + Points
    }
}

/* Weapon options */
var BulletSpeed = 5;
var DefaultBulletSpeed = 5;
var BulletCooldown = 30;
var BulledCooldownWanted = 30;
class Bullet {
    constructor(BulletsArr) {
        this.BulletsArr = BulletsArr;
        this.bullet = document.createElement('div');
        this.bullet.className = 'bullet';

        this.bullet.style.left = ThePlayer.Pos.X + 'px';
        this.bullet.style.top = (ThePlayer.Pos.Y + 7) + 'px';

        this.speed = BulletSpeed;

        this.top = ThePlayer.Pos.Y;
        this.playground = document.getElementById('gameArea');
        this.playground.appendChild(this.bullet);
    }

    move_bullet() {
        this.top = this.top - this.speed;
        this.bullet.style.top = this.top + 'px';
    }

}

GoodHeight = () => {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // calculate the scale factor to keep a correct aspect ratio
    if (h > w) {
        return (w * 0.75)
    } else {
        return (h * 0.75)
    }
}
class Player {
    constructor(speed) {
        this.Pos = new Pos(0, GoodHeight());
        this.speed = speed;
        this.lives = 3;

        this.HTMLplayer = document.createElement('div');
        this.HTMLplayer.id = "HTMLplayer";

        this.playground = document.getElementById('gameArea');
        this.playground.appendChild(this.HTMLplayer);

        this.MoveUp = false;
        this.MoveDown = false;
        this.MoveLeft = false;
        this.MoveRight = false;
        this.is_shooting = false;
    }

    Move() {
        if (this.MoveUp && this.HTMLplayer.offsetTop > 0) {
            this.Pos.Y -= this.speed;
            this.HTMLplayer.style.top = this.Pos.Y + 'px';
        }
        if (this.MoveDown && this.HTMLplayer.offsetTop < (this.HTMLplayer.offsetParent.offsetHeight - this.HTMLplayer.offsetHeight)) {
            this.Pos.Y += this.speed;
            this.HTMLplayer.style.top = this.Pos.Y + 'px';
        }
        if (this.MoveLeft && this.HTMLplayer.offsetLeft > 0) {
            this.Pos.X -= this.speed;
            this.HTMLplayer.style.left = this.Pos.X + 'px';
        }
        if (this.MoveRight && this.HTMLplayer.offsetLeft < (this.HTMLplayer.offsetParent.offsetWidth - this.HTMLplayer.offsetWidth)) {
            this.Pos.X += this.speed;
            this.HTMLplayer.style.left = this.Pos.X + 'px';
        }
    }

    Shoot() {
        if (this.is_shooting && BulletCooldown >= BulledCooldownWanted) {
            BulletsArr.push(new Bullet(BulletsArr));
            BulletCooldown = 0;
        }
    }
}

class Entity {

}

var ThePlayer = new Player(4);
var BulletsArr = [];

var ScoreObj = new Score('gameArea', 'score', 0, 0);

var OldH, OldW;
var Resize = setInterval(() => {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (OldH != h || OldW != w) {
        var GameArea = $("#gameArea");
        if (h > w) {
            GameArea.css("height", w + 'px');
            GameArea.css("width", w + 'px');
            ScoreObj.Pos.X = (w / 2 + (250 * (w / 1200)));
            ScoreObj.Pos.Y = (w * -1) + 50;
        } else {
            GameArea.css("height", h + 'px');
            GameArea.css("width", h + 'px');
            ScoreObj.Pos.X = (h / 2 + 250);
            ScoreObj.Pos.Y = (h * -1) + 50;
        }
        OldH = h;
        OldW = w;
    }
}, 33);

$(window).keydown(Key => {
    KeyCode = Key.keyCode;
    var KeyPress = (KeyCode == 32) ? "Space" : (KeyCode == 37 || KeyCode == 65) ? "ArrLeft" : (KeyCode == 39 || KeyCode == 68) ? "ArrRight" : (KeyCode == 38 || KeyCode == 87) ? "ArrUp" : (KeyCode == 83 || KeyCode == 40) ? "ArrDown" : "XXX";
    if (KeyPress == "XXX") {
        //console.log("Unknown key")
        //console.log(Key.keyCode);
        return;
    }
    //console.log("Key pressed: " + KeyPress)
    if (KeyPress == "Space") {
        //Shoot
        ThePlayer.is_shooting = true;
    }
    if (KeyPress == "ArrLeft") {
        //MoveLeft
        ThePlayer.MoveLeft = true;
    }
    if (KeyPress == "ArrRight") {
        //MoveRight
        ThePlayer.MoveRight = true;
    }
    if (KeyPress == "ArrUp") {
        //MoveUp
        ThePlayer.MoveUp = true;
    }
    if (KeyPress == "ArrDown") {
        //MoveDown
        ThePlayer.MoveDown = true;
    }
})

$(window).keyup(Key => {
    KeyCode = Key.keyCode;
    var KeyPress = (KeyCode == 32) ? "Space" : (KeyCode == 37 || KeyCode == 65) ? "ArrLeft" : (KeyCode == 39 || KeyCode == 68) ? "ArrRight" : (KeyCode == 38 || KeyCode == 87) ? "ArrUp" : (KeyCode == 83 || KeyCode == 40) ? "ArrDown" : "XXX";
    if (KeyPress == "XXX") {
        return;
    }
    //console.log("Keyreleased: " + KeyPress)
    if (KeyPress == "Space") {
        //Shoot
        ThePlayer.is_shooting = false;
    }
    if (KeyPress == "ArrLeft") {
        //MoveLeft
        ThePlayer.MoveLeft = false;
    }
    if (KeyPress == "ArrRight") {
        //MoveRight
        ThePlayer.MoveRight = false;
    }
    if (KeyPress == "ArrUp") {
        //MoveUp
        ThePlayer.MoveUp = false;
    }
    if (KeyPress == "ArrDown") {
        //MoveDown
        ThePlayer.MoveDown = false;
    }
})

ScoreBoard = () => {
    if (ScoreObj.PlayerScore > 999999999999) {
        ScoreObj.HTMLscore.style.width = "200px";
    }
    ScoreObj.HTMLscore.innerText = 'Score: ' + ScoreObj.PlayerScore;
    ScoreObj.HTMLscore.style.top = ScoreObj.Pos.Y + "px";
    ScoreObj.HTMLscore.style.left = ScoreObj.Pos.X + 'px';
}

moveObj = () => {
    ThePlayer.Move();

    BulletsArr.forEach((instanceBullet) => {
        instanceBullet.move_bullet();
    })
}

main = () => {
    moveObj()
    ThePlayer.Shoot();

    /* Bullet Cooldown */
    BulletCooldown++;
    ScoreBoard()
    requestAnimationFrame(main);
}

main();

init = () => {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // calculate the scale factor to keep a correct aspect ratio
    var GameArea = $("#gameArea");
    if (h > w) {
        GameArea.css("height", w + 'px');
        GameArea.css("width", w + 'px');
    } else {
        GameArea.css("height", h + 'px');
        GameArea.css("width", h + 'px');
    }
    OldH = h;
    OldW = w;
}

window.onload = () => {
    init();
}
