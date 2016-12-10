SR.Map = function(size) {
	SR.Map._super.call(this);
	this.matrix = new SR.Matrix(size);
	this.obstacles = new JW.ObservableArray();
	//this.spiders = new JW.ObservableArray();
};

JW.extend(SR.Map, JW.Class);

/*
Значения матрицы
0 - пусто
1 - стена между комнатами (ее могут грызть мыши)
2 - стена глухая вокруг дома
*/
