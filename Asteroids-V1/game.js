//#region Globals
var IsStartet = false;
var LVL = 10;
var RocksPerLVL = [0, 1, 5, 7, 10, 13, 17, 22, 25, 30, 100, 200, 300, 400, 500, 700, 1000];

var RockLeftOrRight = ["L", "R"];
var RockUpOrDown = ["D", "U"];
var RockType = ["small", "medium", "large"];
//#endregion

//#region Soundeffects
const SoundsArr = {
    "shoot": "audio/asteroids-ship-shoot.wav",
    "HaveDestroyed": "audio/asteroids-destroy.wav",
    "GotDestroyed": "audio/asteroids-ship-explode.wav",
    "GameOver": "audio/asteroids-ship-dies.mp3"
}

class HTMLSound {
    constructor(Soundname, volume) {
        this.vol = volume;
        this.SoundName = Soundname;
        this.path = SoundsArr[Soundname];

        this.HTMLsoundArea = document.createElement("audio")
        this.HTMLsoundArea.src = this.path
        this.HTMLsoundArea.id = this.SoundName
        document.body.appendChild(this.HTMLsoundArea)
    }

    PlaySound() {
        this.HTMLsoundArea.volume = this.vol;
        this.HTMLsoundArea.play();
    }
}

var ShootSound = new HTMLSound("shoot", 0.3);
var HaveDestroyedSound = new HTMLSound("HaveDestroyed", 0.3);
var GotDestroyedSound = new HTMLSound("GotDestroyed", 0.3);
var GameOverSound = new HTMLSound("GameOver", 0.3);
//#endregion

//#region Important Functions
var OldH, OldW;
var Resize = setInterval(() => {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (OldH != h || OldW != w) {
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
}, 33);

Arraycutout = (array, WholeRockObj) => {
    var returnarray = [];
    for (var x = 0; x < array.length; x++) {
        if (array[x] != WholeRockObj) {
            returnarray.push(array[x])
        }
    }
    return returnarray;
};

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-*/';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

GoodHeight = () => {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (h > w) {
        return (w * 0.75)
    } else {
        return (h * 0.75)
    }
}
//#endregion

//#region Classconstructions
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
        this.playground = document.getElementById(GameArea_ID);
        this.HTMLscore = document.createElement('div');
        this.playground.appendChild(this.HTMLscore);
        this.HTMLscore.id = HTMLscore_ID;
        this.HTMLscore.className = "flex"
    }
    AddPoints(Points) {
        this.PlayerScore = this.PlayerScore + Points
    }
}

var BulletSpeed = 5;
var DefaultBulletSpeed = 5;
var BulletCooldown = 30;
var BulledCooldownWanted = 30;
class Bullet {
    constructor() {
        this.Pos = new Pos(ThePlayer.Pos.X, ThePlayer.Pos.Y + 7)
        this.bullet = document.createElement('div');
        this.bullet.className = 'bullet';

        this.bullet.style.left = ThePlayer.Pos.X + 'px';
        this.bullet.style.top = (ThePlayer.Pos.Y + 7) + 'px';

        this.speed = BulletSpeed;

        this.playground = document.getElementById('gameArea');
        this.playground.appendChild(this.bullet);
    }

    Destroy() {
        this.bullet.remove();
        BulletsArr = Arraycutout(BulletsArr, this)
        return;
    }

    isOutOfFocus() {
        if (this.bullet.offsetTop < 0) {
            this.Destroy()
            return;
        }
        if (this.bullet.offsetTop > (this.bullet.offsetParent.offsetHeight - this.bullet.offsetHeight)) {
            this.Destroy()
            return;
        }
        if (this.bullet.offsetLeft < 0) {
            this.Destroy()
            return;
        }
        if (this.bullet.offsetLeft > (this.bullet.offsetParent.offsetWidth - this.bullet.offsetWidth)) {
            this.Destroy()
            return;
        }
    }

    Move() {
        this.Pos.Y = this.Pos.Y - this.speed;
        this.bullet.style.top = this.Pos.Y + 'px';
        return;
    }

}

class Player {
    constructor(speed, lifes) {
        this.Pos = new Pos(0, GoodHeight());
        this.speed = speed;
        this.lives = lifes;

        this.HTMLplayer = document.createElement('div');
        this.HTMLplayer.id = "HTMLplayer";

        this.playground = document.getElementById('gameArea');
        this.playground.appendChild(this.HTMLplayer);

        this.SpawnProtection = true;

        this.MoveUp = false;
        this.MoveDown = false;
        this.MoveLeft = false;
        this.MoveRight = false;
        this.is_shooting = false;
    }

