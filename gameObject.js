// (function(){

	/***********GameObject********************/
	var GameObject = function(spec) {
		var that = {};
		var id = -1; //no id until placed in world
		var row, col;
		var sprite = spec.sprite || '@';
		var x = 0;
		var y = 0;

		that.room = spec.room || {};

		var style = { font: constants.cellSize + "px monospace", fill:"#fff"};
		//The phaser actor
		var actor = game.add.text(-1, -1, sprite, style);

		that.getId = function() {
			return id;
		}

		that.setId = function(newid) {
			id = newid;
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

			var newX = startingPos.x * (1 - moveProgress) +  moveProgress * targetPos.x;
			var newY = startingPos.y * (1 - moveProgress) +  moveProgress* targetPos.y;
			actor.x = newX;
			actor.y = newY;
			var progressIncrement = Math.min( game.time.elapsed /  (constants.actionDuration * 1000) , 1);
			moveProgress = Math.min( moveProgress + progressIncrement , 1);

			if(moveProgress === 1)
				isMoving = false;
		}

		that.update = function() {
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


	var Wall = function(spec) {
		var that = new GameObject(spec);
		return that;
	};
// })();