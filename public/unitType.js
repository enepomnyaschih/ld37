SR.UnitType = function(config) {
	SR.UnitType._super.call(this);
	this.id = config.id; // String
	this.speed = config.speed; // number
	this.size = config.size || 0; // number - radius (0 means 1x1, 1 means 3x3)
	this.viewCreator = config.viewCreator || this.viewCreator; // (unit: SR.Unit) => SR.UnitView
	this.mover = config.mover || this.mover; // (unit: SR.Unit, level: SR.Level) => void
};

JW.extend(SR.UnitType, JW.Class, {
	viewCreator: function(unit) {
		return new SR.UnitView(unit);
	},

	mover: function(unit, level) {
	}
});

JW.makeRegistry(SR.UnitType);

SR.UnitType.registerItem(new SR.UnitType({
	id: "spider",
	speed: 0.2,
	mover: function(unit, level) {
		if (level.isWebCell(unit.ij.get())) {
			unit.energy.set(Math.min(1, unit.energy.get() + 1 / SR.spiderEnergyFillingPeriod));
			return;
		}
		if (!unit.active.get()) {
			return;
		}
		if (unit.energy.get() < SR.spiderEnergyPerWeb) {
			unit.active.set(false);
			return;
		}
		var applicableNeighbourCount = 0;
		for (var d = 0; d < 4; ++d) {
			var dij = SR.Vector.add(unit.ij.get(), SR.dir4[d]);
			if (level.isWebCell(dij) || !level.isPassable(dij)) {
				++applicableNeighbourCount;
			}
		}
		if (applicableNeighbourCount < 2) {
			return;
		}
		unit.energy.set(unit.energy.get() - SR.spiderEnergyPerWeb);
		level.webCells.add(unit.ij.get());
	}
}));

SR.UnitType.registerItem(new SR.UnitType({
	id: "habitant",
	speed: 0.1,
	size: 3,
	viewCreator: function(unit) {
		return new SR.HabitantUnitView(unit);
	}
}));