    Move() {
        if (this.MoveUp && this.HTMLplayer.offsetTop > 0) {
            this.SpawnProtection = false;
            this.Pos.Y -= this.speed;
            this.HTMLplayer.style.top = this.Pos.Y + 'px';
        }
        if (this.MoveDown && this.HTMLplayer.offsetTop < (this.HTMLplayer.offsetParent.offsetHeight - this.HTMLplayer.offsetHeight)) {
            this.SpawnProtection = false;
            this.Pos.Y += this.speed;
            this.HTMLplayer.style.top = this.Pos.Y + 'px';
        }
        if (this.MoveLeft && this.HTMLplayer.offsetLeft > 0) {
            this.SpawnProtection = false;
            this.Pos.X -= this.speed;
            this.HTMLplayer.style.left = this.Pos.X + 'px';
        }
        if (this.MoveRight && this.HTMLplayer.offsetLeft < (this.HTMLplayer.offsetParent.offsetWidth - this.HTMLplayer.offsetWidth)) {
            this.SpawnProtection = false;
            this.Pos.X += this.speed;
            this.HTMLplayer.style.left = this.Pos.X + 'px';
        }
    }

    Shoot() {
        if (this.is_shooting && BulletCooldown >= BulledCooldownWanted) {
            ShootSound.PlaySound();
            this.SpawnProtection = false;
            BulletsArr.push(new Bullet());
            BulletCooldown = 0;
        }
    }

    ResetPos() {
        this.Pos = new Pos(0, GoodHeight());
        this.HTMLplayer.style.top = this.Pos.Y + 'px';
        this.HTMLplayer.style.left = this.Pos.X + 'px';
        this.SpawnProtection = true;
    }

    NewPosOnResize() {

    }

    Death() {
        if (this.SpawnProtection)
            return;

        this.lives -= 1;

        this.ResetPos();
        if (this.lives == 0) {
            GameOverSound.PlaySound();
            window.alert("All lives lost!");
            window.location.reload();
            return;
        }
        GotDestroyedSound.PlaySound();
    }

    Collision() {
        if (this.SpawnProtection)
            return;

        if (RocksArr.length > 0) {
            RocksArr.forEach(OneRock => {
                if (OneRock == undefined)
                    return;

                if (OneRock.HTMLRock.offsetTop > this.HTMLplayer.offsetTop) {
                    var DiffY = Math.abs(OneRock.HTMLRock.offsetTop - (this.HTMLplayer.offsetTop + 20));
                } else {
                    var DiffY = Math.abs(this.HTMLplayer.offsetTop - OneRock.HTMLRock.offsetTop);
                }

                if (OneRock.HTMLRock.offsetLeft > this.HTMLplayer.offsetLeft) {
                    var DiffX = Math.abs(OneRock.HTMLRock.offsetLeft - (this.HTMLplayer.offsetLeft + 25));
                } else {
                    var DiffX = Math.abs(this.HTMLplayer.offsetLeft - OneRock.HTMLRock.offsetLeft);
                }

                if (DiffX <= 20 && DiffY <= 20) {//perfect value: 24
                    OneRock.HTMLRock.style.backgroundColor = "red";
                    this.Death();
                    return;
                }
                return;
            })
        } else {
            return;
        }
        return;
    }
}

var RandomRockSpeed = [0.7, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.5];
class Rocks {
    constructor(GameArea_ID, RocksArr, RandomRockSpeed, size = 1337) {
        var RandomSpeedIndexX = Math.floor(randomNumber(0, RandomRockSpeed.length))
        var RandomSpeedIndexY = Math.floor(randomNumber(7, RandomRockSpeed.length));

        this.speedX = RandomRockSpeed[RandomSpeedIndexX];
        this.speedY = RandomRockSpeed[RandomSpeedIndexY];
        this.MoveLR = RockLeftOrRight[Math.round(Math.random() * 1)]
        this.MoveUD = RockUpOrDown[0]//Only Down for V1

        this.playground = document.getElementById(GameArea_ID)

        this.HTMLRock = document.createElement('div');
        var TheRockID = randomString(100);
        this.RockID = TheRockID;
        this.HTMLRock.id = TheRockID;
        this.HTMLRock.className = "item";
        this.playground.appendChild(this.HTMLRock);

        this.Pos = new Pos(0, 0);

        if (size == 1337) {
            this.size = RockType[randomNumber(0, RockType.length)];//generate new random rock
        } else {
            this.size = size;
        }
    }

