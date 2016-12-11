SR.Fly = function(config) {
	SR.Fly._super.call(this);
	this.ij = new JW.Property(config.ij); // SR.Vector, center
	this.angle = new JW.Property(config.angle); // number - angle in radians
};

JW.extend(SR.Fly, JW.Class);
