SR.Vector = {
	add: function(a, b) {
		return [a[0] + b[0], a[1] + b[1]];
	},

	diff: function(a, b) {
		return [a[0] - b[0], a[1] - b[1]];
	},

	mult: function(a, c) {
		return [c * a[0], c * a[1]];
	},

	equal: function(a, b) {
		return (a[0] === b[0]) && (a[1] === b[1]);
	},

	length: function(a) {
		return Math.sqrt(SR.Vector.lengthSqr(a));
	},

	lengthSqr: function(a) {
		return a[0] * a[0] + a[1] * a[1];
	},

	length8: function(a) {
		return Math.max(Math.abs(a[0]), Math.abs(a[1]));
	},

	lerp: function(a, b, c) {
		return SR.Vector.add(a, SR.Vector.mult(SR.Vector.diff(b, a), c))
	},

	isBetween: function(a, min, max) {
		return (a[0] >= min[0]) && (a[1] >= min[1]) && (a[0] <= max[0]) && (a[1] <= max[1]);
	},

	round: function(a) {
		return [Math.round(a[0]), Math.round(a[1])];
	},

	floor: function(a) {
		return [Math.floor(a[0]), Math.floor(a[1])];
	},

	ceil: function(a) {
		return [Math.ceil(a[0]), Math.ceil(a[1])];
	},

	min: function(a, b) {
		return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
	},

	max: function(a, b) {
		return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
	},

	norm: function(a) {
		return SR.Vector.mult(a, 1 / SR.Vector.length(a));
	},

	norm8: function(a) {
		return [JW.sgn(a[0]), JW.sgn(a[1])];
	},

	parse: function(s) {
		s = s.split(",");
		return [+s[0], +s[1]];
	},

	rotate: function(a, dir) {
		var d = SR.dir4[JW.mod(dir, 4)];
		return [
			 d[1] * a[0] + d[0] * a[1],
			-d[0] * a[0] + d[1] * a[1]
		];
	}
};
