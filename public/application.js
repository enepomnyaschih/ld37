SR.Application = function() {
	SR.Application._super.call(this);
	this.map = new SR.Map();
};

JW.extend(SR.Application, JW.UI.Component, {
	startLevel: function() {
		this.map = new SR.Map(40);
		this.map.matrix.fill(0);
		var ij = [39, 0];
		for (var d = 0; d < 4; ++d) {
			for (var i = 0; i < 39; ++i) {
				this.map.matrix.setCell(ij, 2);
				ij = SR.Vector.add(ij, SR.dir4[d]);
			}
		}
		for (var i = 0; i < 15; ++i) {
			this.map.matrix.setCell([24, i + 1], 1);
			this.map.matrix.setCell([38 - i, 15], 1);
		}
		this.map.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("bed"),
			ij: [1, 11],
			direction: 3
		}));
		this.children.set(new SR.MapView(this.map), "map");
		return this;
	}
});
