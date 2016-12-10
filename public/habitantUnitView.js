SR.HabitantUnitView = function(unit) {
	SR.HabitantUnitView._super.call(this, unit);
	this.animationPoint = null; // JW.Property<number>
};

JW.extend(SR.HabitantUnitView, SR.UnitView, {
	bodyRotationAmplitude: 10,
	legExtrusionAmplitude: 40,
	animationPeriod: 4,

	beforeRender: function() {
		this._super();
		this.animationPoint = this.own(this.unit.animationTick.$$mapValue(function(animationTick) {
			return 2 * Math.abs(2 * JW.smod(animationTick / this.animationPeriod + .25, 1)) - 1;
		}, this));
	},

	renderBody: function(el) {
		var transform = this.own(this.animationPoint.$$mapValue(function(animationPoint) {
			return "rotate(" + (-animationPoint * this.bodyRotationAmplitude) + "deg)";
		}, this));
		this.own(el.jwcss("transform", transform));
	},

	renderLeftLeg: function(el) {
		this._renderLeg(el, 1);
	},

	renderRightLeg: function(el) {
		this._renderLeg(el, -1);
	},

	_renderLeg: function(el, sgn) {
		this.own(new JW.Updater([this.animationPoint], function(animationPoint) {
			animationPoint *= sgn;
			el.css("left", (animationPoint >= 0) ? "56px" : (56 + this.legExtrusionAmplitude * animationPoint + "px"))
			el.css("width", Math.abs(animationPoint) * this.legExtrusionAmplitude + "px");
			el.css("background-position-x", (animationPoint >= 0) ? (this.legExtrusionAmplitude * animationPoint - 48 + "px") : "0")
		}, this));
	}
});
