SR.Level = function(size) {
	SR.Level._super.call(this);
	this.tick = new JW.Property(0);
	this.matrix = new SR.Matrix(size);
	this.obstacles = new JW.ObservableArray();
	this.units = new JW.ObservableArray();
	this.paused = new JW.Property(false);
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
	},

	findPath: function(sij, tij, considerUnits) {
		var distanceMatrix = this.getDistanceMatrix(sij, tij, considerUnits);
		return this.backtracePath(distanceMatrix, tij);
	},

	getDistanceMatrix: function(sij, tij, considerUnits) {
		var distances = new SR.Matrix(this.matrix.size);
		distances.setCell(sij, 0);

		if (SR.Vector.equal(sij, tij)) {
			return distances;
		}

		var queue = [sij];
		var tail = 0;
		var movement = 0;
		var movementHead = 0;

		while (tail < queue.length) {
			if (tail == movementHead) {
				++movement;
				movementHead = queue.length;
				if (distances.getCell(tij) != null) {
					return distances;
				}
			}
			var cij = queue[tail++];
			for (var dir = 0; dir < SR.dir4.length; ++dir) {
				var dij = SR.Vector.add(cij, SR.dir4[dir]);
				var distance = distances.getCell(dij);
				if (!this.matrix.inMatrix(dij) || (distance != null)) {
					continue;
				}
				var cell = this.matrix.getCell(dij);
				if (!this.isPassable(dij, considerUnits)) {
					continue;
				}
				distances.setCell(dij, movement);
				queue.push(dij);
			}
		}
		return distances;
	},

	backtracePath: function(distanceMatrix, tij) {
		var path = [];
		var distance = distanceMatrix.getCell(tij);
		if (distance == null) {
			return null;
		}
		while (true) {
			if (distance === 0) {
				path.reverse();
				return path;
			}
			--distance;
			var dir, sij;
			var c = SR.random(4);
			for (d = 0; d < 4; ++d) {
				var dir = (d + c) % 4;
				sij = SR.Vector.diff(tij, SR.dir4[dir]);
				if (distanceMatrix.getCell(sij) === distance) {
					break;
				}
			}
			path.push(dir);
			tij = sij;
		}
	}
});

/*
Значения матрицы
0 - пусто
1 - стена между комнатами (ее могут грызть мыши)
2 - стена глухая вокруг дома
*/