    Spawn() {
        /* CoordsX Random */
        var PosXHolder = (this.playground.offsetWidth / 2) - 15;
        var XPrositivOrNegativ = (Math.round(Math.random() * 1) == 0) ? -1 : 1;
        var XCoord = randomNumber(0, PosXHolder);

        /* CoordsY Random */
        var PosYHolder = (this.playground.offsetHeight * -1);
        this.Pos = new Pos((XCoord * XPrositivOrNegativ), PosYHolder - randomNumber(30, 120))

    }

    Move() {
        if (this.MoveUD == "U") {
            this.Pos.Y = this.Pos.Y - this.speedY;
            this.HTMLRock.style.top = this.Pos.Y + 'px';
        } else if (this.MoveUD == "D") {
            this.Pos.Y = this.Pos.Y + this.speedY;
            this.HTMLRock.style.top = this.Pos.Y + 'px';
        }

        if (this.MoveLR == "L") {
            this.Pos.X = this.Pos.X - this.speedX;
            this.HTMLRock.style.left = this.Pos.X + 'px';
        } else if (this.MoveLR == "R") {
            this.Pos.X = this.Pos.X + this.speedX;
            this.HTMLRock.style.left = this.Pos.X + 'px';
        }
    }

    Destroy(TheBullet) {
        this.HTMLRock.remove();
        RocksArr = Arraycutout(RocksArr, this);
        if (TheBullet != undefined) {
            console.log("Rock hit")
            TheBullet.bullet.remove();
            BulletsArr = Arraycutout(BulletsArr, TheBullet)
            ScoreObj.AddPoints(5);
            return;
        }
        console.log("Rock out of focus")
        return;
    }

    isOutOfFocus() {
        if (this.HTMLRock.offsetTop > (this.HTMLRock.offsetParent.offsetHeight - this.HTMLRock.offsetHeight)) {
            this.Destroy()
            return;
        }
        if (this.HTMLRock.offsetLeft < 0) {
            this.MoveLR = (this.MoveLR == RockLeftOrRight[0]) ? RockLeftOrRight[1] : (this.MoveLR == RockLeftOrRight[1]) ? RockLeftOrRight[0] : this.Destroy();
            this.Move()
            return;
        }
        if (this.HTMLRock.offsetLeft > (this.HTMLRock.offsetParent.offsetWidth - this.HTMLRock.offsetWidth)) {
            this.MoveLR = (this.MoveLR == RockLeftOrRight[0]) ? RockLeftOrRight[1] : (this.MoveLR == RockLeftOrRight[1]) ? RockLeftOrRight[0] : this.Destroy();
            this.Move()
            return;
        }
    }

    isHit() {
        if (BulletsArr.length > 0) {
            BulletsArr.forEach(OneBullet => {
                if (OneBullet == undefined)
                    return;

                if (OneBullet.bullet.offsetTop > this.HTMLRock.offsetTop) {
                    var DiffY = Math.abs(OneBullet.bullet.offsetTop - this.HTMLRock.offsetTop);
                } else {
                    var DiffY = Math.abs(this.HTMLRock.offsetTop - OneBullet.bullet.offsetTop);
                }

                if (OneBullet.bullet.offsetLeft > this.HTMLRock.offsetLeft) {
                    var DiffX = Math.abs(OneBullet.bullet.offsetLeft - (this.HTMLRock.offsetLeft + 10));
                } else {
                    var DiffX = Math.abs(this.HTMLRock.offsetLeft - (OneBullet.bullet.offsetLeft - 10));
                }

                if (DiffX <= 15 && DiffY <= 15) {
                    this.HTMLRock.style.backgroundColor = "red";
                    HaveDestroyedSound.PlaySound();
                    this.Destroy(OneBullet);
                    return;
                } return;
            })
        }
        return;
    }
}
//#endregion

var ThePlayer = new Player(5, 3);
var ScoreObj = new Score('gameArea', 'score', 0, 0);
var BulletsArr = [];
var RocksArr = [];

