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
    var turnManager;

    function preload () {

        game.load.image('floor', './art/floor.jpg');
        game.load.image('arrow', './art/arrow-sprite.png');
        game.load.image('crosshair', './art/crosshair.png');
		game.load.image('wall', './art/wall.png');
		game.load.image('doorLeft', './art/doorLeft.png');
		game.load.image('doorRight', './art/doorRight.png');
		game.load.image('doorUp', './art/doorUp.png');
		game.load.image('doorDown', './art/doorDown.png');
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


		floor = Floor();
        player = new PlayerCharacter({sprite:'player', room: floor.getCurrentRoom(), health: constants.playerHealth});
        turnManager = new TurnManager(player, floor);

        floor.setTurn(turnManager.getTurn());
        floor.addPlayer(1, 5,player);
		floor.getCurrentRoom().playerObjectId = player.getId();
		floor.getCurrentRoom().initialize();

		gameObjects = floor.getCurrentRoom().getGameObjects();

		map = game.add.text(882, 100, floor.getMap(), constants.mapfont);

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
                turnManager.queueMoveAction(cellX, cellY);
                break;
            case "shoot" :
                turnManager.queueShootAction(cellX, cellY);
                break;
        }
    }

    function setActionType(actionType){
       mouseActionType = actionType;
       actionText.content = "Action Type: "+actionType
    }


    
function onKeyUp(event) {

 switch (event.keyCode) {

    //Movement/Interrupt
        case Phaser.Keyboard.LEFT:
            turnManager.queueDirectionalMove(constants.Direction.Left);
            break;
        case Phaser.Keyboard.RIGHT:
            turnManager.queueDirectionalMove(constants.Direction.Right);
            break;
         case Phaser.Keyboard.UP:
            turnManager.queueDirectionalMove(constants.Direction.Up);
            break;
        case Phaser.Keyboard.DOWN:
            turnManager.queueDirectionalMove(constants.Direction.Down);
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
            turnManager.runTurn();
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
        case Phaser.Keyboard.A:
            turnManager.queueDirectionalShoot(constants.Direction.Left)
            break;
         case Phaser.Keyboard.D:
            turnManager.queueDirectionalShoot(constants.Direction.Right)
            break;
         case Phaser.Keyboard.W:
            turnManager.queueDirectionalShoot(constants.Direction.Up)
            break;
        case Phaser.Keyboard.S:
            turnManager.queueDirectionalShoot(constants.Direction.Down)
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
