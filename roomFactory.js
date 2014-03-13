var RoomFactory = (function (){
	var generateRandomRoom = function(row, col) {
		// Generate Walls
		var room = Room({row: row, col: col, width: constants.roomWidth, height: constants.roomWidth});
		// Return Room
		return room;
	}

	var generateRoom = function(row, col, type) {
		if(type === 'main') {
			return generateRoomFromString(row, col,
				".............\n" +
				"..##.....#e..\n" +
				"..##.....#e..\n" +
				".............\n" +
				".....##e.....\n" +
				".....##e.....\n" +
				".............\n" +
				"..##.....#e..\n" +
				"..##.....#e..\n" +
				".............\n"
			);
		} else {
			return generateRandomRoom(row, col);
		}
	};

	var generateRoomFromString = function(row, col, str) {
		var rows = str.split('\n');
		var room = Room({row: row, col: col, width: constants.roomWidth, height: constants.roomHeight});
		for (var i = 0; i < rows.length; ++i) {
			for (var j = 0; j < rows[i].length; ++j) {
				var c = rows[i].charAt(j);
				if(c === '#'){
					room.add(Wall({sprite:'wall',room: room}),j,i);
				}
				else if(c === 'e'){
					room.add(Enemy({sprite:'enemy',room: room}),j,i);
				}
			}
		}
		return room;
	};

	return {
		generateRandomRoom : generateRandomRoom,
		generateRoom : generateRoom
	}
}());