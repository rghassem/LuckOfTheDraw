// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(constants.roomWidth * constants.cellSize, constants.roomHeight * constants.cellSize,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
    var mainRoom;
    var player;
	var enemy;

    function preload () {

        game.load.image('logo', 'phaser.png');

    }

    function create () {
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        mainRoom = new Room(constants.roomWidth, constants.roomHeight);
        player = new PlayerCharacter({sprite:'@'});
		enemy = new Enemy({sprite: 'e'});
        mainRoom.add(player, 0, 0);
		mainRoom.add(enemy, 5, 5);
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