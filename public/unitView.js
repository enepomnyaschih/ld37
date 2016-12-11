SR.UnitView = function(unit) {
	SR.UnitView._super.call(this);
	this.unit = unit; // SR.Unit
	this.transform = null; // JW.Property<String>
};

JW.extend(SR.UnitView, JW.UI.Component, {
	beforeRender: function() {
		this._super();
		this.transform = this.own(new JW.Functor([this.unit.direction, this.unit.attackIj], function(direction, attackIj) {
			if (attackIj) {
				var diff = SR.Vector.diff(attackIj, this.unit.ij.get());
				var angle = -Math.atan2(diff[1], diff[0]);
				return "rotate(" + (180 * angle / Math.PI + 90) + "deg)";
			}
			return "rotate(" + (-90 * direction) + "deg)";
		}, this)).target;
	},

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

		this.own(el.jwcss("transform", this.transform));
		this.own(el.jwclass("selected", this.unit.selected));
		this.own(el.jwclass("active", this.unit.active));
	}
});
