
	/***********PlayerCharacter********************/
	var PlayerCharacter = function(spec) {
		spec.type = spec.type || 'PlayerCharacter';
		var that = new Character(spec);
		var actionQueue = [];

		var gun = spec.gun || new Gun();

		that.setGun= function(newGun) {
			gun = newGun;
		}

		//Actions can be queued up by the player during Planning Phase, and executed during Action Phase
		var Action = function(type, callback) {
			this.type = type;
			this.do = callback;
		}

		//Add an action to the end of the queue
		queueAction = function(action) {
			if(actionQueue.length < constants.actionQueueDepth) {
				actionQueue.push(action);  
			}
		}

		that.cancelAction = function() {
			actionQueue.pop();
		}

		that.clearQueue = function() {
			actionQueue = [];		
		}


		that.queueMove  = function(deltaRow, deltaCol) {
			queueAction( new Action( "move",  function() {
					that.room.move(that, deltaRow, deltaCol);
			}));
		}

		that.queueShot = function(direction) {
			queueAction( new Action( "shoot",  function() {
					if(gun !== null)
						gun.shoot(that, direction);
			}));
		}

		that.slide = function(direction) {
			that.clearQueue();
			queueAction( new Action( "move", function() {
				for(var i = 0; i < constants.slideDistance; ++i)
					that.room.move(that, direction.row, direction.col);
			}));
		}

		//Consume the queue on room actions. Consume moves during the main action callback...
		that.takeAction = function(preActionResult) {
			//take move actions during main action phase
			if(actionQueue.length > 0 && actionQueue[0] && actionQueue[0].type === "move") {
					actionQueue.shift().do();
					return true;
			}
		}

		//...and consume shoots during the next one, after all moves are resolved. Use the result from takeAction to tell if a move was already made (and skip if so)
		that.takePostAction = function(mainActionResult) {
			if(!mainActionResult && actionQueue.length > 0 && actionQueue[0] && actionQueue[0].type === "shoot") {
				actionQueue.shift().do();
			}
		}


		return that;
	}

