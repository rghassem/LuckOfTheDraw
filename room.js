// var GameObject = require(["gameObject"]);

// (function(){

	/***********Room********************/
	var Room = function(spec) {
		var that = {};
		var width = spec.width || 0;
		var height = spec.height || 0;
		var objects = [];

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

			grid[row][col] = gameObject;
		}

		that.remove = function(gameObject) {
			var pos = that.getPosition(gameObject);
			if(pos !== null) {
				grid[pos.row][pos.col] = null;
			}
		}


		that.move = function(gameObject, deltaX, deltaY) {
			if(gameObject === null) return false;
			var currentGridPos = this.getPosition(gameObject);
			var toRow = currentGridPos.row + deltaX;
			var toCol = currentGridPos.col + deltaY;
			if( !isInBounds(toRow, toCol) )
				return false;

			if(grid[toRow][toCol] === null) {
				grid[toRow][toCol] = gameObject;
				grid[currentGridPos.row][currentGridPos.col] = null;
				positions[gameObject.getId()] = {row: toRow, col: toCol};
				return true;
			}
			else return false;
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

		that.nextAction = function() {
			for(var i = 0; i < objects.length; ++i)
			{
				var go = objects[i];
				if(go.takeAction && go.isActive) {
					go.takeAction(this);
				}
			}
		}

		that.getGameObjects = function() {
			return objects;
		}

		return that;
	}

	// return Room;

// })();