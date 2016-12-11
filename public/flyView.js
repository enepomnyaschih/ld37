SR.FlyView = function(fly) {
	SR.FlyView._super.call(this);
	this.fly = fly; // SR.Fly
};

JW.extend(SR.FlyView, JW.UI.Component, {
	renderRoot: function(el) {
		el.addClass("sr-fly");

		var xy = this.own(this.fly.ij.$$mapValue(SR.ijToXy));
		var x = this.own(SR.getXProperty(xy));
		var y = this.own(SR.getYProperty(xy));
		this.own(el.jwcss("left", x));
		this.own(el.jwcss("top", y));

		var transform = this.own(this.fly.angle.$$mapValue(function(angle) {
			return "rotate(" + (180 * angle / Math.PI) + "deg)";
		}, this));
		this.own(el.jwcss("transform", transform));
	}
});
