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
			level.matrix.setCell([38 - i, 15], 1);
		}
		level.obstacles.add(new SR.Obstacle({
			type: SR.ObstacleType.getItem("bed"),
			ij: [1, 10],
			direction: 3
		}));
		level.units.add(new SR.Unit({
			ij: [35, 5],
			direction: 1,
			controllable: true,
			type: SR.UnitType.getItem("spider")
		}));
		level.units.add(new SR.Unit({
			ij: [20, 20],
			direction: 0,
			controllable: false,
			type: SR.UnitType.getItem("habitant")
		}));
		level.initPathingMatrices();
		this.level.set(level);
		return this;
	}
});
