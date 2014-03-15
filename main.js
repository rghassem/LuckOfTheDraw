// var Room = require(["room"]);

var game;

var screenWidth = 1280;
var screenHeight = 744;

window.onload = function() {


    game = new Phaser.Game(screenWidth, screenHeight,
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
    var tutorialText;
    var backGroundPic;
    var titleText;

    function preload () {

        game.load.image('floor', './art/floor.jpg');
        game.load.image('arrow', './art/arrowHead.png');
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
        game.load.image('loseScreen', './art/loseScreen.png');
        game.load.image('winScreen', './art/winScreen.png');
        game.load.image('backGround', './art/BurntPaper.png');
    	game.load.image('actionQueueBox', './art/actionQueueBox.png');
	    game.load.image('actionQueueBoxHightlight', './art/actionQueueBoxHighlight.png');

        game.load.image('actionQueueBoxHightlight', './art/actionQueueBoxHighlight.png')


        game.load.audio("gunfire", "./sound/Shoot.wav", true);
        game.load.audio("characterHit", "./sound/Hit_Hurt.wav", true);
        game.load.audio("characterMiss", "./sound/Hit_Wall.wav", true);
        game.load.audio("wallHit", "./sound/Hit_Wall.wav", true);
        game.load.audio("gunLoad", "./sound/gunLoad.wav", true);
        game.load.audio("heartbeat", "./sound/heartbeat.wav", true);

    }

    function create () {

        var screenBorderWidth = screenWidth - (constants.roomWidth * constants.cellSize);
        var screenBorderXCenter = (constants.roomWidth * constants.cellSize)  + screenBorderWidth/2;

        backGroundPic = game.add.sprite(0,0,'backGround');
		game.add.sprite(0, 0, 'floor');
        // init keyboard commands
        game.input.keyboard.addCallbacks(null, null, onKeyUp);

        game.input.onDown.add(handleMouse, this);
        totalMoves = constants.actionQueueDepth;
        healthText = game.add.text(game.world.centerX - 550, 650, "Luck ", constants.font);

        tutorialText = game.add.text(game.world.centerX + 250, 590, 
            //Columns are aligned with spaces
            "MOUSE:       Place Actions\n" + 
             "SPACE:        Execute All Actions\n" + 
            "M:                   Move Action\n" +
             "N:                    Shoot Action\n" + 
            "ARROWS:   During Action Phase to Dive", 
            constants.instructionFont);

        actionText = game.add.text(game.world.centerX + 250, 0, "Action Type: " + mouseActionType, constants.displayfont);

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

		map = game.add.text(882, 150, floor.getMap(), constants.mapfont);
        turnManager.startGame();

    //Buttons for switching action mode:

        //Swtich to Move button
        var padding = 32;
        var buttonWidth = 96;
        var buttonPos = { 
            x: screenBorderXCenter - buttonWidth/2 - 20, 
            y: screenHeight/4 
        };
        var moveButton = game.add.button(buttonPos.x, buttonPos.y, 'arrow', function() {
            setActionType("move");
        });
        moveButton.anchor = new Phaser.Point(0.5, 0.5);

        //Switch to Shoot button
        var shootButton =  game.add.button(buttonPos.x + buttonWidth + padding, buttonPos.y, 'crosshair', function() {
            setActionType("shoot");
        });
        shootButton.anchor = new Phaser.Point(0.5, 0.5);
    }

    function updateObjects() {
        floor.update();
		map.setText(floor.getMap());
        healthBar.crop.width = player.getHealth() * 2;
        if(player.getHealth() === 0){
            game.add.sprite(0,0, "loseScreen");
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
            break;
        case Phaser.Keyboard.B:
            turnManager.cancelAction();
            break;
        case Phaser.Keyboard.C:
            turnManager.clearActions();

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
