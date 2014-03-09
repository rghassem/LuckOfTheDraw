// (function(){

	/***********GameObject********************/
	var GameObject = function(sprite) {
		this.id = -1; //no id until placed in world
		this.sprite = sprite;
		this.x = 0;
		this.y = 0;

		var style = { font: constants.cellSize + "px monospace", fill:"#fff"};
		//The phaser actor
		this.actor = game.add.text(-1, -1, this.sprite, style);
	}

	GameObject.prototype.takeAction = function(room) {
		//No-op on a regular game object.
	}

	GameObject.prototype.update = function(row , col) {
		this.x = row * constants.cellSize;
		this.y = col * constants.cellSize;
	}

	GameObject.prototype.draw = function() {
		this.actor.x = this.x;
		this.actor.y = this.y;
	}


	/***********PlayerCharacter********************/
	var PlayerCharacter = function(sprite) {

		var gameObject = new GameObject(sprite);

		//GameObject.call(this, sprite);
		gameObject.actionQueue = [];

		gameObject.takeAction = function(room) {
		if(this.actionQueue.length > 0)
			{
				var action = this.actionQueue.shift();
				room.move(this, action.row, action.col);
			}
		}

		gameObject.move  = function(deltaRow, deltaCol) {
			this.actionQueue.push({
				row: deltaRow, 
				col: deltaCol
			});
		}

		return gameObject;
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