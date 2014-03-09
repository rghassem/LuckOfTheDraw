// (function(){

	/***********GameObject********************/
	var GameObject = function(spec) {

		var that = {};
		var id = -1; //no id until placed in world
		var row, col;
		var sprite = spec.sprite || '@';
		var x = 0;
		var y = 0;

		var style = { font: constants.cellSize + "px monospace", fill:"#fff"};
		//The phaser actor
		var actor = game.add.text(-1, -1, sprite, style);

		that.room = spec.room || {};

		that.getId = function() {
			return id;
		}

		that.setId = function(newid) {
			id = newid;
		}

		that.update = function() {
			var rowCol = that.room.getPosition(this);
			var row = rowCol.row;
			var col = rowCol.col;

			x = row * constants.cellSize;
			y = col * constants.cellSize;

			actor.x = x;
			actor.y = y;
		}

		return that;
	};



	var Wall = function(spec) {
		var that = new GameObject(spec);
		return that;
	};
// })();