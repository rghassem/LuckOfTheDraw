var showTitle = function(titleText, position, duration, soundEffect) {
	
	var font = constants.font;
	var text = game.add.text(position.x, position.y, titleText, font);
	text.anchor = 0.5;

	if(soundEffect) {
		var sound = game.add.audio(soundEffect);
		soundEffect.play();
	}

	var transitionOut = game.add.tween(text);
	transitionOut.to( { alpha: 0 }, duration * 1000 );
    transitionOut.onComplete.add(function() {
    	text.destroy();
    });

}