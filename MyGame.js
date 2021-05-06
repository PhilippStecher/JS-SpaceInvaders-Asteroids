var Bullets = [];
var Players;
var Entitys = [];

//GLOBALS
var IS_CHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var PlayerImg = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgICAgICAgICAgICAggCAgICAgoHBwYIAgoCAgIKAgICAgYFAgIFAgICBQoFBQcICQkJAgMLDAoIDAYICQgBAwQEAgICCQICCQgCAgIICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICP/AABEIAIAAgAMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AlUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==';
var PlayerStartPos = [0,0];

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
        this.Name = Name;
        this.skin = base64Skin;
        this.Pos = new Pos(X, Y);
    }
}

class Entity {

}

CreatePlayer = () => {
    Players = new Player(playerImg, PlayerStartPos[0], PlayerStartPos[1])
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
    resize();
}, 1000);

init = () => {
    resize();
    CreatePlayer();
}


window.onload = () => {
    init();
    console.table(new Pos(PlayerStartPos[0], PlayerStartPos[1]))
    //Animate();
}