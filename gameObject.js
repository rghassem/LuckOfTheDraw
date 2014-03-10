// (function(){

	/***********GameObject********************/
	var GameObject = function(spec) {
		var that = {};
		var id = -1; //no id until placed in world
		var row, col;
		var sprite = spec.sprite || '@';
		var x = 0;
		var y = 0;
		var actor = game.add.text(-1, -1, sprite, { font: constants.cellSize + "px monospace", fill:"#fff"});

		that.isActive = true;
		that.actor = actor;
		that.room = spec.room || {};

		//The phaser actor

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
			if(!that.isActive) return;

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

	var Character = function(spec) {
		var that = new GameObject(spec);

		that.takeHit = function() {
			that.room.remove(that);
			that.isActive = false;
			that.actor.x = -1 * constants.cellSize;
			that.actor.y = -1 * constants.cellSize;
		}

		that.shoot = function(direction) {
			//Get all the objects in line of the shot
			var pos = that.room.getPosition(that);
			var targets = that.room.findInLine(pos.row, pos.col, direction);
			//Grab the first one, and call its takeHit method
			if(targets.length > 0) {
				var sucker = targets.shift();
				if(sucker.takeHit) {
					sucker.takeHit();
				}
			}
		}

		return that;
	}


	var Wall = function(spec) {
		var that = new GameObject(spec);

		return that;
	};
// })();