
//An overlay overlays UI Markers over the cells of a room. A Marker should have the following methods: setPosition(x, y), getWidth(), getHeight(), blend(anotherMarker) and destroy().
var Overlay = function() {
	var that = this;

	var markerCount = 0;
	var markers = [];
	var markerPos = {};


	that.clear = function() {
		markerCount = 0;
		while(markers.length > 0)
			markers.pop().destroy();
		markerPos = {};
	}

	that.placeMarker = function(row, col, marker) {
		marker.row = row;
		marker.col = col;
		markers.push( marker );
		markerCount++;
		
		var x = util.gridToPixel(row) + ( constants.cellSize/2 ) - marker.getWidth()/2 ;
		var y = util.gridToPixel(col) + ( constants.cellSize/2 ) - marker.getHeight()/2;

		if(markerPos[""+row+col] && !markerPos[""+row+col].destroyed ) {
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
		this.destroyed = false;

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
			this.destroyed = true;
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

		this.destroyed = false;

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
			this.destroyed = true;
		}

		this.blend = function(otherMarker, x, y) {
			if(otherMarker.text)
				this.text.content = otherMarker.text.content + "," + this.text.content;
			otherMarker.destroy();
			currentMoveCount++; //still the blended one
			this.setPosition(x, y);
		}
	}

	return Constructor;

})()