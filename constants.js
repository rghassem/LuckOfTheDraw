var constants = {
	cellSize : 64,
	roomWidth : 13,
	roomHeight : 10,
	dungeonWidth : 8,
	dungeonHeight : 8,
	dungeonSize : 15,
	actionQueueDepth : 5,
	actionDuration : 0.75, //in seconds
	slideDistance: 2,
	playerHealth: 100,
	enemyHealth: 20,

	font : { font: "20px Impact", fill: "#000000", align: "center" },
	mapfont : { font: "48px Impact", fill: "##000000", align: "center" },

	Direction : {
		Up    : {row: 0, col: -1, string: "Up", opposite: 'Down'},
		Down  : {row: 0, col: 1, string: "Down", opposite: 'Up'},
		Left  : {row: -1, col: 0,  string: "Left", opposite: 'Right'},
		Right : {row: 1, col: 0, string: "Right", opposite: 'Left'},

		UpRight   : {row: 1, col: -1, string: "UpRight"},
		UpLeft    :  {row: -1, col: -1, string: "UpLeft"},
		DownRight : {row: 1, col: 1, string: "DownRight"},
		DownLeft  : {row: -1, col: 1, string: "DownLeft"}
	}
}
