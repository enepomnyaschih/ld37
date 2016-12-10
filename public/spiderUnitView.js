SR.SpiderUnitView = function(unit) {
	SR.SpiderUnitView._super.call(this, unit);
};

JW.extend(SR.SpiderUnitView, SR.UnitView, {
	renderAss: function(el) {
		var transform = this.own(this.unit.energy.$$mapValue(function(energy) {
			return "scale(" + (energy * .6 + .4) + ")";
		}, this));
		this.own(el.jwcss("transform", transform));
	}
});
