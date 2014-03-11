
var Character = function(spec) {
	var that = new GameObject(spec);

	that.takeHit = function() {
		that.room.remove(that);
		that.isActive = false;
		that.actor.x = -1 * constants.cellSize;
		that.actor.y = -1 * constants.cellSize;
	}

	that.shoot = function(direction) {
		//Get all the objects in line of the shot
		var pos = that.room.getPosition(that);
		var targets = that.room.findInLine(pos.row, pos.col, direction);
		//Grab the first one, and call its takeHit method
		if(targets.length > 0) {
			var sucker = targets.shift();
			if(sucker.takeHit) {
				playShootEffect(pos, that.room.getPosition(sucker), constants.actionDuration, sucker.takeHit);
			}
			else
				playShootEffect(pos, that.room.getPosition(sucker), constants.actionDuration);
		}
			else{
				var endOfLine = {};
				if(direction.row === 0)
				playShootEffect(pos, endOfLine, constants.actionDuration);
			}
	}

	function playShootEffect(myGridPos, targetGridPos, duration, onComplete) {
		var bulletStartX = util.gridToPixel(myGridPos.row);
		var bulletStartY = util.gridToPixel(myGridPos.col);
		var bulletEndX = util.gridToPixel(targetGridPos.row);
		var bulletEndY = util.gridToPixel(targetGridPos.col);

		
		var bullet = game.add.text(bulletStartX, bulletStartY, ".", { font: "32px Arial", fill: "#ff0044", align: "center" }); //TODO: Use a sprite!
		//TODO calculate appropriate speed of bullet

		var shotAnim = game.add.tween(bullet);
	    shotAnim.to( { x: bulletEndX, y: bulletEndY }, constants.actionDuration * 1000 );
	    shotAnim.onComplete.add(function() {
	    	bullet.destroy();
	    	if(onComplete)
	    		onComplete();
	    });
	    shotAnim.start();

	}

	return that;
}