var utils = {
	randomColor: function() {
		var r = Math.floor(Math.random() * 256) + 1,
			g = Math.floor(Math.random() * 256) + 1,
			b = Math.floor(Math.random() * 256) + 1;
		return "rgba(" + r + ", " + g + ", " + b + ", 1)";
	},
	
	distanceTo: function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}
};