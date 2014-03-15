
//Manages queuing actions, their UI, as well as running the action phase event sequence.
var TurnManager = function(player, floor) {

	var arrowSpriteGroup = game.add.group();
    var crossHairSpriteGroup = game.add.group();
    var actionQueueBorder = game.add.group();
 

  //ActionQueueUI is an internal object for managing the queue visualization
	var actionQueueUI ={
		x: util.gridToPixel(constants.roomWidth/2), 
		y: util.gridToPixel(constants.roomHeight)
	}

	//Create the action queue UI
	for(var i = 0; i < constants.actionQueueDepth; ++i)
		actionQueueBorder.create(actionQueueUI.x + (i * constants.cellSize), actionQueueUI.y, 'actionQueueBox');

	actionQueueUI.actionQueueSprites = [];

	actionQueueUI.queueAction = function(index, sprite) {
		if(index < actionQueueBorder.length) {
			var box = actionQueueBorder.getAt(index);
			var spriteObj = game.add.sprite(box.x, box.y, sprite);
			actionQueueUI.actionQueueSprites.push(spriteObj);
		}
	}

	actionQueueUI.popAction = function() {
		actionQueueUI.actionQueueSprites.pop().destroy();
	}

	actionQueueUI.clear = function() {
		while(actionQueueUI.actionQueueSprites.length > 0)
			actionQueueUI.popAction();
	}

	actionQueueUI.highlightAction = function() {

	}

	overlay = new Overlay();

	phaseText = game.add.text(game.world.centerX - 195, 720, "Phase: Planning", constants.font);


  //Turn is a sequence of events over time
	var turn = new EventSequence();
	var usedInterrupt = false;

	var nextAction = function() { console.log('nextAction'); floor.getCurrentRoom().nextAction(); }
	var startActionPhase = function() {
		console.log('changed to action phade');
	    phaseText.content = "Phase: Action"; 
	    usedInterrupt = false;
	}
	var endActionPhase = function() {
		console.log('changed to planning phase');
		floor.checkGameStatus();
	    phaseText.content = "Phase: Planning";
	    overlay.clear();
	    actionQueueUI.clear();
	     
	    if(player.getHealth() === 0){
            healthText.setText("Git Gud Scrub");
            game.add.sprite(0,0, "loseScreen");
        }
	}

	turn.add(startActionPhase);
	turn.add(nextAction);
	for(var i = 0; i < constants.actionQueueDepth; ++i)
	    turn.add(nextAction, constants.actionDuration);
	turn.add(endActionPhase);

    var movementText = game.add.text(game.world.centerX + 25, 720, "", constants.font);

    this.getTurn = function() {
    	return turn;
    }

	this.queueDirectionalMove = function(direction) {
		if(turn.isRunning())
			this.dive(direction);
		else {
			var movePoint = getMovePoint();
			this.queueMoveAction(movePoint.row + direction.row, movePoint.col + direction.col);
		}
	}

	this.queueDirectionalShoot = function(direction) {
		var pos = getMovePoint();
		var row = pos.row + direction.row;
		var col = pos.col + direction.col;
		this.queueShootAction(row, col);
	}


	this.queueMoveAction = function(cellX, cellY) {

		if(turn.isRunning()) return; //block queuing anything during action phase

		var currentPos = getMovePoint();

        var distanceFromCurrentPos = Math.floor(util.distance(currentPos.row, currentPos.col, cellX, cellY));
        if( distanceFromCurrentPos === 1 && overlay.markerCount() < constants.actionQueueDepth ) {

        	actionQueueUI.queueAction(overlay.markerCount(), 'arrow');
	        overlay.placeMarker( cellX, cellY, new MoveMarker(arrowSpriteGroup) );

	        var delta = util.directionTo(currentPos.row, currentPos.col, cellX, cellY );
	        player.queueMove(delta.row, delta.col);
	        actionQueueUI.queueAction('arrow');
    	}
	}

	this.queueShootAction = function(cellX, cellY) {

		if(turn.isRunning()) return; //block queuing anything during action phase
		if(overlay.markerCount() >= constants.actionQueueDepth) return;

		var currentPos = getMovePoint();

        actionQueueUI.queueAction(overlay.markerCount(), 'crosshair');
		overlay.placeMarker( cellX, cellY, new ShootMarker(crossHairSpriteGroup) );
        player.queueShot( util.directionTo(currentPos.row,currentPos.col, cellX, cellY) );
	}

	this.dive = function(direction) {
		if(usedInterrupt) return;

		player.slide(direction);
		usedInterrupt = true;
	}

	this.cancelAction = function() {
		player.cancelAction();
		overlay.popMarker();
		actionQueueUI.popAction();
	}

	this.clearActions = function() {
		player.clearQueue();
		overlay.clear();
	}

	this.runTurn = function() {
        turn.start();
        overlay.clear();
        arrowSpriteGroup.removeAll();
        crossHairSpriteGroup.removeAll();
	}


	function getMovePoint() {
		 var currentPos;
         if(arrowSpriteGroup.length > 0){
              var lastArrow = arrowSpriteGroup.getAt(arrowSpriteGroup.length - 1)
              currentPos = util.pixelToGrid2D(lastArrow);
         }
         else{
             var currentPos = getPlayerPosition();
         }
         return currentPos;
	}

	function setMovementText(delta) {
        var  row = "";
        var col = "";
        if(delta.row > 0) row = "Right";
        if(delta.row < 0) row = "Left";
        if(delta.col > 0) col = "Down";
        if(delta.col < 0) col = "Up";

        movementText.setText(movementText.text + row + col + " ");
    }

    function getPlayerPosition() {
		return player.room.getPosition(player);
	}

}

