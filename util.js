var util = (function(){
	var getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var gridToPixel = function(cell) {
		return constants.cellSize * cell;
	}

	var pixelToGrid = function(pixels) {
		return Math.floor(cell / constants.cellSize);
	}

	var manhattenDistance = function(fromRow, fromCol, toRow, toCol) {
		var biggerRow = Math.max(fromRow, toRow);
		var smallerRow = (biggerRow === fromRow) ? toRow : fromRow;

		var biggerCol = Math.max(fromCol, toCol);
		var smallerCol = (biggerCol === fromCol) ? toCol : fromCol;

		return {
			row: Math.abs(biggerRow - smallerRow);
			col: Math.abs(biggerCol - smallerCol);
		}
	}

	return {
		getRandomInt : getRandomInt,
		gridToPixel : gridToPixel,
		pixelToGrid : pixelToGrid
	}
})();
