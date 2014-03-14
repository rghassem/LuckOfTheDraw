
var Character = function(spec) {
	spec.type = spec.type || 'Character';
	var that = new GameObject(spec);

	var hitSoundEffect = spec.hitSoundEffect || "characterHit";
	var hitSound = game.add.audio(hitSoundEffect);

	that.takeHit = function() {
		that.room.remove(that);
		that.setActive(false);
		that.actor.x = -1 * constants.cellSize;
		that.actor.y = -1 * constants.cellSize;

		hitSound.play();
	}

	return that;
}