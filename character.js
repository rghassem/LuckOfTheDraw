
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
				sucker.takeHit();
			}
		}
	}

	return that;
}