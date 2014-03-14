
//An overlay overlays UI Markers over the cells of a room. A Marker should have the following methods: setPosition(x, y), getWidth(), getHeight(), blend(anotherMarker) and destroy().
var Overlay = function(room) {
	var that = this;
	that.room = room;

	var markerCount = 0;
	var markers = [];
	var markerPos = {};

	function lastMarker() {
		if(markers.length == 0)
			return null;
		else
			return markers[markers.length - 1];
	}

	that.isValidMove = function(row, col) {
		if( lastMarker() ) {
			return util.distance(row, col) === 1;  
		}
		else return false;
	}

	that.clearOverlay = function() {
		that.clearmarkers();
		that.clearShootMarkers();
	}

	that.clearMarkers = function() {
		markerCount = 0;
		markers = [];
	}

	that.placeMarker = function(row, col, marker) {
		marker.row = row;
		marker.col = col;
		markers.push( marker );
		markerCount++;
		
		var x = util.gridToPixel(row) + ( constants.cellSize/2 ) - marker.getWidth()/2 ;
		var y = util.gridToPixel(col) + ( constants.cellSize/2 ) - marker.getHeight()/2;

		if(markerPos[""+row+col]) {
			marker.blend(markerPos[""+row+col], x, y);
		}
		else {
			marker.setPosition(x, y);
		}
		markerPos[""+row+col] = marker;

	}

	that.popMarker = function() {
		if(markers.length <= 0)
			return;
		markers.pop().destroy();
		markerCount--;
	}

	that.shiftMarker = function() {
		if(markers.length <= 0)
			return;
		markers.shift().destroy();
		markerCount--;
	}

	that.markerCount= function(){
		return markerCount;
	}


	return that;
}



var ShootMarker = (function() {

	var Constructor = function(group) {

		var sprite = group.create(-1, -1, 'crosshair');
		sprite.renderable = false;

		this.getHeight = function() {
			return sprite.bounds.height;
		}

		this.getWidth = function() {
			return sprite.bounds.width;
		}

		this.setPosition = function(x, y) {
			sprite.x = x;
			sprite.y = y;
			sprite.renderable = true;
		}

		this.destroy = function() {
			sprite.destroy();
		}

		this.blend = function(otherMarker, x, y) {
			this.setPosition(x, y);
		}
	}

	return Constructor;

})();

var MoveMarker = (function() {

	var currentMoveCount = 0;

	var Constructor = function(group) {

		var size = 32;
		var style = {
			font: size + "px monospaced fill",
			fill: "#fff"
		}

		++currentMoveCount;
		this.text = game.add.text(-1, -1, "" + currentMoveCount, style);
		this.text.renderable = false;
		group.add(this.text);

		this.getHeight = function() {
			return size;
		}

		this.getWidth = function() {
			return size;
		}

		this.setPosition = function(x, y) {
			this.text.x = x;
			this.text.y = y;
			this.renderable = true;
		}

		this.destroy = function() {
			this.text.destroy();
			currentMoveCount--;
		}

		this.blend = function(otherMarker, x, y) {
			this.text.content = otherMarker.text.content + "," + this.text.content;
			otherMarker.destroy();
			currentMoveCount++; //still the blended one
			this.setPosition(x, y);
		}
	}

	return Constructor;

})()