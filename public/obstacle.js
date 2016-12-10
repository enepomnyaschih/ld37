SR.Obstacle = function(config) {
	SR.Obstacle._super.call(this);
	this.type = config.type; // SR.ObstacleType
	this.ij = config.ij; // SR.Vector
	this.direction = config.direction; // number
};

JW.extend(SR.Obstacle, JW.Class, {

});

