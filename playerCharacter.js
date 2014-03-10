
	/***********PlayerCharacter********************/
	var PlayerCharacter = function(spec) {

		var that = new Character(spec);
		var actionQueue = [];

		//Add an action to the end of the queue
		queueAction = function(action) {
			if(actionQueue.length < constants.actionQueueDepth) {
				actionQueue.push(action);  //Action is just a function. Could replace with Command pattern, with a do and undo function
			}
		}

		that.cancelAction = function() {
			actionQueue.pop();
		}

		that.clearQueue = function() {
			actionQueue = [];		
		}

		that.takeAction = function(room) {
			if(actionQueue.length > 0) {
				var action = actionQueue.shift();
				if(action) action();
			}
		}

		that.queueMove  = function(deltaRow, deltaCol) {
			queueAction( function() {
				that.room.move(that, deltaRow, deltaCol);
			});
		}

		that.shoot = function(direction) {
			//Get all the objects in line of the shot
			var pos = that.room.getPosition(that);
			var targets = that.room.findInLine(pos.row, pos.col, direction);
			//Grab the first one, and call its takeHit method
			if(targets.length > 0) {
				var sucker = targets.shift();
				if(sucker.takeHit) {
					sucker.takeHit();
				}
			}
		}

		return that;
	}

