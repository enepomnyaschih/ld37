SR.Application = function() {
	SR.Application._super.call(this);
	this.level = this.own(new JW.Property()).ownValue();
};

JW.extend(SR.Application, JW.UI.Component, {
	renderLevel: function() {
		return this.own(this.level.$$mapObject(function(level) {
			return new SR.LevelView(level);
		}, this));
	},

	startLevel: function() {
		var level = new SR.Level([40, 40]);
		level.matrix.fill(0);
		var ij = [39, 0];
		for (var d = 0; d < 4; ++d) {
			for (var i = 0; i < 39; ++i) {
				level.matrix.setCell(ij, 2);
				ij = SR.Vector.add(ij, SR.dir4[d]);
			}
		}
		for (var i = 0; i < 17; ++i) {
			level.matrix.setCell([22, i + 1], 2);
			level.matrix.setCell([38 - i, 17], 2);
		}
		for (var i = 23; i < 40; ++i) {
			for (var j = 0; j < 17; ++j) {
				level.matrix.setCell([i, j], 1);
			}
		}
		for (var i = 0; i < 7; ++i) {
			level.matrix.setCell([0, 15 + i], 3);
			level.matrix.setCell([12 + i, 39], 3);
		}
		for (var i = 1; i < 4; ++i) {
			level.webCells.add([20, i]);
			level.webCells.add([21, i]);
		}
		level.webCells.add([20, 4]);
		level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("bed"),
			ij: [1, 9],
			direction: 3
		}));
		/*level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("bed"),
			ij: [15, 1],
			direction: 0
		}));*/
		level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("table"),
			ij: [1, 30],
			direction: 0
		}));
		level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("cabinet"),
			ij: [28, 38],
			direction: 3
		}));
		level.units.add(new SR.Unit({
			ij: [20, 1],
			direction: 0,
			controllable: true,
			type: SR.UnitType.getItem("spider")
		}));
		level.units.add(new SR.Unit({
			ij: [21, 1],
			direction: 2,
			controllable: true,
			type: SR.UnitType.getItem("spider")
		}));
		level.units.add(new SR.Unit({
			ij: [20, 2],
			direction: 1,
			controllable: true,
			type: SR.UnitType.getItem("spider")
		}));
		level.units.add(new SR.Unit({
			ij: [20, 25],
			direction: 0,
			controllable: false,
			type: SR.UnitType.getItem("habitant")
		}));
		for (var i = 0; i < 1; ++i) {
			level.flies.add(new SR.Fly({
				ij: [20, 20],
				angle: i * Math.PI / 3
			}));
		}
		level.initPathingMatrices();
		this.level.set(level);
		return this;
	}
});
