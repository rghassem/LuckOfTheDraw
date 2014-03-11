
var Wall = function(spec) {
	var that = new GameObject(spec);

	var hitSoundEffect = spec.hitSoundEffect || "wallHit";
	var hitSound = game.add.audio(hitSoundEffect);


	that.takeHit = function() {
		//TODO: play a sound effect or something
		hitSound.play();
	}

	return that;
};