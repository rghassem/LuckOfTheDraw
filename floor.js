var Floor = function(spec){
	var spec = spec || {};
	var that = {};
	var width = spec.width || constants.dungeonWidth;
	var height = spec.height || constants.dungeonHeight;
	var numRooms = spec.numRooms || constants.dungeonSize;
	var currentRow = 5;
	var currentCol = 5;
	var currentRoom = RoomFactory.generateRoom(currentRow, currentCol, 'main');
	var floor = [];
	var player = null;

	//Initialize the game grid
	for(var i = 0; i < width; ++i)
	{
		var row = [];
		for(var col = 0; col < height; ++col)
		{
			row.push(null);
		}
		floor.push(row);
	}

	that.at = function (row, col) {
		return floor[row][col];
	}

	that.getNumRooms = function () {
		return numRooms;
	}

	that.addPlayer = function(row,col,gameObject) {
		player = gameObject;
		player.room = currentRoom;
		currentRoom.add(player, row, col);
	}

	that.getMap = function() {
		var str = '';
		for(var col = 0; col < height; col++) {
			for(var row = 0; row < width; row++) {
				if(row === currentRow && col === currentCol){
					str += 'C';
				} else if(floor[row][col]){
					str += 'R';
				} else {
					str += ' ';
				}
			}
			str += '\n';
		}
		return str;
	}

	that.getCurrentRoom = function() {
		return currentRoom;
	}

	that.move = function(direction) {
		var nextRow = currentRow + direction.row;
		var nextCol = currentCol + direction.col;
		var nextRoom = floor[nextRow][nextCol];
		if(nextRoom) {
			currentRoom.leave();
			currentRow = nextRow;
			currentCol = nextCol;
			currentRoom = nextRoom;
			currentRoom.initialize();
		}
	};

	that.canMove = function(direction) {
		for(var i = 0; i < currentRoom.getExits().length; i++) {
			if(currentRoom.getExits()[i] === direction){
				return true;
			}
		}
		return false;
	};

	var generateDungeon = function() {
		var rooms = [];
		//Choose random start location
		//Place starting room
		floor[currentRow][currentCol] = currentRoom;
		rooms.push(currentRoom);
		//Create other rooms
		for(var placed = 0; placed < numRooms; ++placed) {
			var availableExits = getAvailableExits(rooms);
			if(availableExits.length === 0)
				break;
			//Choose one at random
			var coord = availableExits[util.getRandomInt(0, availableExits.length-1)];
			//Create a room
			console.log(coord);
			var newRoom = RoomFactory.generateRoom(coord.row, coord.col, '');
			//Attach rooms to each other
			var room = floor[coord.oppositeRow][coord.oppositeCol];
			newRoom.getExits().push(constants.Direction[coord.direction.opposite]);
			room.getExits().push(coord.direction);
			//Place room
			floor[coord.row][coord.col] = newRoom;
			rooms.push(newRoom);
		}
	}

	var showDoors = function() {
		floor.forEach(function(floorRow){
			floorRow.forEach(function(room){
				if(room) {
					room.getExits().forEach(function(direction){
						console.log(direction);
						if(direction === constants.Direction.Up) {
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Up}),5,0);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Up}),6,0);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Up}),7,0);
						}
						if(direction === constants.Direction.Down) {
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Down}),5,constants.roomHeight-1);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Down}),6,constants.roomHeight-1);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Down}),7,constants.roomHeight-1);
						}
						if(direction === constants.Direction.Left) {
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Left}),0,4);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Left}),0,5);
						}
						if(direction === constants.Direction.Right) {
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Right}),constants.roomWidth-1,4);
							room.add(Door({sprite:'wall',room: room, direction: constants.Direction.Right}),constants.roomWidth-1,5);
						}
					});
				}
			});
		});
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

	generateDungeon();
	showDoors();

	return that;
}