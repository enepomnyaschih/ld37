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
		this.own(el.jwon("contextmenu", JW.UI.preventDefault));
		this.own($(window).jwon("keypress", this._onKeyPress, this));
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
			return unit.type.viewCreator(unit);
		}, this));
	},

	renderFlies: function() {
		return this.own(this.level.flies.$$mapObjects(function(fly) {
			return new SR.FlyView(fly);
		}, this));
	},

	renderWebCells: function(el) {
		this.own(this.level.webCells.createMapper({
			createItem: function(ij) {
				var cellEl = $('<div class="sr-web-cell"></div>');
				var xy = SR.ijToXy(ij);
				cellEl.css("left", xy[0] + "px");
				cellEl.css("top",  xy[1] + "px");
				el.append(cellEl);
				return cellEl;
			},
			destroyItem: function(cellEl) {
				cellEl.remove();
			},
			scope: this
		}))
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
		if (e.which === 1) {
			this.selectionPoint1.set(point);
			this.selectionPoint2.set(point);
		}
		if (e.which === 3) {
			var ij = SR.Vector.floor(SR.xyToIj(point));
			this.level.getSelectedUnits().each(function(unit) {
				unit.send(this.level, ij);
			}, this);
		}
	},

	_onMouseMove: function(e) {
		var point = this._getPointByEvent(e);
		this.selectionPoint2.set(point);
	},

	_onMouseUp: function(e) {
		var p1 = this.selectionPoint1.get();
		var p2 = this.selectionPoint2.get();
		this.selectionPoint1.set(null);
		this.selectionPoint2.set(null);
		if (!p1 || !p2) {
			return;
		}
		var min = SR.Vector.min(p1, p2);
		var max = SR.Vector.max(p1, p2);
		var ijMin = SR.Vector.floor(SR.xyToIj(min));
		var ijMax = SR.Vector.floor(SR.xyToIj(max));
		this.level.units.each(function(unit) {
			unit.selected.set(unit.controllable && SR.Vector.isBetween(unit.ij.get(), ijMin, ijMax));
		}, this);
	},

	_onKeyPress: function(e) {
		if (e.which === 32) {
			e.preventDefault();
			var selectedUnits = this.level.getSelectedUnits();
			var isInactiveUnit = selectedUnits.some(function(unit) {
				return !unit.active.get();
			}, this);
			selectedUnits.each(function(unit) {
				unit.active.set(isInactiveUnit);
			}, this);
		}
	},

	_getPointByEvent: function(e) {
		var offset = this.el.offset();
		return [e.pageX - offset.left, e.pageY - offset.top];
	}
});
