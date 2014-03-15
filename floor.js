var Floor = function(spec){
	var spec = spec || {};
	var that = {};
	var width = spec.width || constants.dungeonWidth;
	var height = spec.height || constants.dungeonHeight;
	var numRooms = spec.numRooms || constants.dungeonSize;
	var clearedRooms = 0;
	var currentRow = 5;
	var currentCol = 5;
	var currentRoom = RoomFactory.generateRoom(currentRow, currentCol, 'main');
	var floor = [];
	var player = spec.player || null;
	var eventSequence = spec.eventSequence || null;

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
		if(gameObject)
			player = gameObject;
		currentRoom.add(player, row, col);
		player.room = currentRoom;
		currentRoom.playerObjectId = player.getId();
	}

	that.getMap = function() {
		var str = '';
		for(var col = 0; col < height; col++) {
			for(var row = 0; row < width; row++) {
				if(row === currentRow && col === currentCol){
					str += 'C'
				} else if(floor[row][col]) {
					var r = floor[row][col];
					var exits = r.getExits();
					var mapString = '';
					//It's 4 am.
					exits.forEach(function(entry) {
						switch(entry) {
							case constants.Direction.Up:
								mapString+= 'U';
								break;
						}
					});
					exits.forEach(function(entry) {
						switch(entry) {
							case constants.Direction.Down:
								mapString+= 'D';
								break;
						}
					});
					exits.forEach(function(entry) {
						switch(entry) {
							case constants.Direction.Left:
								mapString+= 'L';
								break;
						}
					});
					exits.forEach(function(entry) {
						switch(entry) {
							case constants.Direction.Right:
								mapString+= 'R';
								break;
						}
					});
					str += constants.MapCharacters[mapString];
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

	that.setTurn = function(turn) {
		eventSequence = turn;
	}

	that.move = function(direction) {
		var nextRow = currentRow + direction.row;
		var nextCol = currentCol + direction.col;
		var nextRoom = floor[nextRow][nextCol];
		if(nextRoom) {
			currentRoom.leave();
			currentRow = nextRow;
			currentCol = nextCol;
			var oldRoom = currentRoom;
			currentRoom = nextRoom;
			switch(direction) {
				case constants.Direction.Up:
					that.addPlayer(oldRoom.getPosition(player).row, constants.roomHeight - 2);
					break;
				case constants.Direction.Down:
					that.addPlayer(oldRoom.getPosition(player).row, 1);
					break;
				case constants.Direction.Left:
					that.addPlayer(constants.roomWidth-2, oldRoom.getPosition(player).col);
					break;
				case constants.Direction.Right:
					that.addPlayer(1, oldRoom.getPosition(player).col);
					break;
			}
			currentRoom.playerObjectId = player.getId();
			eventSequence.reset();
			currentRoom.initialize(currentRoom.cleared);
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

	var showDoors = function(room) {
		if(room) {
			room.getExits().forEach(function(direction){
				if(direction === constants.Direction.Up) {
					var d = Door({sprite:'doorUp',floor: that, direction: constants.Direction.Up});
					room.add(d,5,0);
					d.setActive(true);
					pos = {row: 6, col:0};
					d = Door({sprite:'doorUp',floor: that, direction: constants.Direction.Up});
					room.add(d,6,0);
					d.setActive(true);
					d = Door({sprite:'doorUp',floor: that, direction: constants.Direction.Up});
					room.add(d,7,0);
					d.setActive(true);
				}
				if(direction === constants.Direction.Down) {
					var d = Door({sprite:'doorDown',floor: that, direction: constants.Direction.Down});
					room.add(d,5,constants.roomHeight-1);
					d.setActive(true);
					d = Door({sprite:'doorDown',floor: that, direction: constants.Direction.Down});
					room.add(d,6,constants.roomHeight-1);
					d.setActive(true);
					d = Door({sprite:'doorDown',floor: that, direction: constants.Direction.Down});
					room.add(d,7,constants.roomHeight-1);
					d.setActive(true);
				}
				if(direction === constants.Direction.Left) {
					var d = Door({sprite:'doorLeft',floor: that, direction: constants.Direction.Left});
					room.add(d,0,4);
					d.setActive(true);
					d = Door({sprite:'doorLeft',floor: that, direction: constants.Direction.Left});
					room.add(d,0,5);
					d.setActive(true);
				}
				if(direction === constants.Direction.Right) {
					var d = Door({sprite:'doorRight',floor: that, direction: constants.Direction.Right});
					room.add(d,constants.roomWidth-1,4);
					d.setActive(true);
					d = Door({sprite:'doorRight',floor: that, direction: constants.Direction.Right});
					room.add(d,constants.roomWidth-1,5);
					d.setActive(true);
				}
			});
		}
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

	that.update = function() {
		currentRoom.getGameObjects().forEach(function(gameObject){
			if(currentRoom.cleared && gameObject.getType() !== 'Enemy'){
				gameObject.update();
			} else if (!currentRoom.cleared){
				gameObject.update();
			}
		});
	}

	that.checkGameStatus = function() {
		console.log("in checkGameStatus Enemies="+currentRoom.countObjects('Enemy')+" Doors="+currentRoom.countObjects('Door'));
		if(currentRoom.countObjects('Enemy') === 0 && currentRoom.countObjects('Door') === 0) {
			console.log('Enemies Cleared')
			clearedRooms++;
			currentRoom.cleared = true;
			showDoors(currentRoom);
		}
		if(clearedRooms === numRooms) {
			//Win
			game.add.sprite(0,0, "winScreen");
		}
		if(currentRoom.countObjects('Player') === 0) {
			
		}
	}

	generateDungeon();

	return that;
}