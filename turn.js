
//Manages queuing actions, their UI, as well as running the action phase event sequence.
var Turn = function(player, floor) {

	var arrowSpriteGroup = game.add.group();
    var crossHairSpriteGroup = game.add.group();;

	overlay = new Overlay();

	phaseText = game.add.text(game.world.centerX - 95, 720, "Phase: Planning", constants.font);

	//Turn is a sequence of events over time
	var turn = new EventSequence();
	var usedInterrupt = false;

	var nextAction = function() { floor.getCurrentRoom().nextAction(); }
	var startActionPhase = function() { 
	    phaseText.content = "Phase: Action"; 
	    usedInterrupt = false;
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


    var movementText = game.add.text(game.world.centerX + 25, 720, "", constants.font);

	this.sendDirectionalInput = function(direction) {
		if(turn.isRunning())
			this.dive(direction);
		else {
			var movePoint = getMovePoint();
			this.queueMoveAction(movePoint.row + direction.row, movePoint.col + direction.col);
		}
	}


	this.queueMoveAction = function(cellX, cellY) {

		if(turn.isRunning()) return; //block queuing anything during action phase

		var currentPos = getMovePoint();

        var distanceFromCurrentPos = Math.floor(util.distance(currentPos.row, currentPos.col, cellX, cellY));
        if( distanceFromCurrentPos === 1 && overlay.markerCount() < constants.actionQueueDepth ) {

	        overlay.placeMarker( cellX, cellY, new MoveMarker(arrowSpriteGroup) );

	        var delta = util.directionTo(currentPos.row, currentPos.col, cellX, cellY );
	        player.queueMove(delta.row, delta.col);
	        setMovementText(delta);
    	}
	}

	this.queueShootAction = function(cellX, cellY) {

		if(turn.isRunning()) return; //block queuing anything during action phase

		var currentPos = getMovePoint();

		overlay.placeMarker( cellX, cellY, new ShootMarker(crossHairSpriteGroup) );
        player.queueShot( util.directionTo(currentPos.row,currentPos.col, cellX, cellY) );
	}

	this.dive = function(direction) {
		if(usedInterrupt) return;

		player.slide(constants.Direction.Right);
		usedInterrupt = true;
	}

	this.runTurn = function() {
        turn.start();
        arrowSpriteGroup.removeAll();
        crossHairSpriteGroup.removeAll();
	}

	function getMovePoint() {
		 var currentPos = {row:0, col: 0};
         if(arrowSpriteGroup.length > 0){
              var lastArrow = arrowSpriteGroup.getAt(arrowSpriteGroup.length - 1)
              currentPos.row = Math.floor(lastArrow.x / constants.cellSize);
              currentPos.col = Math.floor(lastArrow.y / constants.cellSize);
         }
         else{
             var currentPos = player.room.getPosition(player);
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

        movementText.setText(movementText.text + row + col);
    }

}