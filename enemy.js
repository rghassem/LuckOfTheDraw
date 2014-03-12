	/***********Enemy********************/
	var Enemy = function(spec) {

		var that = new Character(spec);
		var actionQueue = [];

		var gun = spec.gun || new Gun();

		//In the pre-action, the AI decides what it wants to do based on the state of the game (unchanged from previous)
		that.takePreAction = function() {
			var room = that.room;

			var player = room.getGameObjectById(room.playerObjectId);
			var playerPosition = room.getPosition(player);

			var objectPosition = room.getPosition(this);

			var deltaRow = 0;
			var deltaCol = 0;

			if (playerPosition.row > objectPosition.row) {
				deltaRow = 1;
			} else if (playerPosition.row < objectPosition.row) {
				deltaRow = - 1;
			}

			if (playerPosition.col > objectPosition.col) {
				deltaCol = 1;
			} else if (playerPosition.col < objectPosition.col) {
				deltaCol = - 1;
			}

			//See if we can shoot the player from here, if so pass along instructions to do that to takePostAction
			var dir = gun.getShootDirection(that, player);
			if( dir ) 
				return {
					isShoot: true,
					direction: dir
				};
			
			else
				return {
					isShoot : false,
					delta:  { row : deltaRow, col: deltaCol}
			};
		}

		//Move commands are executed during the action phase, if it was decided to execute one in pre-action
		that.takeAction = function(preActionReturnVal) {
			if( preActionReturnVal && !preActionReturnVal.isShoot)
				that.room.move(this, preActionReturnVal.delta.row, preActionReturnVal.delta.col);
			else return preActionReturnVal;//chain along result to postAction
		}

		//Finally, shoot commands are executed in postAction, after all GameObjects have moved
		that.takePostAction = function(actionReturnVal) {
			if(actionReturnVal && actionReturnVal.isShoot)
				gun.shoot(that, actionReturnVal.direction);
		}

		return that;
	};