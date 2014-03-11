var Floor = function(spec){
	var that = {};
	var width = spec.width || constants.dungeonWidth;
	var height = spec.height || constants.dungeonHeight;
	var numRooms = spec.numRooms || constants.dungeonSize;
	var currentRow = util.getRandomInt(0, width);
	var currentCol = util.getRandomInt(0, height);
	var currentRoom = RoomFactory.generateRoom(currentRow, currentCol, 'main');
	var floor = [];

	//Initialize the game grid
	for(var i = 0; i < width; ++i)
	{
		var row = [];
		for(var j = 0; j < height; ++j)
		{
			row.push(null);
		}
		floor.push(row);
	}

	that.getCurrentRoom = function() {
		return currentRoom;
	}

	that.move = function (direction) {
		var nextRow = currentRow + direction.row;
		var nextCol = currentCol + direction.col;
		var nextRoom = floor[nextRow][nextCol];
		if(nextRoom) {
			currentRow = nextRow;
			currentCol = nextCol;
			currentRoom = nextRoom;
		}
	};

	var generateDungeon = function() {
		var rooms = [];
		//Choose random start location
		//Place starting room
		floor[currentRow][currentCol] = currentRoom;
		rooms.push(currentRoom);
		//Create other rooms
		for(var placed = 0; placed < numRooms; ++placed) {
			var availableExits = getAvailableExits();
			//Choose one at random
			var coord = availableExits[util.getRandomInt(0, availableExits.length)];
			//Create a room
			var newRoom = RoomFactory.generateRandomRoom(coord.row, coord.col);
			//Attach rooms to each other
			var room = floor[coord.oppositeRow, coord.oppositeCol];
			newRoom.getExits().push(util.Direction[coord.direction.opposite]);
			room.getExits().push(coord.direction);
			//Place room
			floor[coord.row][coord.col] = newRoom;
		}
		//Create final room
		var availableExits = getAvailableExits();
		//Choose one at random
		var coord = availableExits[util.getRandomInt(0, availableExits.length)];
		//Create a room
		var newRoom = RoomFactory.generateRoom(coord.row, coord.col, 'goal');
		//Attach rooms to each other
		var room = floor[coord.oppositeRow, coord.oppositeCol];
		newRoom.getExits().push(util.Direction[coord.direction.opposite]);
		room.getExits().push(coord.direction);
		//Place room
		floor[coord.row][coord.col] = newRoom;
	}

	var getAvailableExits = function(rooms) {
		var exits = [];
		rooms.forEach(function(room){
			var up = room.getUp();
			if(validCoords(up) && floor[up.row][up.col] === null){
				exits.push(up);
			}
			var down = room.getDown();
			if(validCoords(down) && floor[down.row][down.col] === null){
				exits.push(down);
			}
			var left = room.getLeft();
			if(validCoords(left) && floor[left.row][left.col] === null){
				exits.push(left);
			}
			var right = room.getRight();
			if(validCoords(right) && floor[right.row][right.col] === null){
				exits.push(right);
			}
		});
		return exits;
	}

	var validCoords = function(coord) {
		return coord.row >= 0 &&
			coord.col >= 0 &&
			coord.row < width &&
			coord.col < height
	}

	return that;
}