// (function(){

	/***********GameObject********************/
	var GameObject = function(spec) {
		var room = spec.room || {};
		var that = {};
		var id = -1; //no id until placed in world
		var row, col;
		var sprite = spec.sprite || '@';
		var x = 0;
		var y = 0;

		var style = { font: constants.cellSize + "px monospace", fill:"#fff"};
		//The phaser actor
		var actor = game.add.text(-1, -1, sprite, style);

		that.getId = function() {
			return id;
		}

		that.setId = function(newid) {
			id = newid;
		}

		that.update = function() {
			var rowCol = room.getPosition(this);
			var row = rowCol.row;
			var col = rowCol.col;

			x = row * constants.cellSize;
			y = col * constants.cellSize;

			actor.x = x;
			actor.y = y;
		}

		return that;
	};

	/***********PlayerCharacter********************/
	var PlayerCharacter = function(spec) {

		var that = new GameObject(spec);
		var actionQueue = [];

		that.takeAction = function(room) {
			if(actionQueue.length > 0) {
				var action = actionQueue.shift();
				room.move(that, action.row, action.col);
			}
		}

		that.move  = function(deltaRow, deltaCol) {
			actionQueue.push({
				row: deltaRow, 
				col: deltaCol
			});
		}

		return that;
	}

	/***********Enemy********************/
	var Enemy = function(spec) {

		var that = new GameObject(spec);
		var actionQueue = [];

		that.takeAction = function(room) {
			if(actionQueue.length > 0) {
				var action = actionQueue.shift();
				room.move(this, action.row, action.col);
			}
		}

		that.move  = function(deltaRow, deltaCol) {
			actionQueue.push({
				row: deltaRow,
				col: deltaCol
			});
		}

		return that;
	}

	//TODO: Try to use real prototype inheritence?

	//PlayerCharacter.prototype = new GameObject();

	/*PlayerCharacter.prototype.constructor = PlayerCharacter; //Yay JavaScript!!

	PlayerCharacter.prototype.takeAction = function(room) {
		if(this.actionQueue.length > 0)
		{
			var action = this.actionQueue.shift();
			room.move(this, action.row, action.col);
		}
	}
	

	PlayerCharacter.prototype.move = function(deltaRow, deltaCol) {
		this.actionQueue.push({
			row: deltaRow, 
			col: deltaCol
		});
	}*/

// 	return GameObject;

// })();