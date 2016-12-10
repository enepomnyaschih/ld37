SR.MapView = function(map) {
	SR.MapView._super.call(this);
	this.map = map; // SR.Map
	this.cells = new SR.Matrix(this.map.matrix.size); // SR.Matrix
};

JW.extend(SR.MapView, JW.UI.Component, {
	renderMatrix: function(el) {
		var map = this.map;
		for (var i = 0; i < map.matrix.size; ++i) {
			var rowEl = jQuery('<div class="sr-map-row"></div>');
			for (var j = 0; j < map.matrix.size; ++j) {
				var ij = [i, j];
				var cellEl = jQuery('<div class="sr-map-cell"></div>');
				this.cells.setCell(ij, cellEl);
				cellEl.attr("sr-i", i);
				cellEl.attr("sr-j", j);
				cellEl.attr("sr-type", this.map.matrix.getCell(ij));
				rowEl.append(cellEl);
			}
			rowEl.append('<div class="sr-clear"></div>');
			el.append(rowEl);
		}
	},

	renderObstacles: function() {
		return this.own(this.map.obstacles.$$mapObjects(function(obstacle) {
			return new SR.ObstacleView(obstacle);
		}));
	}
});
