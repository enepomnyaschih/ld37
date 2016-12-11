SR.FlyView = function(fly) {
	SR.FlyView._super.call(this);
	this.fly = fly; // SR.Fly
	this.sittingAnimationTick = 0; // number
	this.isClapping = false; // boolean
};

JW.extend(SR.FlyView, JW.UI.Component, {
	animationPeriodMin: 25,
	animationPeriodMax: 75,

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

		var sittingClass = this.own(this.fly.sittingTicks.$$mapValue(function(sittingTicks) {
			if (sittingTicks <= 0) {
				this.isClapping = false;
				return null;
			}
			if (--this.sittingAnimationTick <= 0) {
				this.isClapping = !this.isClapping;
				this.sittingAnimationTick = SR.randomBetween(this.animationPeriodMin, this.animationPeriodMax);
			}
			if (this.isClapping) {
				return (sittingTicks % 2 === 0) ? "sitting-1" : "sitting-2";
			}
			return "sitting";
		}, this));
		this.own(el.jwclass(sittingClass));
	}
});
