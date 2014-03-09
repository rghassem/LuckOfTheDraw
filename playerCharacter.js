
	/***********PlayerCharacter********************/
	var PlayerCharacter = function(spec) {

		var that = new GameObject(spec);
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
			actionQueue.push( function() {
				that.room.move(that, deltaRow, deltaCol);
			});
		}

		return that;
	}

