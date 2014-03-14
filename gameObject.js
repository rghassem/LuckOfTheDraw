// (function(){

	/***********GameObject********************/
	var GameObject = function(spec) {
		var type = spec.type || 'gameObject';
		var that = {};
		var id = -1; //no id until placed in world
		var row, col;
		var sprite = spec.sprite || '@';
		var x = 0;
		var y = 0;
		var actor = game.add.sprite(-1, -1, sprite);
		actor.kill();

		that.actor = actor;
		that.room = spec.room || {};

		//The phaser actor

		that.getId = function() {
			return id;
		}

		that.getType = function() {
			return type;
		}

		that.setId = function(newid) {
			id = newid;
		}

		that.isActive = function() {
			return actor.exists;
		}

		that.setActive = function(active) {
			if(active && !that.isActive()) //if we want it active and its not 'revive' it
				actor.revive();
			else if(!active && that.isActive())
				actor.kill();  //if we want it dead and its not, 'kill' it
		}

		that.setGridPosition = function(row, col) {
			x = row * constants.cellSize;
			y = col * constants.cellSize;
			actor.x = x;
			actor.y = y;
		}

		var moveProgress = 1;
		var isMoving = false;
		var startingPos , targetPos;

		function startMove(x, y) {
			startingPos = {x: actor.x, y: actor.y};
			targetPos = {x: x, y: y};
			moveProgress = 0;
			isMoving = true;
		}

		function interpolateMovement() {
			if(!isMoving) return;
			var progressIncrement = Math.min( game.time.elapsed /  (constants.actionDuration * 1000) , 1);
			moveProgress = Math.min( moveProgress + progressIncrement , 1);


			var newX = startingPos.x * (1 - moveProgress) +  moveProgress * targetPos.x;
			var newY = startingPos.y * (1 - moveProgress) +  moveProgress* targetPos.y;
			actor.x = newX;
			actor.y = newY;

			if(moveProgress === 1)
				isMoving = false;
		}

		that.update = function() {

			if(!that.isActive()) return;

			var rowCol = that.room.getPosition(this);
			var row = rowCol.row;
			var col = rowCol.col;

			x = row * constants.cellSize;
			y = col * constants.cellSize;

			if( (x !== actor.x || y !== actor.y)  && !isMoving)
				startMove(x, y);

			interpolateMovement();
		}

		return that;
	};

// })();