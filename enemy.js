	/***********Enemy********************/
	var Enemy = function(spec) {

		var that = new Character(spec);
		var actionQueue = [];

		that.takeAction = function(room) {
			var playerPosition = room.getPosition(room.getGameObjectById(room.playerObjectId));

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
			

			room.move(this, deltaRow, deltaCol);
		}

		that.move  = function(deltaRow, deltaCol) {
			actionQueue.push({
				row: deltaRow,
				col: deltaCol
			});
		}

		return that;
	};