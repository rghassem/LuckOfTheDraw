var constants = {
	cellSize : 64,
	roomWidth : 18, 
	roomHeight : 12,
	actionQueueDepth : 5,
	actionDuration : 0.5, //in seconds

	font : { font: "12px Arial", fill: "#ff0044", align: "center" },

	Direction : {
		Up    : {row: 0, col: -1, opposite: 'Down'},
		Down  : {row: 0, col: 1, opposite: 'Up'},
		Left  : {row: -1, col: 0, opposite: 'Right'},
		Right : {row: 1, col: 0, opposite: 'Left'},

		UpRight   : {row: 1, col: -1},
		UpLeft    :  {row: -1, col: -1},
		DownRight : {row: 1, col: 1},
		DownLeft  : {row: -1, col: 1}
	}
}