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
		var level = new SR.Level(40);
		level.matrix.fill(0);
		var ij = [39, 0];
		for (var d = 0; d < 4; ++d) {
			for (var i = 0; i < 39; ++i) {
				level.matrix.setCell(ij, 2);
				ij = SR.Vector.add(ij, SR.dir4[d]);
			}
		}
		for (var i = 0; i < 15; ++i) {
			level.matrix.setCell([24, i + 1], 1);
			if (i < 3 || i > 10) {
				level.matrix.setCell([38 - i, 15], 1);
			}
		}
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
			type: SR.ObstacleType.getItem("bed"),
			ij: [9, 38],
			direction: 2
		}));
		level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("bed"),
			ij: [38, 30],
			direction: 1
		}));
		level.units.add(new SR.Unit({
			ij: [35, 5],
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
		level.initPathingMatrices();
		this.level.set(level);
		return this;
	}
});
