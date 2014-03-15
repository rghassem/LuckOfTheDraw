var constants = {
	cellSize : 64,
	roomWidth : 13,
	roomHeight : 10,
	dungeonWidth : 6,
	dungeonHeight : 6,
	dungeonSize : 8,
	actionQueueDepth : 5,
	actionDuration : 0.75, //in seconds
	actionMoveFraction : 0.5, //how much of actionDuration to use for movement (seconds)
	actionShootFraction: 0.5, //how much of actionDuration to use for shootin' (seconds)
	slideDistance: 2,
	playerHealth: 100,
	enemyHealth: 20,

	titleOverlayDuration: 2.5, //seconds

	font : { font: "20px Blackadder ITC", fill: "#000000", align: "center" },
	mapfont : { font: "40px Courier", fill: "##000000", align: "center" },
	displayfont: { font: "58px Blackadder ITC", fill: "#000000", align: "center" },
	instructionFont: {font: "24px Impact", fill: "#000000", align: "left" },
	overlayFontRed: {font: "48px Impact", fill: "#C13131", align: "center" },
	overlayFontBlack: {font: "48px Impact", fill: "#000000", align: "center" },

	Direction : {
		Up    : {row: 0, col: -1, string: "Up", opposite: 'Down'},
		Down  : {row: 0, col: 1, string: "Down", opposite: 'Up'},
		Left  : {row: -1, col: 0,  string: "Left", opposite: 'Right'},
		Right : {row: 1, col: 0, string: "Right", opposite: 'Left'},

		UpRight   : {row: 1, col: -1, string: "UpRight"},
		UpLeft    :  {row: -1, col: -1, string: "UpLeft"},
		DownRight : {row: 1, col: 1, string: "DownRight"},
		DownLeft  : {row: -1, col: 1, string: "DownLeft"}
	},

	MapCharacters: {
		U: '▣',
		D: '▣',
		L: '▣',
		R: '▣',
		UD: '║',
		UL: '╝',
		UR: '╚',
		DL: '╗',
		DR: '╔',
		LR: '═',
		UDL: '╣',
		UDR: '╠',
		ULR: '╩',
		DLR: '╦',
		UDLR: '╬'
	}
}
