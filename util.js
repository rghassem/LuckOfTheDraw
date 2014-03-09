var util = (function(){
	var getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		getRandomInt : getRandomInt
	}
})();
