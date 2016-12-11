SR.Obstacle = function(config) {
	SR.Obstacle._super.call(this);
	this.type = config.type; // SR.ObstacleType
	this.ij = config.ij; // SR.Vector, left top corner in zero direction - origin rotation point
	this.direction = config.direction; // number
};

JW.extend(SR.Obstacle, JW.Class, {
	getRelativeIj: function(ij) {
		var d = SR.dir4[this.direction];
		var diffAbsolute = SR.Vector.diff(ij, this.ij);
		return SR.Vector.rotate(diffAbsolute, -this.direction);
	}
});

