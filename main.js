// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(constants.roomWidth * constants.cellSize, constants.roomHeight * constants.cellSize,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
    var mainRoom;
    var player;
    var gameObjects = [];

    function preload () {

        game.load.image('floor', '.../art/floor-tile.png');

    }

    function create () {
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        game.input.onDown.add(handleMouse, this);



        for(var i = 0; i < constants.roomWidth; ++i)
        {
            for(var j = 0; j < constants.roomHeight; ++j)
            {
                game.add.sprite(i*constants.cellSize,j*constants.cellSize, 'floor');
            }
        }

        mainRoom = RoomFactory.generateRoom('main');

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

    function handleMouse(){
         var cellX = Math.floor(game.input.mousePointer.x / constants.cellSize);
         var cellY = Math.floor(game.input.mousePointer.y / constants.cellSize);
         var currentPos = mainRoom.getPosition(player); 
         if (cellX < currentPos.row)
            player.queueMove(-1, 0);
         if (cellX > currentPos.row)
            player.queueMove(1, 0);
         if (cellY < currentPos.col)
            player.queueMove(0, -1);
         if (cellY > currentPos.col)
            player.queueMove(0, 1); 
    }

    function onKeyUp(event) {
        switch (event.keyCode) {
            //Movement
                case Phaser.Keyboard.LEFT:
                    player.queueMove(-1, 0);
                    break;
                 case Phaser.Keyboard.RIGHT:
                    player.queueMove(1, 0);
                    break;
                 case Phaser.Keyboard.UP:
                    player.queueMove(0, -1);
                    break;
                case Phaser.Keyboard.DOWN:
                    player.queueMove(0, 1)
                    break;
            //Actions
                case Phaser.Keyboard.SPACEBAR:
                    mainRoom.nextAction();
                    break;
                case Phaser.Keyboard.B:
                    player.cancelAction();
                    break;
                case Phaser.Keyboard.C:
                    player.clearQueue();

            //Shooting
                case Phaser.Keyboard.A:
                    player.queueShot(constants.Direction.Left)
                    break;
                 case Phaser.Keyboard.D:
                    player.queueShot(constants.Direction.Right)
                    break;
                 case Phaser.Keyboard.W:
                    player.queueShot(constants.Direction.Up)
                    break;
                case Phaser.Keyboard.S:
                    player.queueShot(constants.Direction.Down)
                    break;
        }

        //Turn logic not working
        var turnInProgress = false;
        function turn(actionsPerTurn) {
            turnInProgress = true;

            //Create a timer that will execute each nextAction command, with an appropriate delay for gameObjects to catch up.
            var timer = new Phaser.Timer(game, false);
            function finalEvent() {
                turnInProgress = false;
                timer.destroy();
            }
            var action = mainRoom.nextAction;
            var delay = constants.actionDuration * 1000;
            for(var i = 0; i < constants.actionQueueDepth; ++i)
            {
                timer.add(i * delay, action);
            }
            timer.add(delay * constants.actionQueueDepth, finalEvent);
            timer.start();
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