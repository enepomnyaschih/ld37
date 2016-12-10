SR.ObstacleView = function(obstacle) {
	SR.ObstacleView._super.call(this);
	this.obstacle = obstacle;
};

JW.extend(SR.ObstacleView, JW.UI.Component, {
	renderRoot: function(el) {
		el.addClass("sr-obstacle");
		el.attr("sr-type", this.obstacle.type.id);
		el.attr("sr-direction", this.obstacle.direction);

		var xy = SR.ijToXy(this.obstacle.ij);
		el.css("left",   xy[0] + "px");
		el.css("top",    xy[1] + "px");

		var size = SR.ijToXy(this.obstacle.type.size);
		el.css("width",  size[0] + "px");
		el.css("height", size[1] + "px");

		el.css("transform", "rotate(" + (-90 * this.obstacle.direction) + "deg)");
	}
});
