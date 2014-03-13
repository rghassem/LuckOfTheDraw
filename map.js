var Map = function(spec) {
	var that = {};
	var floor = spec.floor || {};
	var tiles = [];

	that.render = function(mapX,mapY) {
		for(var row = 0; row < floor.getNumRooms(); ++row) {
			for(var col = 0; row < floor.getNumRooms(); ++col) {
				if(row === floor.getCurrentRoom().getRow() &&
					col === floor.getCurrentRoom().getCol()) {
					tiles[row][col].beginFill(0xFF00FF, 1);
					tiles[row][col].drawRect((row * constants.cellSize) + mapX + 8,
						(col * constants.cellSize) + mapY + 8,
						constants.mapTileSize, constants.mapTileSize);
				}
				else if(floor.at(row,col)) {
					tiles[row][col].beginFill(0xFFFFFF, 1);
					tiles[row][col].drawRect((row * constants.cellSize) + 8, (col * constants.cellSize) + 8,
						constants.mapTileSize, constants.mapTileSize);
				}
			}
		}
	}

	return that;
}