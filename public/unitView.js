SR.UnitView = function(unit) {
	SR.UnitView._super.call(this);
	this.unit = unit; // SR.Unit
};

JW.extend(SR.UnitView, JW.UI.Component, {
	renderRoot: function(el) {
		el.addClass("sr-unit");
		el.attr("sr-type", this.unit.type.id);
		el.attr("sr-direction", this.unit.direction);

		var xy = this.own(new JW.Functor([this.unit.ij, this.unit.direction, this.unit.movement],
			function(ij, direction, movement) {
				return SR.ijToXy(SR.Vector.add(ij, SR.Vector.mult(SR.dir4[direction], movement)));
			}, this)).target;
		var x = this.own(SR.getXProperty(xy));
		var y = this.own(SR.getYProperty(xy));
		this.own(el.jwcss("left", x));
		this.own(el.jwcss("top", y));

		el.css("width",  "16px");
		el.css("height", "16px");

		var transform = this.own(this.unit.direction.$$mapValue(function(direction) {
			return "rotate(" + (-90 * direction) + "deg)"
		}, this));
		this.own(el.jwcss("transform", transform));

		this.own(el.jwclass("selected", this.unit.selected));
	}
});
