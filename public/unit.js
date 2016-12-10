SR.Unit = function(config) {
	SR.Unit._super.call(this);
	this.ij = new JW.Property(config.ij); // SR.Vector
	this.direction = new JW.Property(config.direction); // number
	this.movement = new JW.Property(0); // number, процент движения из клетки A в клетку B
	this.controllable = config.controllable; // boolean
	this.type = config.type; // SR.UnitType
};

JW.extend(SR.Unit, JW.Class, {
});
