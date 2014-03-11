
/*
Gun encapsulates the firing logic and effects for a playerCharacter's projectile weapon
*/
var Gun = function(spec) {
	var spec = spec || {};
	var bullet = spec.bulletSprite || "O";
	var that = {};

	var maxShotDistance = Math.max(constants.roomWidth, constants.roomHeight) ; //time the shot effect takes to cover one grid cell

	that.shoot = function(shooter, direction) {
		//Get all the objects in line of the shot
		var pos = shooter.room.getPosition(shooter);
		var targets = shooter.room.findInLine(pos.row, pos.col, direction);
		//Grab the first one


		if(targets.length > 0) {
			var sucker = targets.shift();
			if(sucker.takeHit) { //If the target takesHits, shoot it and make it take hit. Otherwise (eg a wall), just shoot at it
				playShootEffect(pos, shooter.room.getPosition(sucker), sucker.takeHit);
			}
			else
				playShootEffect(pos, shooter.room.getPosition(sucker));
		}
		else{
			//Figure out where the edge of the board is in our direction...
			var endOfLine = {};

			if(direction.row === 0)
				endOfLine.row = pos.row;
			else if(direction.row === 1)
				endOfLine.row = constants.roomWidth;
			else endOfLine.row = 0;

			if(direction.col === 0)
				endOfLine.col = pos.col;
			else if(direction.col === 1)
				endOfLine.col = constants.roomHeight;
			else endOfLine.col = 0;
			//...and shoot it
			playShootEffect(pos, endOfLine);
		}
	}

	function playShootEffect(myGridPos, targetGridPos, onComplete) {
		var bulletStart = util.gridToPixelCenter2D(myGridPos);
		var bulletEnd = util.gridToPixelCenter2D(targetGridPos);

		
		var bullet = game.add.text(bulletStart.x, bulletStart.y, ".", { font: "64px Arial", fill: "#ff0044", align: "center" }); //TODO: Use a sprite!

		//Calculate appropriate speed of bullet
		var distance = util.manhattanDistance(myGridPos.row, myGridPos.col, targetGridPos.row, targetGridPos.col);
		var effectDuration = (distance/maxShotDistance) * constants.actionDuration;

		var shotAnim = game.add.tween(bullet);
	    shotAnim.to( { x: bulletEnd.x, y: bulletEnd.y }, effectDuration * 1000 );
	    shotAnim.onComplete.add(function() {
	    	bullet.destroy();
	    	if(onComplete)
	    		onComplete();
	    });
	    shotAnim.start();

	}

	return that;
}