
var Wall = function(spec) {
	var that = new GameObject(spec);

	that.takeHit = function() {
		//TODO: play a sound effect or something
	}

	return that;
};