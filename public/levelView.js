SR.LevelView = function(level) {
	SR.LevelView._super.call(this);
	this.level = level; // SR.Level
	this.cells = new SR.Matrix(this.level.matrix.size); // SR.Matrix
};

JW.extend(SR.LevelView, JW.UI.Component, {
	renderMatrix: function(el) {
		var level = this.level;
		for (var i = 0; i < level.matrix.size; ++i) {
			var rowEl = jQuery('<div class="sr-level-row"></div>');
			for (var j = 0; j < level.matrix.size; ++j) {
				var ij = [i, j];
				var cellEl = jQuery('<div class="sr-level-cell"></div>');
				this.cells.setCell(ij, cellEl);
				cellEl.attr("sr-i", i);
				cellEl.attr("sr-j", j);
				cellEl.attr("sr-type", this.level.matrix.getCell(ij));
				rowEl.append(cellEl);
			}
			rowEl.append('<div class="sr-clear"></div>');
			el.append(rowEl);
		}
	},

	renderObstacles: function() {
		return this.own(this.level.obstacles.$$mapObjects(function(obstacle) {
			return new SR.ObstacleView(obstacle);
		}, this));
	},

	renderUnits: function() {
		return this.own(this.level.units.$$mapObjects(function(unit) {
			return new SR.UnitView(unit);
		}, this));
	}
});
