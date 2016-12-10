SR.UnitType = function(config) {
	SR.UnitType._super.call(this);
	this.id = config.id; // String
	this.speed = config.speed; // number
	this.viewCreator = config.viewCreator || this.viewCreator; // (unit: SR.Unit) => SR.UnitView
};

JW.extend(SR.UnitType, JW.Class, {
	viewCreator: function(unit) {
		return new SR.UnitView(unit);
	}
});

JW.makeRegistry(SR.UnitType);

SR.UnitType.registerItem(new SR.UnitType({
	id: "spider",
	speed: 0.2
}));

SR.UnitType.registerItem(new SR.UnitType({
	id: "habitant",
	speed: 0.1,
	viewCreator: function(unit) {
		return new SR.HabitantUnitView(unit);
	}
}));
