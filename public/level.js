SR.Level = function(size) {
	SR.Level._super.call(this);
	this.tick = new JW.Property(0);
	this.matrix = new SR.Matrix(size);
	this.obstacles = new JW.ObservableArray();
	this.units = new JW.ObservableArray();
	this.paused = new JW.Property(true);
	this.own(this.paused.$$mapObject(function(paused) {
		return paused ? null : new JW.Interval(this.onTick, this, 1000 / SR.tickPerSecond);
	}, this));
};

JW.extend(SR.Level, JW.Class, {
	onTick: function() {
		this.tick.set(this.tick.get() + 1);
		this.units.each(JW.byMethod("move", [this]));
	},

	isPassable: function(ij, considerUnits) {
		if (this.matrix.getCell(ij) !== 0) {
			return false;
		}
		var isObstacle = this.obstacles.some(function(obstacle) {
			var d = SR.dir4[obstacle.direction];
			var s = SR.Vector.diff(obstacle.type.size, [1, 1]);
			var size = [
				 d[1] * s[0] + d[0] * s[1],
				-d[0] * s[0] + d[1] * s[1]
			];
			var ij1 = obstacle.ij;
			var ij2 = SR.Vector.add(ij1, size);
			var min = SR.Vector.min(ij1, ij2);
			var max = SR.Vector.max(ij1, ij2);
			return SR.Vector.isBetween(ij, min, max);
		}, this);
		if (isObstacle) {
			return false;
		}
		if (considerUnits) {
			var isUnit = this.units.some(function(unit) {
				return SR.Vector.equal(unit.ij.get(), ij);
			}, this);
			if (isUnit) {
				return false;
			}
		}
		return true;
	}
});

/*
Значения матрицы
0 - пусто
1 - стена между комнатами (ее могут грызть мыши)
2 - стена глухая вокруг дома
*/
