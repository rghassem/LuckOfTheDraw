var showTitle = function(titleText, position, duration, font, soundEffect) {
	
	var font = font || constants.overlayFontBlack;
	var text = game.add.text(position.x, position.y, titleText, font);
	text.anchor = new Phaser.Point(0.5, 0.5);

	if(soundEffect) {
		var sound = game.add.audio(soundEffect);
		sound.play();
	}

	var transitionOut = game.add.tween(text);
	transitionOut.to( { alpha: 0 }, duration * 1000 );
	//transitionOut.easing(Phaser.Easing.Cubic.In);
    transitionOut.onComplete.add(function() {
    	text.destroy();
    });
    transitionOut.start();

}