var vector = {
	_x: 0,
	_y: 0,
	
	create: function(x, y) {
		var obj = Object.create(this);
			obj.setX(x);
			obj.setY(y);
		return obj;
	},
	
	setX: function(x) {
		this._x = x;
	},
	
	getX: function() {
		return this._x;
	},
	
	setY: function(y) {
		this._y = y;
	},
	
	getY: function() {
		return this._y;
	},
	
	setLength: function(length) {
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},
	
	getLength: function() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},
	
	setAngle: function(angle) {
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},
	
	getAngle: function() {
		return Math.atan2(this._y, this._x);
	},
	
	add: function(v2) {
		return this.create(this._x + v2.getX(), this._y + v2.getY());
	},
	
	subtract: function(v2) {
		return this.create(this._x - v2.getX(), this._y - v2.getY());
	},
	
	multiply: function(scalar) {
		return this.create(this._x * scalar, this._y * scalar);
	},
	
	divide: function(scalar) {
		return this.create(this._x / scalar, this._y / scalar);
	},
	
	addTo: function(v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	},
	
	subtractFrom: function(v2) {
		this._x -= v2.getX();
		this._y -= v2.getY();
	},
	
	multiplyBy: function(scalar) {
		this._x *= scalar;
		this._y *= scalar;
	},
	
	divideBy: function(scalar) {
		this._x /= scalar;
		this._y /= scalar;
	}
};