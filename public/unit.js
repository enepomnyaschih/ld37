SR.Unit = function(config) {
	SR.Unit._super.call(this);
	this.ij = new JW.Property(config.ij); // SR.Vector, center
	this.direction = new JW.Property(config.direction); // number
	this.movement = new JW.Property(0); // number, процент движения из клетки A в клетку B, от -1 до 0
	this.controllable = config.controllable; // boolean
	this.type = config.type; // SR.UnitType
	this.ijTarget = new JW.Property(); // SR.Vector
	this.path = []; // Array<number>
	this.selected = new JW.Property(false); // boolean
	this.animationTick = new JW.Property(0); // number

	// For spider
	this.energy = new JW.Property(1); // number
	this.active = new JW.Property(false); // Boolean

	// For habitant
	this.actionTick = 0; // number
	this.actingObstacle = null; // SR.Obstacle
	this.targetObstacle = null; // SR.Obstacle
	this.attackType = new JW.Property(); // number, 0 - slipper, 1 - broom, 2 - dichlorvos
	this.attackTick = 0; // number - decreasing
	this.attackIj = new JW.Property(); // SR.Vector
};

JW.extend(SR.Unit, JW.Class, {
	move: function(level) {
		if (this.attackIj.get()) {
			if (this.attackTick <= 0) {
				this.attackIj.set(null);
				this.attackType.set(null);
			} else {
				--this.attackTick;
				return;
			}
		}

		var movement = this.type.speed;
		if (this.path.length || this.movement.get() !== 0) {
			this.animationTick.set(this.animationTick.get() + movement);
		}
		while (movement && (this.path.length || this.movement.get() !== 0)) {
			var remainingMovement = -this.movement.get();
			if (movement < remainingMovement) {
				this.movement.set(this.movement.get() + movement);
				movement = 0;
			} else if (this.path.length) {
				movement -= remainingMovement;
				this.movement.set(-1);
				var direction = this.path[0];
				this.path.splice(0, 1);
				this.ij.set(SR.Vector.add(this.ij.get(), SR.dir4[direction]));
				this.direction.set(direction);
			} else {
				this.movement.set(0);
				this.animationTick.set(0);
			}
		}
		this.type.mover(this, level);
	},

	send: function(level, tij, considerUnits) {
		// ij is not null
		this.ijTarget.set(tij);
		this.path = level.findPath(this.ij.get(), tij, this.type.size, considerUnits, this.type.hitsObstacles) || [];
	}
});
