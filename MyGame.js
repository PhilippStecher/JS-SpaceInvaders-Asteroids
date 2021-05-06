var Bullets = [];
var Players;
var Entitys = [];

//GLOBALS
var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var PlayerImg = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgICAgICAgICAgICAggCAgICAgoHBwYIAgoCAgIKAgICAgYFAgIFAgICBQoFBQcICQkJAgMLDAoIDAYICQgBAwQEAgICCQICCQgCAgIICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICP/AABEIAIAAgAMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==';
var PlayerStartPos = [0, 0];

class Pos {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }

    Left = (Pos) => {
        this.X = Pos.X - 3;
        this.Y = Pos.Y;
    }

    Right = (Pos) => {
        this.X = Pos.X + 3;
        this.Y = Pos.Y;
    }

    Up = (Pos) => {
        this.X = Pos.X;
        this.Y = Pos.Y + 3;
    }

    Down = (Pos) => {
        this.X = Pos.X;
        this.Y = Pos.Y - 3;
    }
}

class Bullet {

    constructor(PlayerPos) {

    }
}

class Player {
    constructor(base64Skin, X, Y) {
        this.skin = base64Skin;
        this.Pos = new Pos(X, Y);
    }
}

class Entity {

}

CreatePlayer = () => {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (h > w) {
        PlayerStartPos[0] = w / 2;
    } else {
        PlayerStartPos[0] = h / 2;
    }
    PlayerStartPos[1] = 10

    Players = new Player(PlayerImg, PlayerStartPos[0], PlayerStartPos[1])
    console.table(Players)
}

var Resize = setInterval(() => {
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
}, 1000);

init = () => {
    CreatePlayer();
}


$(window).keydown(Key => {
    KeyCode = Key.keyCode;
    var KeyPress = (KeyCode == 32) ? "Space" : (KeyCode == 37 || KeyCode == 65) ? "ArrLeft" : (KeyCode == 39|| KeyCode == 68) ? "ArrRight" :(KeyCode == 38|| KeyCode == 87) ? "ArrUp" :(KeyCode == 83|| KeyCode == 40) ? "ArrDown" : "XXX";
    if (KeyPress == "XXX") {
        console.log("Unknown key")
        console.log(Key.keyCode);
        return;
    }
    console.log(KeyPress)
    if (KeyPress == "Space") {
        //Shoot
    }
    if (KeyPress == "ArrLeft") {
        //MoveLeft
    }
    if (KeyPress == "ArrRight") {
        //MoveRight
    }
    if (KeyPress == "ArrUp") {
        //MoveUp
    }
    if (KeyPress == "ArrDown") {
        //MoveDown
    }
})

window.onload = () => {
    init();
    //Animate();
}