//#region Keypress
$(window).keydown(Key => {
    KeyCode = Key.keyCode;
    var KeyPress = (KeyCode == 32) ? "Space" : (KeyCode == 37 || KeyCode == 65) ? "ArrLeft" : (KeyCode == 39 || KeyCode == 68) ? "ArrRight" : (KeyCode == 38 || KeyCode == 87) ? "ArrUp" : (KeyCode == 83 || KeyCode == 40) ? "ArrDown" : (KeyCode == 13) ? "Enter" : "XXX";
    if (KeyPress == "XXX") {
        //console.log("Unknown key")
        //console.log(Key.keyCode);
        return;
    }
    //console.log("Key pressed: " + KeyPress)
    if (KeyPress == "Enter") {
        IsStartet = true;
        document.getElementById('startTheGame').remove()
    }
    if (KeyPress == "Space") {
        //Shoot
        ThePlayer.is_shooting = true;
    }
    if (KeyPress == "ArrLeft") {
        //MoveLeft
        ThePlayer.MoveLeft = true;

        var Pobj = ThePlayer.HTMLplayer
        var degree = -45
        Pobj.style.webkitTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.MozTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.msTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.OTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.transform = 'rotate(' + degree + 'deg)';
    }
    if (KeyPress == "ArrRight") {
        //MoveRight
        ThePlayer.MoveRight = true;

        var Pobj = ThePlayer.HTMLplayer
        var degree = 45
        Pobj.style.webkitTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.MozTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.msTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.OTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.transform = 'rotate(' + degree + 'deg)';
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
    if (KeyPress == "XXX")
        return;

    if (KeyPress == "Space") {
        //Shoot
        ThePlayer.is_shooting = false;
    }
    if (KeyPress == "ArrLeft") {
        //MoveLeft
        ThePlayer.MoveLeft = false;

        var Pobj = ThePlayer.HTMLplayer
        var degree = 0
        Pobj.style.webkitTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.MozTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.msTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.OTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.transform = 'rotate(' + degree + 'deg)';
    }
    if (KeyPress == "ArrRight") {
        //MoveRight
        ThePlayer.MoveRight = false;

        var Pobj = ThePlayer.HTMLplayer
        var degree = 0
        Pobj.style.webkitTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.MozTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.msTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.OTransform = 'rotate(' + degree + 'deg)';
        Pobj.style.transform = 'rotate(' + degree + 'deg)';
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
//#endregion

//#region ClassOptions
moveObj = () => {
    BulletsArr.forEach((instanceBullet) => {
        instanceBullet.Move();
    })
    RocksArr.forEach(instanceRock => {
        instanceRock.Move();
    })
}

OutOfFocusCheck = () => {
    BulletsArr.forEach((instanceBullet) => {
        instanceBullet.isOutOfFocus();
    })
    RocksArr.forEach(instanceRock => {
        instanceRock.isOutOfFocus();
    })
    RocksArr.forEach(instanceRock => {
        instanceRock.isHit();
    })
}

setInterval(() => {
    for (var instanceRock of RocksArr) {
        instanceRock.isHit();
    }
}, 1)
//#endregion

//#region Drawing
var HolderLifes = document.getElementById('lives');
var HolderSpawnP = document.getElementById('SpawnProtection')
var HolderLevel = document.getElementById('level')
SetSPboolToScreen = () => {
    HolderSpawnP.innerText = "Spawnprotection: " + ThePlayer.SpawnProtection
}
var OldLifes;
SetLifesToScreen = () => {
    HolderLifes.innerText = "Lifes: " + ThePlayer.lives;
    OldLifes = ThePlayer.lives;
}
var LevelBefore;
SetLevelToScreen = () => {
    if (LevelBefore != LVL) {
        HolderLevel.innerText = "Level: " + LVL
        LevelBefore = LVL
    }
}

var OldPlayerscore;
ScoreBoard = () => {
    if (OldPlayerscore == ScoreObj.PlayerScore)
        return;

    if (ScoreObj.PlayerScore > 999999999999) {
        ScoreObj.HTMLscore.style.width = "200px";
    }
    ScoreObj.HTMLscore.innerText = 'Score: ' + ScoreObj.PlayerScore;
    OldPlayerscore = ScoreObj.PlayerScore;
}
//#endregion

//#region Main
main = () => {
    ScoreBoard();
    SetSPboolToScreen();
    SetLevelToScreen();
    if (ThePlayer.lives != OldLifes)
        SetLifesToScreen();

    ThePlayer.Move();
    OutOfFocusCheck();

    if (!IsStartet) {
        requestAnimationFrame(main);
        return;
    }
        

    ThePlayer.Shoot();
    ThePlayer.Collision();

    /* Bullet Cooldown */
    BulletCooldown++;

    
    moveObj();

    if (RocksArr.length == 0) {
        LVL++;
        for (var x = 0; x < RocksPerLVL[LVL]; x++) {
            var newRock = new Rocks('gameArea', RocksArr, RandomRockSpeed, 1337);
            newRock.Spawn();
            RocksArr.push(newRock);
        }
    }
    requestAnimationFrame(main);
}

main();
//#endregion

//#region INIT
init = () => {
    SetSPboolToScreen();
    SetLifesToScreen();
    var w = window.innerWidth;
    var h = window.innerHeight;

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
//#endregion