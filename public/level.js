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
	}
});

/*
Значения матрицы
0 - пусто
1 - стена между комнатами (ее могут грызть мыши)
2 - стена глухая вокруг дома
*/
