var TwoStateButton = function(buttonPos, overlay, onPress) {

		var down = false;

		function pressButton() {
			down = true;
			button.setFrames(2, 2, 2, 2); //all states are down
            onPress();
		}

		var button = game.add.button(buttonPos.x, buttonPos.y, 'button', function() {
			pressButton();
        });

        button.setFrames(1, 0, 2, 0);

        button.anchor = new Phaser.Point(0.5, 0.5);
        var sprite = game.add.sprite(button.x, button.y, overlay); //inlay the move graphic
        sprite.anchor = new Phaser.Point(0.5, 0.5);

        this.release = function() {
        	button.setFrames(1, 0, 2, 0);
        	down = false;
        }

        this.press = function() {
        	pressButton();
        }
}