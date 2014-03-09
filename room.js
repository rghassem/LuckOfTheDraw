// var GameObject = require(["gameObject"]);

// (function(){

	/***********Room********************/
	var Room = function(width, height) {

		this.width = width;
		this.height = height;
		this.objects = [];

		this.grid = [];
		this.positions = [];

		//Initialize the game grid
		for(var i = 0; i < width; ++i)
		{
			var inner = [];
			this.grid.push(inner);
			for(var j = 0; j < height; ++j)
			{
				inner.push(null);
			}
		}

	}

	Room.prototype.add = function(gameObject, row, col) {
		gameObject.id = this.objects.length;

		this.objects.push(gameObject);
		this.positions.push({row: row, col: col});

		this.grid[row][col] = gameObject;
	}

	Room.prototype.at= function(row, col) {
		return this.grid[row, col];
	}

	Room.prototype.getPosition = function(gameObjectID) {
		if(gameObjectID < this.positions.length && this.positions[gameObjectID] )
			return this.positions[gameObjectID];
		else return null;
	}

	Room.prototype.move = function(gameObject, deltaX, deltaY) {
		if(gameObject === null) return false;
		var currentGridPos = this.getPosition(gameObject.id);
		var toRow = currentGridPos.row + deltaX;
		var toCol = currentGridPos.col + deltaY;
		if( toRow < 0 || toCol < 0 || toRow >= this.grid.length || toCol >= this.grid[0].length)
			return false;

		if(this.grid[toRow][toCol] === null) {
			this.grid[toRow][toCol] = gameObject;
			this.grid[currentGridPos.row][currentGridPos.col] = null;
			this.positions[gameObject.id] = {row: toRow, col: toCol};
			return true;
		}
		else return false;
	}

	Room.prototype.getGameObjectById = function(id) {
		if(id < this.objects.length && this.objects[id] !== null )
			return this.objects[id];
		else return null;
	}

	Room.prototype.nextAction = function() {
		for(var i = 0; i < this.objects.length; ++i) 
		{
			var go = this.objects[i];
			if(go.takeAction) {
				go.takeAction(this);
			}
		}
	}

	Room.prototype.update = function () {
		for(var i = 0; i < this.grid.length; ++i) 
		{
			for(var j = 0; j < this.grid[i].length; ++j)
			{
				var gameObject = this.grid[i][j];
				if(gameObject)
					gameObject.update(i, j);
			}
		}
	}

	Room.prototype.draw = function () {
		this.objects.forEach(function(gameObject){
			gameObject.draw();
		});
	}

	// return Room;

// })();