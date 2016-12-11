SR.ObstacleType = function(config) {
	SR.ObstacleType._super.call(this);
	this.id = config.id; // String
	this.size = config.size; // SR.Vector
	this.ijAction = config.ijAction; // SR.Vector, omit to make non-interactable
	this.actionTickCount = config.actionTickCount || 0; // number
	this.hitChecker = config.hitChecker || this.hitChecker; // (ij: SR.Vector) => boolean
};

JW.extend(SR.ObstacleType, JW.Class, {
	hitChecker: function(ij) {
		return this.isInRectangle(ij);
	},

	isInRectangle: function(ij) {
		return SR.Vector.isBetween(ij, [0, 0], SR.Vector.diff(this.size, [1, 1]));
	}
});

JW.makeRegistry(SR.ObstacleType);

SR.ObstacleType.registerItem(new SR.ObstacleType({
	id: "bed",
	size: [9, 19],
	ijAction: [4, 9],
	actionTickCount: 150,
	hitChecker: function(ij) {
		return this.isInRectangle(ij) && (ij[1] < 6 || ij[1] >= 13);
	}
}));

SR.ObstacleType.registerItem(new SR.ObstacleType({
	id: "table",
	size: [5, 9],
	ijAction: [8, 4],
	actionTickCount: 150
}));

SR.ObstacleType.registerItem(new SR.ObstacleType({
	id: "cabinet",
	size: [7, 11],
	ijAction: [10, 5],
	actionTickCount: 150
}));
