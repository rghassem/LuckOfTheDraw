// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(1280, 744,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
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
    var healthText;
    var overlay;
    var totalMoves;

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
        crossHairSpriteGroup = game.add.group();
        actionText = game.add.text(game.world.centerX - 95, 700, "Action Type: " + mouseActionType, constants.font);
        phaseText = game.add.text(game.world.centerX - 95, 720, "Phase: Planning", constants.font);
        healthText = game.add.text(game.world.centerX - 200, 720, "Luck "+constants.playerHealth, constants.font);
        totalMoves = constants.actionQueueDepth;

        movementText = game.add.text(game.world.centerX + 25, 720, "", constants.font);

		floor = Floor();;
        player = new PlayerCharacter({sprite:'player', room: floor.getCurrentRoom(), health: constants.playerHealth});
        floor.addPlayer(1, 5,player);
		floor.getCurrentRoom().playerObjectId = player.getId();
		floor.getCurrentRoom().initialize();

		gameObjects = floor.getCurrentRoom().getGameObjects();

		map = game.add.text(882, 100, floor.getMap(), constants.mapfont);

        overlay = new Overlay(floor.getCurrentRoom());
    }

    function updateObjects() {
        floor.update();
		map.setText(floor.getMap());
        healthText.setText("Luck "+player.getHealth());
    }

    function drawObjects() {

    }

    function handleMouse(){
        if(turn.isRunning()) return; //block all action during the turn
        
        function setMovementText(delta) {
            var  row = "";
            var col = "";
            if(delta.row > 0) row = "Right";
            if(delta.row < 0) row = "Left";
            if(delta.col > 0) col = "Down";
            if(delta.col < 0) col = "Up";

            movementText.setText(movementText.text + row + col);
        }

         var cellX = Math.floor(game.input.mousePointer.x / constants.cellSize);
         var cellY = Math.floor(game.input.mousePointer.y / constants.cellSize);
         if(cellX > constants.roomWidth-1 || cellY > constants.roomHeight-1){
            return false;
         }

         var currentPos = {row:0, col: 0};
         if(arrowSpriteGroup.length > 0){
              var lastArrow = arrowSpriteGroup.getAt(arrowSpriteGroup.length - 1)
              currentPos.row = Math.floor(lastArrow.x / constants.cellSize);
              currentPos.col = Math.floor(lastArrow.y / constants.cellSize);
         }
         else{
             var currentPos = floor.getCurrentRoom().getPosition(player);
         }

         switch (mouseActionType){
            case "move" :
                     var distanceFromCurrentPos = Math.floor(util.distance(currentPos.row, currentPos.col, cellX, cellY));
                    if( distanceFromCurrentPos === 1 && overlay.markerCount() < constants.actionQueueDepth ) {

                    overlay.placeMarker( cellX, cellY, new MoveMarker(arrowSpriteGroup) );

                    var delta = util.directionTo(currentPos.row, currentPos.col, cellX, cellY );
                    player.queueMove(delta.row, delta.col);
                    setMovementText(delta);
                }
                break;
            case "shoot" :
                overlay.placeMarker( cellX, cellY, new ShootMarker(crossHairSpriteGroup) );
                player.queueShot( util.directionTo(currentPos.row,currentPos.col, cellX, cellY) );
        }
    }

    function setActionType(actionType){
       mouseActionType = actionType;
       actionText.content = "Action Type: "+actionType
    }

//Turn is a sequence of events over time
var turn = new EventSequence();
turn.usedInterrupt = false;

var nextAction = function() { floor.getCurrentRoom().nextAction(); }
var startActionPhase = function() { 
    phaseText.content = "Phase: Action"; 
    turn.usedInterrupt = false;
}
var endActionPhase = function() {
	floor.checkGameStatus();
    phaseText.content = "Phase: Planning";
    overlay.clear();
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
                    if(totalMoves > 0){
                    movementText.setText(movementText.text + "Left,");
                    totalMoves = totalMoves - 1
                    }
                    break;
                 case Phaser.Keyboard.RIGHT:
                    player.queueMove(1, 0);
                     if(totalMoves > 0){
                    movementText.setText(movementText.text + "Right,");
                       totalMoves = totalMoves - 1
                     }
                    break;
                 case Phaser.Keyboard.UP:
                    player.queueMove(0, -1);
                     if(totalMoves > 0){
                    movementText.setText(movementText.text + "Up,");
                       totalMoves = totalMoves - 1
                    }
                    break;
                case Phaser.Keyboard.DOWN:
                    player.queueMove(0, 1)
                     if(totalMoves > 0){
                    movementText.setText(movementText.text + "Down,");
                       totalMoves = totalMoves - 1
                    }
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
                    crossHairSpriteGroup.removeAll();
                    movementText.setText("");
                    totalMoves = constants.actionQueueDepth;
                    break;
                case Phaser.Keyboard.B:
                    player.cancelAction();
                    totalMoves = totalMoves++;
                    break;
                case Phaser.Keyboard.C:
                    player.clearQueue();
                    movementText.setText("");
                    totalMoves = constants.actionQueueDepth;

            //Shooting
                case Phaser.Keyboard.A:
                    player.queueShot(constants.Direction.Left)
                     if(totalMoves > 0){
                     movementText.setText(movementText.text + "Shoot Left,");
                    }
                    break;
                 case Phaser.Keyboard.D:
                    player.queueShot(constants.Direction.Right)
                     if(totalMoves > 0){
                    movementText.setText(movementText.text + "Shoot Right,");
                }
                    break;
                 case Phaser.Keyboard.W:
                    player.queueShot(constants.Direction.Up)
                     if(totalMoves > 0){
                    movementText.setText(movementText.text + "Shoot Up,");
                }
                    break;
                case Phaser.Keyboard.S:
                    player.queueShot(constants.Direction.Down)
                     if(totalMoves > 0){
                     movementText.setText(movementText.text + "Shoot Down,");
                 }
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
