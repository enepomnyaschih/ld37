SR.UnitView = function(unit) {
	SR.UnitView._super.call(this);
	this.unit = unit; // SR.Unit
};

JW.extend(SR.UnitView, JW.UI.Component, {
	renderRoot: function(el) {
		var xy = this.own(new JW.Functor([this.unit.ij, this.unit.direction, this.unit.movement],
			function(ij, direction, movement) {
				return SR.ijToXy(SR.Vector.add(ij, SR.Vector.mult(SR.dir4[direction], movement)));
			}, this)).target;
		var x = this.own(SR.getXProperty(xy));
		var y = this.own(SR.getYProperty(xy));
		this.own(el.jwcss("left", x));
		this.own(el.jwcss("top", y));
	},

	renderView: function(el) {
		el.attr("sr-type", this.unit.type.id);

		var size = (2 * this.unit.type.size + 1) * SR.cellSize;
		var half = size / 2;
		el.css("width",  size + "px");
		el.css("height", size + "px");
		el.css("left",  -half + "px");
		el.css("top",   -half + "px");

		var transform = this.own(this.unit.direction.$$mapValue(function(direction) {
			return "rotate(" + (-90 * direction) + "deg)"
		}, this));
		this.own(el.jwcss("transform", transform));

		this.own(el.jwclass("selected", this.unit.selected));
	}
});
