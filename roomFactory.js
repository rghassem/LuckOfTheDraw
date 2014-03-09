var RoomFactory = (function (){
	var generateRandomRoom = function() {
		// Generate Walls
		var room = Room({width: constants.roomWidth, height: constants.roomWidth});
		for(var i = 0; i < 20; ++i) {
			var row = util.getRandomInt(0, constants.roomWidth - 1);
			var col = util.getRandomInt(0, constants.roomHeight - 1);
			if(!room.at(row,col)) {
				room.add(Wall({sprite: '#', room: room}), row, col);
				console.log("created wall at "+row+" "+col);
			}
			else {
				console.log('gameobject at position'+room.at(row,col));
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
			else {
				console.log('gameobject at position',row,col);
			}
		}
		// Return Room
		return room;
	}

	return {
		generateRandomRoom : generateRandomRoom
	}
}());