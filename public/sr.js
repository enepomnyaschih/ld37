var SR = {
	attackDistance: 6,
	attackDistanceWeb: 5,
	cellSize: 16,
	flyKillProbability: .3,
	maxUnitSize: 3,
	spiderEnergyFillingPerFly: .5,
	spiderEnergyPerWeb: 0.1,
	spiderEnergyRequirement: .25,
	spiderEnergyHungryLeak: .0025,
	spiderKillProbability: .5,
	tickPerSecond: 25,
	webAttackProbability: .03,
	winConditionPercent: 20,

	dir4: [
		[0, 1],
		[-1, 0],
		[0, -1],
		[1, 0]
	],

	dir8: [
		[0, 1],
		[-1, 1],
		[-1, 0],
		[-1, -1],
		[0, -1],
		[1, -1],
		[1, 0],
		[1, 1]
	],

	sound: function(name) {
		var el = new Audio();
		el.src = "audio/" + name + ".ogg";
		el.play();
	},

	random: function(n) {
		return Math.floor(Math.random() * n);
	},

	randomBetween: function(min, max) {
		return SR.random(max - min + 1) + min;
	},

	getIjs4: function(ij) {
		var dij = [];
		for (var d = 0; d < 4; ++d) {
			dij.push(SR.Vector.add(ij, SR.dir4[d]));
		}
		return dij;
	},

	getIjs8: function(ij) {
		var dij = [];
		for (var d = 0; d < 8; ++d) {
			dij.push(SR.Vector.add(ij, SR.dir8[d]));
		}
		return dij;
	},

	ijToXy: function(ij) {
		return [SR.cellSize * ij[1], SR.cellSize * ij[0]];
	},

	xyToIj: function(xy) {
		return [xy[1] / SR.cellSize, xy[0] / SR.cellSize];
	},

	getXProperty: function(xy) {
		return xy.$$mapValue(function(xy) {
			return xy[0] + "px";
		});
	},

	getYProperty: function(xy) {
		return xy.$$mapValue(function(xy) {
			return xy[1] + "px";
		});
	}
};
