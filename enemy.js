	/***********Enemy********************/
	var Enemy = function(spec) {

		var that = new Character(spec);
		var actionQueue = [];

		var gun = spec.gun || new Gun();

		that.takeAction = function(room) {
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
			
			//TODO: We should be able to both move and shoot
			if(!tryShoot(player))
				room.move(this, deltaRow, deltaCol);
		}

		that.move  = function(deltaRow, deltaCol) {
			actionQueue.push({
				row: deltaRow,
				col: deltaCol
			});
		}

		//Tries to shoot the target, return true if success
		function tryShoot(target) {
			var direction = gun.getShootDirection(that, target);
			if( direction ) {
				gun.shoot(that, direction);
				return true;
			}
			return false;
		}

		return that;
	};