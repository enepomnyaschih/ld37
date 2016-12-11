SR.UnitType = function(config) {
	SR.UnitType._super.call(this);
	this.id = config.id; // String
	this.speed = config.speed; // number
	this.size = config.size || 0; // number - radius (0 means 1x1, 1 means 3x3)
	this.isMinion = config.isMinion || false; // boolean
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
	isMinion: true,
	viewCreator: function(unit) {
		return new SR.SpiderUnitView(unit);
	},
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
	speed: 0.2,
	size: 3,
	viewCreator: function(unit) {
		return new SR.HabitantUnitView(unit);
	},
	mover: function(unit, level) {
		// Looking for victim
		var victimUnit = level.units.search(function(victimUnit) {
			return victimUnit.type.isMinion &&
				SR.Vector.length8(SR.Vector.diff(unit.ij.get(), victimUnit.ij.get())) <= SR.attackDistance &&
				!level.isWallBetween(unit.ij.get(), victimUnit.ij.get());
		}, this);
		if (victimUnit) {
			unit.attackIj = victimUnit.ij.get();
			unit.attackTick = 25;
			unit.attackType = 0;
			if (Math.random() < .5) {
				level.units.removeItem(victimUnit);
			}
		}

		// Patrolling
		if (unit.actingObstacle) {
			if (unit.actionTick > unit.actingObstacle.type.actionTickCount) {
				unit.targetObstacle = null;
				unit.actingObstacle = null;
				unit.actionTick = 0;
			} else {
				++unit.actionTick;
				return;
			}
		}
		if (!unit.targetObstacle) {
			var availableObstacles = level.obstacles.filter(function(obstacle) {
				if (!obstacle.type.ijAction) {
					return false;
				}
				return !level.units.some(function(unit) {
					return (unit.type.id === "habitant") && (unit.targetObstacle === obstacle);
				}, unit);
			}, unit);
			if (!availableObstacles.length) {
				return;
			}
			unit.targetObstacle = availableObstacles[SR.random(availableObstacles.length)];
		}
		var ijActionRotated = SR.Vector.rotate(unit.targetObstacle.type.ijAction, unit.targetObstacle.direction);
		var ijActionAbsolute = SR.Vector.add(unit.targetObstacle.ij, ijActionRotated);
		if (SR.Vector.equal(unit.ij.get(), ijActionAbsolute) && unit.movement.get() === 0) {
			unit.actingObstacle = unit.targetObstacle;
		} else if (!unit.path.length && unit.movement.get() === 0) {
			unit.send(level, ijActionAbsolute);
		}
	}
}));
