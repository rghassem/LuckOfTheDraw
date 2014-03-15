
	/***********PlayerCharacter********************/
	var PlayerCharacter = function(spec) {
		spec.type = spec.type || 'PlayerCharacter';
		var that = new Character(spec);
		var actionQueue = [];
		var chanceModifier = .9;
		var gun = spec.gun || new Gun();
		var missSoundEffect = spec.missSoundEffect || "characterMiss";
		var missSound = game.add.audio(missSoundEffect);

		that.setGun= function(newGun) {
			gun = newGun;
		}

		that.takeHit = function() {
			var health = that.getHealth();
			var chanceToHit = health / constants.playerHealth * chanceModifier;
			var roll = Math.random();
			if (roll < chanceToHit){
				//Miss
				console.log('miss');
				chanceModifier = chanceModifier - .15;
				missSound.play();
			} else {
				health = health - 20;
				that.setHealth(health);
				if(health <= 0) {
					that.room.remove(that);
					that.setActive(false);
					that.actor.x = -1 * constants.cellSize;
					that.actor.y = -1 * constants.cellSize;
				}

				that.hitSound.play();
			}
		}

		that.clearActionQueue = function() {
			actionQueue = [];
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

