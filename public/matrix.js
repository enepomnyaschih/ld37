SR.Matrix = function(size) {
	SR.Matrix._super.call(this);
	this.size = size;
	this.cells = new Array(size);
	for (var i = 0; i < size; ++i) {
		this.cells[i] = new Array(size);
	}
};

JW.extend(SR.Matrix, JW.Class, {
	getCell: function(ij) {
		return JW.get(this.cells, ij);
	},

	setCell: function(ij, value) {
		this.cells[ij[0]][ij[1]] = value;
	},

	fill: function(value) {
		for (var i = 0; i < this.size; ++i) {
			for (var j = 0; j < this.size; ++j) {
				this.cells[i][j] = value;
			}
		}
	},

	inMatrix: function(ij) {
		return (ij[0] >= 0) && (ij[0] < this.size) && (ij[1] >= 0) && (ij[1] < this.size);
	},

	ijRandom: function() {
		return [SR.random(this.size), SR.random(this.size)];
	},

	ijCenter: function() {
		return SR.Vector.round(SR.Vector.mult([this.size, this.size], .5));
	},

	getRect: function(cij, distance) {
		return {
			iMin: Math.max(0, cij[0] - distance),
			iMax: Math.min(this.size - 1, cij[0] + distance),
			jMin: Math.max(0, cij[1] - distance),
			jMax: Math.min(this.size - 1, cij[1] + distance)
		};
	},

	getSideDistance: function(ij) {
		return Math.min(ij[0], ij[1], this.size - ij[0] - 1, this.size - ij[1] - 1);
	},

	every: function(callback, scope) {
		for (var i = 0; i < this.size; ++i) {
			for (var j = 0; j < this.size; ++j) {
				var ij = [i, j];
				if (callback.call(scope || this, this.getCell(ij), ij) === false) {
					return false;
				}
			}
		}
		return true;
	},

	some: function(callback, scope) {
		return !this.every(function() {
			return !callback.apply(this, arguments);
		}, scope || this);
	},

	eachWithin: function(cij, distanceSqr, callback, scope) {
		var distance = Math.ceil(Math.sqrt(distanceSqr));
		var rect = this.getRect(cij, distance);
		for (var i = rect.iMin; i <= rect.iMax; ++i) {
			for (var j = rect.jMin; j <= rect.jMax; ++j) {
				var ij = [i, j];
				if (SR.Vector.lengthSqr(SR.Vector.diff(ij, cij)) <= distanceSqr) {
					callback.call(scope || this, this.getCell(ij), ij);
				}
			}
		}
	},

	everyWithin8: function(cij, distance, callback, scope) {
		var rect = this.getRect(cij, distance);
		for (var i = rect.iMin; i <= rect.iMax; ++i) {
			for (var j = rect.jMin; j <= rect.jMax; ++j) {
				var ij = [i, j];
				if (callback.call(scope || this, this.getCell(ij), ij) === false) {
					return false;
				}
			}
		}
		return true;
	},

	someWithin8: function(cij, distance, callback, scope) {
		return !this.everyWithin8(cij, distance, function() {
			return !callback.apply(this, arguments);
		}, scope || this);
	}
});
