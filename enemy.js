	/***********Enemy********************/
	var Enemy = function(spec) {
		spec.type = spec.type || 'Enemy';
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

			var direction = moveAroundObjects(deltaRow, deltaCol, objectPosition, room, 0);

			deltaRow = direction.deltaRow; 
			deltaCol = direction.deltaCol;

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

		var moveAroundObjects = function(deltaRow, deltaCol, objectPosition, room, numberOfTimesLookingForAMove) {
			var blockingObject = room.getGameObjectByPosition(objectPosition.row + deltaRow, objectPosition.col + deltaCol);


			if (blockingObject !== null && blockingObject.type !== 'Enemy' && numberOfTimesLookingForAMove < 8) {
				var blockingObjectPosition = room.getPosition(blockingObject);

				var blah = 0;

				if (blockingObjectPosition.row < objectPosition.row && blockingObjectPosition.col < objectPosition.col) {
					deltaRow = -1;
					deltaCol = 0;
					blah = 1;
				} else if (blockingObjectPosition.row === objectPosition.row && blockingObjectPosition.col < objectPosition.col) {
					deltaRow = -1;
					deltaCol = 0;
					blah = 2;
				} else if (blockingObjectPosition.row > objectPosition.row && blockingObjectPosition.col < objectPosition.col) {
					deltaRow = 0;
					deltaCol = - 1;
					blah = 3;
				} else if (blockingObjectPosition.row > objectPosition.row && blockingObjectPosition.col === objectPosition.col) {
					deltaRow = 0;
					deltaCol = - 1;
					blah = 4;
				} else if (blockingObjectPosition.row > objectPosition.row && blockingObjectPosition.col > objectPosition.col) {
					deltaRow = 1;
					deltaCol = 0;
					blah = 5;
				}  else if (blockingObjectPosition.row === objectPosition.row && blockingObjectPosition.col > objectPosition.col) {
					deltaRow = 1;
					deltaCol = 0;
					blah = 6;
				}   else if (blockingObjectPosition.row < objectPosition.row && blockingObjectPosition.col > objectPosition.col) {
					deltaRow = 0;
					deltaCol = 1;
					blah = 7;
				}  else if (blockingObjectPosition.row < objectPosition.row && blockingObjectPosition.col === objectPosition.col) {
					deltaRow = 0;
					deltaCol = 1;
					blah = 8;
				}
				return moveAroundObjects(deltaRow, deltaCol, objectPosition, room, numberOfTimesLookingForAMove + 1);
			}

			return {deltaRow : deltaRow, deltaCol : deltaCol};
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