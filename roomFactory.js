var RoomFactory = (function (){
	var generateRandomRoom = function(row, col) {
		// Generate Walls
		var room = Room({row: row, col: col, width: constants.roomWidth, height: constants.roomWidth});
		for(var i = 0; i < 20; ++i) {
			var row = util.getRandomInt(0, constants.roomWidth - 1);
			var col = util.getRandomInt(0, constants.roomHeight - 1);
			if(!room.at(row,col)) {
				room.add(Wall({sprite: '#', room: room}), row, col);
				console.log("created wall at "+row+" "+col);
			}
		}
		// Generate Enemies
		for(var i = 0; i < 20; ++i) {
			var row = util.getRandomInt(0, constants.roomWidth - 1);
			var col = util.getRandomInt(0, constants.roomHeight - 1);
			if(!room.at(row,col)) {
				room.add(Enemy({sprite:'e', room: room}),
					util.getRandomInt(1,constants.roomWidth-1), util.getRandomInt(1,constants.roomHeight-1));
				console.log("created enemy at "+row+" "+col);
			}
		}
		// Return Room
		return room;
	}

	var generateRoom = function(row, col, type) {
		if(type === 'main') {
			return generateRoomFromString(row, col,
				"............\n" +
				"............\n" +
				"..####..##..\n" +
				"..####..##..\n" +
				"..##eeee....\n" +
				"..##eeee....\n" +
				"..##eeee##..\n" +
				"..##....##..\n" +
				"..##....##..\n" +
				"..##....##..\n" +
				"............\n" +
				"............\n"
			);
		} else if(type === 'goal') {
			return generateRandomRoom(row, col);
		} else {
			return generateRandomRoom(row, col);
		}
	};

	var generateRoomFromString = function(row, col, str) {
		var rows = str.split('\n');
		var room = Room({row: row, col: col, width: constants.roomWidth, height: constants.roomWidth});
		for (var i = 0; i < rows.length; ++i) {
			for (var j = 0; j < rows[i].length; ++j) {
				var c = rows[i].charAt(j);
				if(c === '#'){
					room.add(Wall({sprite:'#',room: room}),i,j);
				}
				else if(c === 'e'){
					room.add(Enemy({sprite:'e',room: room}),i,j);
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