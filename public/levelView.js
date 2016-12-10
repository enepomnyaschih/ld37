SR.LevelView = function(level) {
	SR.LevelView._super.call(this);
	this.level = level; // SR.Level
	this.cells = new SR.Matrix(this.level.matrix.size); // SR.Matrix
	this.selectionPoint1 = new JW.Property(); // SR.Vector
	this.selectionPoint2 = new JW.Property(); // SR.Vector
};

JW.extend(SR.LevelView, JW.UI.Component, {
	renderRoot: function(el) {
		this.own(el.jwon("mousedown", this._onMouseDown, this));
		this.own($(window).jwon("mousemove", this._onMouseMove, this));
		this.own($(window).jwon("mouseup", this._onMouseUp, this));
	},

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
	},

	renderSelection: function(el) {
		this.own(new JW.Updater([this.selectionPoint1, this.selectionPoint2], function(p1, p2) {
			if (!p1 || !p2) {
				el.css("display", "none");
				return;
			}
			var min = SR.Vector.min(p1, p2);
			var max = SR.Vector.max(p1, p2);
			el.css("display", "");
			el.css("left",   min[0] + "px");
			el.css("top",    min[1] + "px");
			el.css("width",  (max[0] - min[0]) + "px");
			el.css("height", (max[1] - min[1]) + "px");
		}, this));
	},

	_onMouseDown: function(e) {
		e.preventDefault();
		var point = this._getPointByEvent(e);
		this.selectionPoint1.set(point);
		this.selectionPoint2.set(point);
	},

	_onMouseMove: function(e) {
		var point = this._getPointByEvent(e);
		this.selectionPoint2.set(point);
	},

	_onMouseUp: function(e) {
		var min = SR.Vector.min(this.selectionPoint1.get(), this.selectionPoint2.get());
		var max = SR.Vector.max(this.selectionPoint1.get(), this.selectionPoint2.get());
		var ijMin = SR.Vector.floor(SR.xyToIj(min));
		var ijMax = SR.Vector.floor(SR.xyToIj(max));
		this.level.units.each(function(unit) {
			unit.selected.set(unit.controllable && SR.Vector.isBetween(unit.ij.get(), ijMin, ijMax));
		}, this);
		this.selectionPoint1.set(null);
		this.selectionPoint2.set(null);
	},

	_getPointByEvent: function(e) {
		var offset = this.el.offset();
		return [e.pageX - offset.left, e.pageY - offset.top];
	}
});
