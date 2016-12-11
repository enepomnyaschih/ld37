SR.ObstacleType = function(config) {
	SR.ObstacleType._super.call(this);
	this.id = config.id; // String
	this.size = config.size; // SR.Vector
	this.hitChecker = config.hitChecker; // (ij: SR.Vector) => boolean
};

JW.extend(SR.ObstacleType, JW.Class, {
	hitChecker: function(ij) {
		return this._isInRectangle(ij);
	},

	_isInRectangle: function(ij) {
		return SR.Vector.isBetween(ij, [0, 0], SR.Vector.diff(this.size, [1, 1]));
	}
});

JW.makeRegistry(SR.ObstacleType);

SR.ObstacleType.registerItem(new SR.ObstacleType({
	id: "bed",
	size: [10, 20],
	hitChecker: function(ij) {
		return this._isInRectangle(ij) && (ij[1] < 6 || ij[1] >= 14);
	}
}));
