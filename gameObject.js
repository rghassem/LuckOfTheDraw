// (function(){

	/***********GameObject********************/
	var GameObject = function(sprite) {
		this.id = -1; //no id until placed in world
		this.sprite = sprite;
		this.x = 0;
		this.y = 0;
	}

	GameObject.prototype.takeAction = function(room) {
		//No-op on a regular game object.
		room.move(id, deltaX, deltaY); //Test code
	}

	GameObject.prototype.update = function(row , col) {
		this.x = row * constants.cellSize;
		this.y = col * constants.cellSize;
	}

	GameObject.prototype.draw = function() {
		var style = { font: constants.cellSize + "px monospace", fill:"#fff"};
		game.add.text( this.x, this.y, this.sprite, style);
	}


	/***********PlayerCharacter********************/
	var PlayerCharacter = function(sprite) {
		GameObject.call(this, sprite);

		this.actionQueue = [];
	}

	PlayerCharacter.prototype = new GameObject();
	PlayerCharacter.prototype.constructor = PlayerCharacter; //Yay JavaScript!!

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
	}
// 	return GameObject;

// })();