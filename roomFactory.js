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
		} else if(type === 'goal') {
			return generateRandomRoom(row, col);
		} else {
			return generateRandomRoom(row, col);
		}
	};

	var generateRoomFromString = function(row, col, str) {
		var rows = str.split('\n');
		var room = Room({row: row, col: col, width: constants.roomWidth, height: constants.roomHeight});
		for (var i = 0; i < rows.length; ++i) {
			alert(rows[i]);
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