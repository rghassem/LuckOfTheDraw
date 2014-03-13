
var Door = function(spec) {
	var that = new GameObject(spec);
	that.direction = spec.direction || null;

	return that;
};