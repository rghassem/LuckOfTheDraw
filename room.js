/*
Objects added to room must provide getId, setId, and setGridPosition methods. Room objects can receive callbacks to take action by implementing 
takePreAction, takeAction, and takePostAction. takeAction and takePostAction receive the return value of the previous callback as a parameter.
For each stage, the function is run for all Room objects before running the next stage callbacks.
*/

// (function(){

	/***********Room********************/
	var Room = function(spec) {
		var that = {};
		var width = spec.width || 0;
		var height = spec.height || 0;
		var row = spec.row || 0;
		var col = spec.col || 0;
		var objects = [];
		var exits = [];
		var objCounts = {};

		var grid = [];
		var positions = [];

		//Initialize the game grid
		for(var i = 0; i < width; ++i)
		{
			var inner = [];
			grid.push(inner);
			for(var j = 0; j < height; ++j)
			{
				inner.push(null);
			}
		}

		function isInBounds(row, col) {
			return !(row < 0 || col < 0 || row >= width || col >= height)
		}

		that.at= function(row, col) {
			return grid[row][col];
		}

		that.getPosition = function(gameObject) {
			var gameObjectID = gameObject.getId();
			if(gameObjectID < positions.length && positions[gameObjectID] )
				return positions[gameObjectID];
			else return null;
		}

		that.add = function(gameObject, row, col) {
			gameObject.setId(objects.length);

			objects.push(gameObject);
			positions.push({row: row, col: col});
			if(!objCounts[gameObject.getType()]) {
				objCounts[gameObject.getType()] = 1;
			} else {
				objCounts[gameObject.getType()]++;
			}

			grid[row][col] = gameObject;
			gameObject.setGridPosition(row, col);
			gameObject.setActive(false);
		}

		that.remove = function(gameObject) {
			var pos = that.getPosition(gameObject);
			if(pos !== null) {
				grid[pos.row][pos.col] = null;
			}
			objCounts[gameObject.getType()]--;
		}

		that.countObjects = function(type) {
			if(objCounts[type]){
				return objCounts[type];
			} else {
				return 0;
			}
		}

		that.move = function(gameObject, deltaX, deltaY) {
			if(gameObject === null) return false;
			var currentGridPos = that.getPosition(gameObject);
			var toRow = currentGridPos.row + deltaX;
			var toCol = currentGridPos.col + deltaY;
			if( !isInBounds(toRow, toCol) )
				return false;

			if(grid[toRow][toCol] === null) {
				grid[toRow][toCol] = gameObject;
				grid[currentGridPos.row][currentGridPos.col] = null;
				positions[gameObject.getId()] = {row: toRow, col: toCol};
				return true;
			} else if( grid[toRow][toCol].getType() === 'Door') {
				grid[toRow][toCol].open();
				return true;
			} else return false;
		}

		//Starting from (row, col) not inclusively, moving in direction (constants.Direction), return all non-null GameObjects in the order encountered
		that.findInLine = function(row, col, direction) {
			var results = [];
			var currentRow = row + direction.row;
			var currentCol = col + direction.col;

			while( isInBounds(currentRow, currentCol) )
			{
				var object = that.at(currentRow, currentCol);
				if(object !== null)
					results.push(object);
				currentRow += direction.row;
				currentCol += direction.col;
			}
			return results;
		}

		that.getGameObjectById = function(id) {
			if(id < objects.length && objects[id] !== null )
				return objects[id];
			else return null;
		}

		that.getGameObjectByPosition = function(row, col) {
			return 	grid[row][col];
		}

		that.nextAction = function() {
			var preActionResults = [];
			var actionResults = [];

			objects.forEach(function(go) {
				var result;
				if(go.takePreAction && go.isActive()) {
					result = go.takePreAction();
				}
				preActionResults.push(result);
			});

			objects.forEach(function(go) {
				var nextResult;
				var prevResult = preActionResults.shift();
				if(go.takeAction && go.isActive()) {
					nextResult = go.takeAction(prevResult);
				}
				actionResults.push(nextResult);
			});

			objects.forEach(function(go) {
				var prevResult = actionResults.shift();
				if(go.takePostAction && go.isActive()) {
					go.takePostAction(prevResult);
				}
			});
		}

		that.initialize = function() {
			objects.forEach(function(gameObject){
				gameObject.setActive(true);
			});
		}

		that.getGameObjects = function() {
			return objects;
		}

		that.getExits = function() {
			return exits;
		}

		that.leave = function() {
			objects.forEach(function(gameObject) {
				gameObject.setActive(false);
			});
		}

		that.getRow = function() {
			return row;
		}

		that.getCol = function() {
			return col;
		}

		that.getUp = function() {
			return {
				direction: constants.Direction.Up,
				row: row + constants.Direction.Up.row,
				col: col + constants.Direction.Up.col,
				oppositeRow: row,
				oppositeCol: col
			}
		}

		that.getDown = function() {
			return {
				direction: constants.Direction.Down,
				row: row + constants.Direction.Down.row,
				col: col + constants.Direction.Down.col,
				oppositeRow: row,
				oppositeCol: col
			}
		}

		that.getLeft = function() {
			return {
				direction: constants.Direction.Left,
				row: row + constants.Direction.Left.row,
				col: col + constants.Direction.Left.col,
				oppositeRow: row,
				oppositeCol: col
			}
		}

		that.getRight = function() {
			return {
				direction: constants.Direction.Right,
				row: row + constants.Direction.Right.row,
				col: col + constants.Direction.Right.col,
				oppositeRow: row,
				oppositeCol: col
			}
		}

		return that;
	}

	// return Room;

// })();