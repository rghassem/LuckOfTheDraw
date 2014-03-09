// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(constants.roomWidth * constants.cellSize, constants.roomHeight * constants.cellSize,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
    var mainRoom;
    var player;
    var gameObjects = [];

    function preload () {

        game.load.image('logo', 'phaser.png');

    }

    function create () {
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        mainRoom = RoomFactory.generateRandomRoom();

        player = new PlayerCharacter({sprite:'@', room: mainRoom});
        mainRoom.add(player, 0, 0);
        mainRoom.playerObjectId = player.getId();

		gameObjects = mainRoom.getGameObjects();
    }

    function updateObjects() {
        gameObjects.forEach(function(gameObject){
            gameObject.update();
        })
    }

    function drawObjects() {
        
    }

    function onKeyUp(event) {
        switch (event.keyCode) {
                case Phaser.Keyboard.LEFT:
                    player.queueMove(-1, 0)
                    break;
 
                case Phaser.Keyboard.RIGHT:
                    player.queueMove(1, 0)
                    break;
 
                case Phaser.Keyboard.UP:
                    player.queueMove(0, -1)
                    break;
                case Phaser.Keyboard.DOWN:
                    player.queueMove(0, 1)
                    break;
                case Phaser.Keyboard.SPACEBAR:
                    mainRoom.nextAction();
                    break;
        }
}

	//Prevent scrolling the screen
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
};