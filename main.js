// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(constants.roomWidth * constants.cellSize, constants.roomHeight * constants.cellSize,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
    var mainRoom;
    var player;
    //Prventing default browser keyboard actions
    var keys = {};
    window.addEventListener("keydown",
            function(e){
                keys[e.keyCode] = true;
                switch(e.keyCode){
                    case 37: case 39: case 38:  case 40: // Arrow keys
                    case 32: e.preventDefault(); break; // Space
                    default: break; // do not block other keys
                }
            },
        false);
        window.addEventListener('keyup',
            function(e){
                keys[e.keyCode] = false;
            },
        false);

    function preload () {

        game.load.image('logo', 'phaser.png');

    }

    function create () {
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        mainRoom = new Room({width:constants.roomWidth, height:constants.roomHeight});
        player = new PlayerCharacter({sprite:'@'});
        mainRoom.add(player, 0, 0);
		for(var i = 0; i < util.getRandomInt(5, constants.roomHeight); ++i) {
			mainRoom.add(Enemy({sprite:'e'}),
				util.getRandomInt(1,constants.roomWidth-1), util.getRandomInt(1,constants.roomHeight-1));
		}
    }

    function updateObjects() {
        mainRoom.update();
    }

    function drawObjects() {

        mainRoom.draw();
    }

    function onKeyUp(event) {
        switch (event.keyCode) {
                case Phaser.Keyboard.LEFT:
                    player.move(-1, 0)
                    break;
 
                case Phaser.Keyboard.RIGHT:
                    player.move(1, 0)
                    break
 
                case Phaser.Keyboard.UP:
                    player.move(0, -1)
                    break
                case Phaser.Keyboard.DOWN:
                    player.move(0, 1)
                    break
        }
        mainRoom.nextAction();
}

};