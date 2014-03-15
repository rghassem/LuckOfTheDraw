// var Room = require(["room"]);

var game;
window.onload = function() {

    game = new Phaser.Game(1280, 744,
                             Phaser.AUTO, '', { preload: preload, create: create, update: updateObjects, render: drawObjects });
	var floor;
    var player;
    var gameObjects = [];
    var mouseActionType = "move";
    var actionText;
	var map;
    var healthText;
    var overlay;
    var totalMoves;
    var turn;
    var healthBar;

    function preload () {

        game.load.image('floor', './art/floor.jpg');
        game.load.image('arrow', './art/arrow-sprite.png');
        game.load.image('crosshair', './art/crosshair.png');
		game.load.image('wall', './art/wall.png');
		game.load.image('enemy', './art/enemy.png');
		game.load.image('player', './art/player.png');
        game.load.image('bullet', './art/bullet.png');
        game.load.image('healthBar', './art/healthBar.png');


        game.load.audio("gunfire", "./sound/Shoot.wav", true);
        game.load.audio("characterHit", "./sound/Hit_Hurt.wav", true);
        game.load.audio("wallHit", "./sound/Hit_Wall.wav", true);

    }

    function create () {
		game.add.sprite(0, 0, 'floor');
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        game.input.onDown.add(handleMouse, this);

        actionText = game.add.text(game.world.centerX - 195, 700, "Action Type: " + mouseActionType, constants.font);
        totalMoves = constants.actionQueueDepth;
        healthText = game.add.text(game.world.centerX - 550, 650, "Luck ", constants.font);

        healthBar = game.add.sprite(game.world.centerX - 500, 650, "healthBar");
        healthBar.cropEnabled = true;


		floor = Floor(turn);;
        player = new PlayerCharacter({sprite:'player', room: floor.getCurrentRoom(), health: constants.playerHealth});
        floor.addPlayer(1, 5,player);
		floor.getCurrentRoom().playerObjectId = player.getId();
		floor.getCurrentRoom().initialize();

		gameObjects = floor.getCurrentRoom().getGameObjects();

		map = game.add.text(882, 100, floor.getMap(), constants.mapfont);

        turn = new Turn(player, floor);

    }

    function updateObjects() {
        floor.update();
		map.setText(floor.getMap());
        healthBar.crop.width = player.getHealth() * 2;
        if(player.getHealth() === 0){
            healthText.setText("Git Gud Scrub");
        }
    }

    function drawObjects() {

    }

    function handleMouse(){
        
         var cellX = Math.floor(game.input.mousePointer.x / constants.cellSize);
         var cellY = Math.floor(game.input.mousePointer.y / constants.cellSize);
         if(cellX > constants.roomWidth-1 || cellY > constants.roomHeight-1){
            return false;
         }

         switch (mouseActionType){
            case "move" :
                turn.queueMoveAction(cellX, cellY);
                break;
            case "shoot" :
                turn.queueShootAction(cellX, cellY);
                break;
        }
    }

    function setActionType(actionType){
       mouseActionType = actionType;
       actionText.content = "Action Type: "+actionType
    }


    
function onKeyUp(event) {

   switch (event.keyCode) {

        case Phaser.Keyboard.LEFT:
            turn.sendDirectionalInput(constants.Direction.Left);
            break;
         case Phaser.Keyboard.RIGHT:
            turn.sendDirectionalInput(constants.Direction.Right);
            break;
         case Phaser.Keyboard.UP:
            turn.sendDirectionalInput(constants.Direction.Up);
            break;
        case Phaser.Keyboard.DOWN:
            turn.sendDirectionalInput(constants.Direction.Down);
            break;
    }


 switch (event.keyCode) {
    //Movement
        /*case Phaser.Keyboard.LEFT:
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
            break;*/

    //Mouse Commands
        case Phaser.Keyboard.M:
            setActionType("move");
            break;
        case Phaser.Keyboard.N:
            setActionType("shoot");
            break;  

    //Actions
        case Phaser.Keyboard.SPACEBAR:
            turn.runTurn();
            //movementText.setText("");
            totalMoves = constants.actionQueueDepth;
            break;
        case Phaser.Keyboard.B:
            player.cancelAction();
            totalMoves = totalMoves++;
            break;
        case Phaser.Keyboard.C:
            player.clearQueue();
            //movementText.setText("");
            totalMoves = constants.actionQueueDepth;

    //Shooting
        /*case Phaser.Keyboard.A:
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
            break;*/

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
