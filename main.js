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
    var movementText;
    var mouseActionType = "move";
    var actionText;
    var phaseText;
	var map;

    function preload () {

        game.load.image('floor', './art/floor.jpg');
        game.load.image('arrow', './art/arrow-sprite.png');
        game.load.image('crosshair', './art/crosshair.png');
		game.load.image('wall', './art/wall.png');
		game.load.image('enemy', './art/enemy.png');
		game.load.image('player', './art/player.png');
        game.load.image('bullet', './art/bullet.png');

        game.load.audio("gunfire", "./sound/Shoot.wav", true);
        game.load.audio("characterHit", "./sound/Hit_Hurt.wav", true);
        game.load.audio("wallHit", "./sound/Hit_Wall.wav", true);

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

        movementText = game.add.text(game.world.centerX + 25, 720, "", constants.font);

		floor = Floor();
        mainRoom = floor.getCurrentRoom();
        player = new PlayerCharacter({sprite:'player', room: mainRoom});
        mainRoom.add(player, 1, 5);
        mainRoom.playerObjectId = player.getId();
		mainRoom.initialize();

		gameObjects = mainRoom.getGameObjects();

		map = game.add.text(882, 100, floor.getMap(), constants.mapfont);
    }

    function updateObjects() {
        floor.getCurrentRoom().getGameObjects().forEach(function(gameObject){
            gameObject.update();
        })
		map.setText(floor.getMap());
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
        function checkIsOneFromArrow(x,y){
            valid = false;
            if(arrowSpriteGroup.length < 1){
                valid = true;
            }
            arrowSpriteGroup.forEach(function(arrow){
               var checkX =  Math.floor(arrow.x / constants.cellSize) - x;
               var checkY =  Math.floor(arrow.y / constants.cellSize) - y;
               if(checkX === 1 || checkX === -1 || checkX === 0){
                if(checkY === 1 || checkY ===-1 || checkY === 0){
                    valid = true;
                }}
               })
            return valid;
        }
        function checkIsOneFromPlayer(x,y){
            var valid = false;
            var playerPos = mainRoom.getPosition(player);
            var checkX =  playerPos.row - x;
               var checkY =  playerPos.col - y;
               if(checkX === 1 || checkX === -1 || checkX === 0){
                if(checkY === 1 || checkY ===-1 || checkY === 0){
                    valid = true;
                }}
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
                 if(checkIsMoveValid(cellX,cellY) && (checkIsOneFromPlayer(cellX,cellY) || checkIsOneFromArrow(cellX,cellY))){
                 arrowSpriteGroup.create(cellX*constants.cellSize,cellY*constants.cellSize, 'arrow'); 
                 if (cellX < currentPos.row){
                    player.queueMove(-1, 0);
                    movementText.setText(movementText.text + "Left,");
                }
                 if (cellX > currentPos.row){
                    player.queueMove(1, 0);
                     movementText.setText(movementText.text + "Right,");
                }
                 if (cellY < currentPos.col){
                    player.queueMove(0, -1);
                    movementText.setText(movementText.text+ "Up,");
                }
                 if (cellY > currentPos.col){
                    player.queueMove(0, 1); 
                    movementText.setText(movementText.text+"Down,");

                }
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

//Turn is a sequence of events over time
var turn = new EventSequence();
turn.usedInterrupt = false;

var nextAction = function() { mainRoom.nextAction(); }
var startActionPhase = function() { 
    phaseText.content = "Phase: Action"; 
    turn.usedInterrupt = false;
}
var endActionPhase = function() {
    phaseText.content = "Phase: Planning";
}

turn.add(startActionPhase);
turn.add(nextAction);
for(var i = 0; i < constants.actionQueueDepth; ++i)
    turn.add(nextAction, constants.actionDuration);
turn.add(endActionPhase);

    
function onKeyUp(event) {

     if(turn.isRunning()) {

       if(!turn.usedInterrupt) {

           switch (event.keyCode) {

                case Phaser.Keyboard.LEFT:
                    player.slide(constants.Direction.Left);
                    turn.usedInterrupt = true;
                    break;
                 case Phaser.Keyboard.RIGHT:
                    player.slide(constants.Direction.Right);
                    turn.usedInterrupt = true;
                    break;
                 case Phaser.Keyboard.UP:
                    player.slide(constants.Direction.Up);
                    turn.usedInterrupt = true;
                    break;
                case Phaser.Keyboard.DOWN:
                    player.slide(constants.Direction.Down);
                    turn.usedInterrupt = true;
                    break;
            }
        }
     }
     else {

         switch (event.keyCode) {
            //Movement
                case Phaser.Keyboard.LEFT:
                    player.queueMove(-1, 0);
                    movementText.setText(movementText.text + "Left,");
                    break;
                 case Phaser.Keyboard.RIGHT:
                    player.queueMove(1, 0);
                    movementText.setText(movementText.text + "Right,");
                    break;
                 case Phaser.Keyboard.UP:
                    player.queueMove(0, -1);
                    movementText.setText(movementText.text + "Up,");
                    break;
                case Phaser.Keyboard.DOWN:
                    player.queueMove(0, 1)
                    movementText.setText(movementText.text + "Down,");
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
                    arrowSpriteGroup.removeAll();
                    crosshairSpriteGroup.removeAll();
                    movementText.setText("");
                    break;
                case Phaser.Keyboard.B:
                    player.cancelAction();
                    break;
                case Phaser.Keyboard.C:
                    player.clearQueue();
                    movementText.setText("");

            //Shooting
                case Phaser.Keyboard.A:
                    player.queueShot(constants.Direction.Left)
                     movementText.setText(movementText.text + "Shoot Left,");
                    break;
                 case Phaser.Keyboard.D:
                    player.queueShot(constants.Direction.Right)
                    movementText.setText(movementText.text + "Shoot Right,");
                    break;
                 case Phaser.Keyboard.W:
                    player.queueShot(constants.Direction.Up)
                    movementText.setText(movementText.text + "Shoot Up,");
                    break;
                case Phaser.Keyboard.S:
                    player.queueShot(constants.Direction.Down)
                     movementText.setText(movementText.text + "Shoot Down,");
                    break;

			//Dungeon test
				case Phaser.Keyboard.H:
					if(floor.canMove(constants.Direction.Left)){
						floor.move(constants.Direction.Left);
					}
					break;
				case Phaser.Keyboard.J:
					if(floor.canMove(constants.Direction.Down)){
						floor.move(constants.Direction.Down);
					}
					break;
				case Phaser.Keyboard.K:
					if(floor.canMove(constants.Direction.Up)){
						floor.move(constants.Direction.Up);
					}
					break;
				case Phaser.Keyboard.L:
					if(floor.canMove(constants.Direction.Right)){
						floor.move(constants.Direction.Right);
					}
					break;
        }

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