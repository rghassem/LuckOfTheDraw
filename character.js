
var Character = function(spec) {
	var that = new GameObject(spec);

	that.takeHit = function() {
		that.room.remove(that);
		that.setActive(false);
		that.actor.x = -1 * constants.cellSize;
		that.actor.y = -1 * constants.cellSize;
	}

	return that;
}