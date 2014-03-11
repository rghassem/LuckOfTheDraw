var util = (function(){
	var getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var gridToPixel = function(cell) {
		return constants.cellSize * cell;
	}

	var pixelToGrid = function(pixels) {
		return Math.floor(pixels / constants.cellSize);
	}

	var gridToPixel2D = function(gridPos) {
		return {
			x: gridToPixel(gridPos.row),
			y: gridToPixel(gridPos.col)
		}
	}

	var pixelToGrid2D = function(pos) {
		return {
			row: pixelToGrid(pos.row),
			col: pixelToGrid(pos.col)
		}
	}

	var gridToPixelCenter2D = function(cell) {
		return {
			x: gridToPixel(cell.row) + constants.cellSize/2,
			y: gridToPixel(cell.col) - constants.cellSize/2
		}
	}

	var manhattanDistance = function(fromRow, fromCol, toRow, toCol) {
		var biggerRow = Math.max(fromRow, toRow);
		var smallerRow = (biggerRow === fromRow) ? toRow : fromRow;

		var biggerCol = Math.max(fromCol, toCol);
		var smallerCol = (biggerCol === fromCol) ? toCol : fromCol;

		return Math.abs(biggerRow - smallerRow) + Math.abs(biggerCol - smallerCol);
	}

	return {
		getRandomInt : getRandomInt,

		gridToPixel : gridToPixel,
		pixelToGrid : pixelToGrid,
		gridToPixel2D : gridToPixel2D,
		pixelToGrid2D : pixelToGrid2D,
		gridToPixelCenter2D : gridToPixelCenter2D,

		manhattanDistance : manhattanDistance
	}
})();
