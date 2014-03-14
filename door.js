
var Door = function(spec) {
	spec.type = spec.type || 'Door';
	var that = new GameObject(spec);
	var direction = spec.direction || null;
	var floor = spec.floor || null;

	that.open = function() {
		floor.move(direction);
	}

	that.update = function() {

	}

	return that;
};