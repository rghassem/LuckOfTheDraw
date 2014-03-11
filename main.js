// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(1280, 744,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
    var mainRoom;
	var floor;
    var player;
    var gameObjects = [];
    var arrowSpriteGroup;
    var crossHairSpriteGroup;
    var mouseActionType = "move";
    var actionText;
    var phaseText;

    function preload () {

        game.load.image('floor', '/art/floor.jpg');
        game.load.image('arrow', '/art/arrow-sprite.png');
        game.load.image('crosshair', '/art/crosshair.png');
		game.load.image('wall', '/art/wall.png');
		game.load.image('enemy', '/art/enemy.png');
		game.load.image('player', '/art/player.png');

    }

    function create () {
		game.add.sprite(0, 0, 'floor');
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        game.input.onDown.add(handleMouse, this);

        arrowSpriteGroup = game.add.group();
        crosshairSpriteGroup = game.add.group();
        actionText = game.add.text(game.world.centerX - 95, 700, "Action Type: " + mouseActionType, constants.font);
        phaseText = game.add.text(game.world.centerX - 95, 720, "Phase: Planning", constants.font);

		floor = Floor({});
        mainRoom = floor.getCurrentRoom();

        player = new PlayerCharacter({sprite:'player', room: mainRoom});
        mainRoom.add(player, 0, 5);
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
        if(turn.isRunning()) return; //block all action during the turn
        function checkIsMoveValid(x, y){
            valid = true;
            gameObjects.forEach(function(gameObject){
                var pos = mainRoom.getPosition(gameObject)
                if(pos.row === x && pos.col === y){
                    valid = false;
                }
         })
            return valid;
        }
         var cellX = Math.floor(game.input.mousePointer.x / constants.cellSize);
         var cellY = Math.floor(game.input.mousePointer.y / constants.cellSize);
         if(cellX > constants.roomWidth-1 || cellY > constants.roomHeight-1){
            return false;
         }
         switch (mouseActionType){
            case "move" :
                 var currentPos = {row:0, col: 0};
                 if(arrowSpriteGroup.length > 0){
                      var lastArrow = arrowSpriteGroup.getAt(arrowSpriteGroup.length - 1)
                      currentPos.row = Math.floor(lastArrow.x / constants.cellSize);
                      currentPos.col = Math.floor(lastArrow.y / constants.cellSize);
                 }
                 else{
                     var currentPos = mainRoom.getPosition(player);
                 }
                 if(checkIsMoveValid(cellX,cellY)){
                 var newArrow = game.add.sprite(cellX*constants.cellSize,cellY*constants.cellSize, 'arrow');
                 arrowSpriteGroup.create(cellX*constants.cellSize,cellY*constants.cellSize, 'arrow'); 
                 if (cellX < currentPos.row)
                    player.queueMove(-1, 0);
                 if (cellX > currentPos.row)
                    player.queueMove(1, 0);
                 if (cellY < currentPos.col)
                    player.queueMove(0, -1);
                 if (cellY > currentPos.col)
                    player.queueMove(0, 1); 
                }
                break;
            case "shoot" :
                 var newCrossHair = game.add.sprite(cellX*constants.cellSize,cellY*constants.cellSize, 'crosshair');
                 crossHairSpriteGroup.create(cellX*constants.cellSize,cellY*constants.cellSize, 'crosshair');
                 if (cellX < currentPos.row)
                     player.queueShot(constants.Direction.Left)
                 if (cellX > currentPos.row)
                     player.queueShot(constants.Direction.Right)
                 if (cellY < currentPos.col)
                     player.queueShot(constants.Direction.Up)
                 if (cellY > currentPos.col)
                     player.queueShot(constants.Direction.Down)
    }
    }

    function setActionType(actionType){
       mouseActionType = actionType;
       actionText.destroy();
       actionText = game.add.text(game.world.centerX - 95, 400, "Action Type: " + mouseActionType, constants.font);
    }

    var turn = new EventSequence();
    var nextAction = function() { mainRoom.nextAction(); }
    turn.add(function() { phaseText.content = "Phase: Action" });
    turn.add(nextAction);
    for(var i = 0; i < constants.actionQueueDepth; ++i)
        turn.add(nextAction, constants.actionDuration);
    turn.add(function() { phaseText.content = "Phase: Planning" });

    
    function onKeyUp(event) {

         if(turn.isRunning()) return; //block all action during the turn

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

            //Mouse Commands
                case Phaser.Keyboard.M:
                    setActionType("move");
                    break;
                case Phaser.Keyboard.N:
                    setActionType("shoot");
                    break;  

            //Actions
                case Phaser.Keyboard.SPACEBAR:
                    turn.start();
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

			//Dungeon test
				case Phaser.Keyboard.H:
					break;
				case Phaser.Keyboard.J:
					break;
				case Phaser.Keyboard.K:
					break;
				case Phaser.Keyboard.L:
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