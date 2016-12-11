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

	renderWeapon: function(el) {
		this.own(el.jwattr("sr-weapon", this.unit.attackType));
		this.own(el.jwcss("transform", this.transform));

		var xy = this.own(new JW.Functor([this.unit.ij, this.unit.attackIj],
			function(ij, attackIj) {
				return attackIj ? SR.ijToXy(SR.Vector.diff(attackIj, ij)) : [0, 0];
			}, this)).target;
		var x = this.own(SR.getXProperty(xy));
		var y = this.own(SR.getYProperty(xy));
		this.own(el.jwcss("left", x));
		this.own(el.jwcss("top", y));
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
