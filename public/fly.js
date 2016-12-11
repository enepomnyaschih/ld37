SR.Fly = function(config) {
	SR.Fly._super.call(this);
	this.ij = new JW.Property(config.ij); // SR.Vector, center
	this.angle = new JW.Property(config.angle); // number - angle in radians
	this.angleAddend = 0; // number - amount of radians to add
	this.healthTicks = 0; // number - amount of ticks remaining to be caught
	this.sittingTicks = new JW.Property(0); // number
	this._replenishHealth();
};

JW.extend(SR.Fly, JW.Class, {
	angleStepPerTick: 4 * Math.PI / 180,
	minHealth: 2,
	maxHealth: 6,
	speed: 0.9,
	sitProbability: 0.05,
	sitMaxTime: 175,
	sitMinTime: 50,
	scaredDistance: 4,

	move: function(level) {
		if (this.sittingTicks.get()) {
			var isSpiderNearby = level.units.some(function(unit) {
				return unit.type.isMinion && SR.Vector.length8(SR.Vector.diff(unit.ij.get(), this.ij.get())) < this.scaredDistance;
			}, this);
			this.sittingTicks.set(isSpiderNearby ? 0 : (this.sittingTicks.get() - 1));
			if (this.sittingTicks.get() <= 0) {
				this.jump();
			}
			return;
		}
		if (this.angleAddend === 0) {
			this.angleAddend = Math.PI * (Math.random() - .5);
		} else if (this.angleAddend > 0) {
			this.angle.set(this.angle.get() + this.angleStepPerTick);
			this.angleAddend = Math.max(0, this.angleAddend - this.angleStepPerTick);
		} else {
			this.angle.set(this.angle.get() - this.angleStepPerTick);
			this.angleAddend = Math.min(0, this.angleAddend + this.angleStepPerTick);
		}
		var wasInWeb = level.isWebCell(SR.Vector.floor(this.ij.get()));
		if (this.healthTicks <= 0 && wasInWeb) {
			return;
		}
		for (var i = 0; i < 4; ++i) {
			var tij = SR.Vector.add(this.ij.get(), [Math.sin(this.angle.get()), Math.cos(this.angle.get())]);
			if (level.matrix.getCell(SR.Vector.floor(tij)) !== 0) {
				this.angle.set(2 * Math.PI * Math.random());
			} else {
				this.ij.set(tij);
				break;
			}
		}
		if (level.isAboveObstacle(SR.Vector.floor(this.ij.get())) && Math.random() < this.sitProbability) {
			this.sittingTicks.set(SR.randomBetween(this.sitMinTime, this.sitMaxTime));
			return;
		}
		if (level.isWebCell(SR.Vector.floor(this.ij.get()))) {
			--this.healthTicks;
		} else if (wasInWeb || this.healthTicks <= 0) {
			this._replenishHealth();
		}
	},

	jump: function() {
		this.sittingTicks.set(0);
		this.angle.set(2 * Math.PI * Math.random());
	},

	_replenishHealth: function() {
		this.healthTicks = SR.randomBetween(this.minHealth, this.maxHealth);
	}
});
