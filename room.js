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
		var playerObjectId = -1;

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

		that.add = function(gameObject, row, col) {
			gameObject.setId(objects.length);

			objects.push(gameObject);
			positions.push({row: row, col: col});

			grid[row][col] = gameObject;
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

		that.move = function(gameObject, deltaX, deltaY) {
			if(gameObject === null) return false;
			var currentGridPos = this.getPosition(gameObject);
			var toRow = currentGridPos.row + deltaX;
			var toCol = currentGridPos.col + deltaY;
			if( toRow < 0 || toCol < 0 || toRow >= grid.length || toCol >= grid[0].length)
				return false;

			if(grid[toRow][toCol] === null) {
				grid[toRow][toCol] = gameObject;
				grid[currentGridPos.row][currentGridPos.col] = null;
				positions[gameObject.getId()] = {row: toRow, col: toCol};
				return true;
			}
			else return false;
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
				if(go.takeAction) {
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