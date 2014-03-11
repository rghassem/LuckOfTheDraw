
/* 
EventSequence queues up a series of events that need to be executed in order and over time. You can add events to the running sequence, each with a delay in seconds
 * Add events with add(event, delay). Delay defaults to 0;
 * Start the sequence with start();
 * Check if its finished with isRunning()
 * Cancel all further events with clear(). clear should also be used to empty the queue if not running.
*/

var EventSequence = function(spec) {

	var events;
	var currentEvent;
	var isRunning;

	function init() {
		events = [];
		currentEvent = 0;
		isRunning = false;
	}

	init();

	this.isRunning = function() {
		return isRunning;
	}

	this.add = function(eventCallback, delaySecs) {
		delaySecs = delaySecs || 0;
		delaySecs *= 1000; //convert to seconds
		events.push({ delay: delaySecs, callback: eventCallback });
	} 

	this.start = function() {
		if(events.length === 0 || isRunning) return;

		setTimeout(doNextEvent, events[currentEvent].delay); //Boy, it sure would be great if we had some sort of game engine with its own functioning damn timer. 
		isRunning = true;
	}

	this.clear = init;

	function doNextEvent() {
		events[currentEvent].callback();
		++currentEvent;
		if(currentEvent < events.length)
			setTimeout(doNextEvent, events[currentEvent].delay)
		else
		{
			isRunning = false;
			currentEvent = 0;
		}
	}

}

//TODO: Can we do this with Phaser.Timer? Probably will have better performance/reliability. I tried but is wasn't working! Attempt below:
/*
        //Turn logic not working
        var turnInProgress = false;
        function turn(actionsPerTurn) {
            turnInProgress = true;

            //Create a timer that will execute each nextAction command, with an appropriate delay for gameObjects to catch up.
            var timer = new Phaser.Timer(game, false);
            function finalEvent() {
                turnInProgress = false;
                timer.destroy();
            }
            var action = mainRoom.nextAction;
            var delay = constants.actionDuration * 1000;
            for(var i = 0; i < constants.actionQueueDepth; ++i)
            {
                timer.add(i * delay, action);
            }
            timer.add(delay * constants.actionQueueDepth, finalEvent);
            timer.start();
        }

*/