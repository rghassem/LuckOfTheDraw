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

		that.add = function(gameObject, row, col) {
			gameObject.setId(objects.length);

			objects.push(gameObject);
			positions.push({row: row, col: col});

			grid[row][col] = gameObject;
		}

		that.at= function(row, col) {
			return grid[row, col];
		}

		that.getPosition = function(gameObjectID) {
			if(gameObjectID < positions.length && positions[gameObjectID] )
				return positions[gameObjectID];
			else return null;
		}

		that.move = function(gameObject, deltaX, deltaY) {
			if(gameObject === null) return false;
			var currentGridPos = this.getPosition(gameObject.getId());
			var toRow = currentGridPos.row + deltaX;
			var toCol = currentGridPos.col + deltaY;
			if( toRow < 0 || toCol < 0 || toRow >= grid.length || toCol >= grid[0].length)
				return false;

			if(grid[toRow][toCol] === null) {
				grid[toRow][toCol] = gameObject;
				grid[currentGridPos.row][currentGridPos.col] = null;
				positions[gameObject.id] = {row: toRow, col: toCol};
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

		that.update = function () {
			for(var i = 0; i < grid.length; ++i)
			{
				for(var j = 0; j < grid[i].length; ++j)
				{
					var gameObject = grid[i][j];
					if(gameObject)
						gameObject.update(i, j);
				}
			}
		}

		that.draw = function () {
			objects.forEach(function(gameObject){
				gameObject.draw();
			});
		}

		return that;
	}

	// return Room;

// })();