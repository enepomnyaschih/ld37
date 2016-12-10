SR.ObstacleType = function(config) {
	SR.ObstacleType._super.call(this);
	this.id = config.id; // String
	this.size = config.size; // SR.Vector
};

JW.extend(SR.ObstacleType, JW.Class);

JW.makeRegistry(SR.ObstacleType);

SR.ObstacleType.registerItem(new SR.ObstacleType({
	id: "bed",
	size: [10, 20]
}));
