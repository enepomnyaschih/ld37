SR.Level = function(size) {
	SR.Level._super.call(this);
	this.tick = new JW.Property(0);
	this.matrix = new SR.Matrix(size);
	this.obstacles = this.own(new JW.ObservableArray()).ownItems();
	this.units = this.own(new JW.ObservableArray()).ownItems();
	this.webCells = this.own(new JW.ObservableArray()).ownItems();
	this.flies = this.own(new JW.ObservableArray()).ownItems();
	this.paused = new JW.Property(false);
	this.own(this.paused.$$mapObject(function(paused) {
		return paused ? null : new JW.Interval(this.onTick, this, 1000 / SR.tickPerSecond);
	}, this));
	this.pathingMatricesWithObstacles    = []; // <SR.Matrix<boolean>>, index - unit size, value - pathing matrix
	this.pathingMatricesWithoutObstacles = []; // <SR.Matrix<boolean>>, index - unit size, value - pathing matrix
	this.flyLimit = 6;
	this.flySpawnInterval = 120;
	this.spiderLimit = 3;
	this.spiderSpawnInterval = 150;
	this.windowCells = [];
	this.achievement = new JW.Property(0);
	this.buildableCellCount = 0;
	this.victory = new JW.Property(false);
};

JW.extend(SR.Level, JW.Class, {
	initPathingMatrices: function() {
		this.pathingMatricesWithObstacles = [];
		this.pathingMatricesWithObstacles.push(this._initMainPathingMatrix(true));
		for (var i = 0; i < 3; ++i) {
			this.pathingMatricesWithObstacles.push(this._extendPathingMatrix(this.pathingMatricesWithObstacles[i]));
		}
		this.pathingMatricesWithoutObstacles = [];
		this.pathingMatricesWithoutObstacles.push(this._initMainPathingMatrix(false));
		this.matrix.every(function(value, ij) {
			if (value === 3) {
				this.windowCells.push(ij);
			}
			if (value === 0 && !this.isAboveObstacle(ij)) {
				++this.buildableCellCount;
			}
		}, this);
	},

	onTick: function() {
		if (this.webCells.getLength() >= this.buildableCellCount * SR.winConditionPercent / 100) {
			this.victory.set(true);
			return;
		}
		this.tick.set(this.tick.get() + 1);
		this.units.each(JW.byMethod("move", [this]));
		this.flies.each(JW.byMethod("move", [this]));
		if (this.flies.getLength() < this.flyLimit && (this.tick.get() % this.flySpawnInterval === 0)) {
			this.spawnFly();
		}

		var spiders = this.units.$filter(function(unit) {
			return unit.type.isMinion;
		}, this);
		if (spiders.getLength() < this.spiderLimit && (this.tick.get() % this.spiderSpawnInterval === 0)) {
			this.spawnSpider(SR.spiderEnergyRequirement);
		}

		// Being hungry
		spiders.$toArray().each(function(unit) {
			if (!this.isWebCell(unit.ij.get())) {
				unit.energy.set(unit.energy.get() - SR.spiderEnergyHungryLeak);
				if (unit.energy.get() < 0) {
					this.units.removeItem(unit);
				}
			}
		}, this);

		this.units.performFilter(this.units.filter(JW.byField("alive")));
	},

	isPassable: function(ij, unitSize, considerUnits, considerObstacles) {
		unitSize = unitSize || 0;
		var pathingMatrix = considerObstacles ?
			this.pathingMatricesWithObstacles[unitSize] :
			this.pathingMatricesWithoutObstacles[unitSize];
		if (!pathingMatrix.getCell(ij)) {
			return false;
		}
		if (considerUnits) {
			var isUnit = this.units.some(function(unit) {
				return SR.Vector.length8(SR.Vector.diff(unit.ij.get(), ij)) <= unitSize + unit.type.size;
			}, this);
			if (isUnit) {
				return false;
			}
		}
		return true;
	},

	findPath: function(sij, tij, unitSize, considerUnits, considerObstacles) {
		var distanceMatrix = this.getDistanceMatrix(sij, tij, unitSize, considerUnits, considerObstacles);
		return this.backtracePath(distanceMatrix, tij);
	},

	getDistanceMatrix: function(sij, tij, unitSize, considerUnits, considerObstacles) {
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
				if (!this.isPassable(dij, unitSize, considerUnits, considerObstacles)) {
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
	},

	getSelectedUnits: function() {
		return this.units.$filter(function(unit) {
			return unit.selected.get();
		}, this);
	},

	// TODO: Optimize using an extra matrix
	isWebCell: function(ij) {
		return this.webCells.some(function(webCell) {
			return SR.Vector.equal(webCell, ij);
		}, this);
	},

	isWallBetween: function(a, b) {
		var diff = SR.Vector.diff(b, a);
		var length = SR.Vector.length(diff);
		var norm = SR.Vector.mult(diff, 1 / length);
		length = Math.round(length);
		for (var i = 1; i < length; ++i) {
			a = SR.Vector.add(a, norm);
			var ij = SR.Vector.round(a);
			if (this.matrix.getCell(ij) !== 0) {
				return true;
			}
		}
		return false;
	},

	isAboveObstacle: function(ij) {
		return this.obstacles.some(function(obstacle) {
			return obstacle.type.isInRectangle(obstacle.getRelativeIj(ij));
		}, this);
	},

	getEatableFly: function(ij) {
		return this.flies.search(function(fly) {
			var min = SR.Vector.floor(SR.Vector.diff(fly.ij.get(), [.5, .5]));
			var max = SR.Vector.floor(SR.Vector.add (fly.ij.get(), [.5, .5]));
			return (fly.healthTicks <= 0) && SR.Vector.isBetween(ij, min, max);
		}, this);
	},

	spawnFly: function() {
		var ij = this.windowCells[SR.random(this.windowCells.length)];
		ij = SR.Vector.max(ij, [1, 1]);
		ij = SR.Vector.min(ij, SR.Vector.diff(this.matrix.size, [2, 2]));
		this.flies.add(new SR.Fly({
			ij: ij,
			angle: 2 * Math.PI * Math.random()
		}));
	},

	spawnSpider: function(energy) {
		var ij = this.webCells.get(SR.random(this.webCells.getLength()));
		this.units.add(new SR.Unit({
			ij: ij,
			direction: SR.random(4),
			controllable: true,
			type: SR.UnitType.getItem("spider"),
			energy: energy
		}));
	},

	_initMainPathingMatrix: function(considerObstacles) {
		var matrix = new SR.Matrix(this.matrix.size);
		for (var i = 0; i < matrix.size[0]; ++i) {
			for (var j = 0; j < matrix.size[1]; ++j) {
				var ij = [i, j];
				matrix.setCell(ij, this._isPassable(ij, considerObstacles));
			}
		}
		return matrix;
	},

	_extendPathingMatrix: function(source) {
		var matrix = new SR.Matrix(this.matrix.size);
		for (var i = 0; i < matrix.size[0]; ++i) {
			for (var j = 0; j < matrix.size[1]; ++j) {
				var ij = [i, j];
				var passable = true;
				for (var d = 0; d < 8; ++d) {
					var dij = SR.Vector.add(ij, SR.dir8[d]);
					if (!matrix.inMatrix(dij) || !source.getCell(dij)) {
						var passable = false;
						break;
					}
				}
				matrix.setCell(ij, passable);
			}
		}
		return matrix;
	},

	_isPassable: function(ij, considerObstacles) {
		if (this.matrix.getCell(ij) !== 0) {
			return false;
		}
		if (!considerObstacles) {
			return true;
		}
		var isObstacle = this.obstacles.some(function(obstacle) {
			return obstacle.type.hitChecker(obstacle.getRelativeIj(ij));
		}, this);
		if (isObstacle) {
			return false;
		}
		return true;
	}
});

/*
Значения матрицы
0 - пусто
1 - стена между комнатами (ее могут грызть мыши)
2 - стена глухая вокруг дома
3 - окно
*/
