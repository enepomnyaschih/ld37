SR.Fly = function(config) {
	SR.Fly._super.call(this);
	this.ij = new JW.Property(config.ij); // SR.Vector, center
	this.angle = new JW.Property(config.angle); // number - angle in radians
	this.angleAddend = 0; // number - amount of radians to add
};

JW.extend(SR.Fly, JW.Class, {
	angleStepPerTick: 4 * Math.PI / 180,
	speed: 0.9,

	move: function(level) {
		if (this.angleAddend === 0) {
			this.angleAddend = Math.PI * (Math.random() - .5);
		} else if (this.angleAddend > 0) {
			this.angle.set(this.angle.get() + this.angleStepPerTick);
			this.angleAddend = Math.max(0, this.angleAddend - this.angleStepPerTick);
		} else {
			this.angle.set(this.angle.get() - this.angleStepPerTick);
			this.angleAddend = Math.min(0, this.angleAddend + this.angleStepPerTick);
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
	}
});
