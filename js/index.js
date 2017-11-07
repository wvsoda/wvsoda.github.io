function setup() {
	var canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
		
	var mouseParticle = particle.create(0, 0, 0, 0);
		mouseParticle.mass = 1000;
		
	var middle = particle.create(width / 2, height / 2, 0, 0);
		middle.mass = 300;
		
	var orbits = [],
		text = ["ABOUT", "CONTACT", "PROJECTS", "CALANDER"];
		
	var about = particle.create(middle.x + middle.mass / 2, middle.y, 1, Math.PI / 2),
		contact = particle.create(middle.x - middle.mass / 2, middle.y, 1, -Math.PI / 2),
		projects = particle.create(middle.x, middle.y - middle.mass, 1, 0),
		newsletter = particle.create(middle.x, middle.y + middle.mass, 1, -Math.PI);
		
		orbits.push(about);
		orbits.push(contact);
		orbits.push(projects);
		orbits.push(newsletter);
		
	for(var f = 0; f < orbits.length; f++) {
		orbits[f].addGravitation(middle);
		orbits[f].mass = 20;
		orbits[f].radius = 50;
	}
		
	var blobs = [],
		totalPoints = [];
		
		document.body.appendChild(canvas);
		
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
		
	var blob = function(x, y, vect) {
		this.points = [];
		this.pointRadius = 1;
		this.force = vect;
		this.radius = 30;
		var dir = (Math.random() < 0.5) ? Math.PI * Math.random() : -Math.PI * Math.random();
		this.particle = particle.create(x, y, 2, dir, 0.98);
		//this.particle.addGravitation(middle);
		this.particle.mass = 200 * Math.random() + 100;
		
		this.elasticity = 0.05;
		
		this.numPoints = 16;
		
		for(var i = 0; i < this.numPoints; i++) {
			var p1 = particle.create( this.particle.x + Math.cos(Math.PI * 2 / this.numPoints * i), this.particle.y + Math.sin(Math.PI * 2 / this.numPoints * i), 0, 0, 0.80);
			this.points.push(p1);
			totalPoints.push(p1);
		}
		
		
		for(var i = 0; i < this.points.length; i++) {
			this.points[i].addSpring(this.particle, this.elasticity, this.radius);
		}
		
		for(var i = 1; i < this.points.length; i++) {
			this.points[i].addSpring(this.points[i-1], this.elasticity, this.radius / 2 * Math.random());
			this.points[i-1].addSpring(this.points[i], this.elasticity, this.radius / 2 * Math.random());
		}
		
		for(var i = this.points.length - 1; i >= this.points.length / 2; i--) {
			var index = i - this.points.length / 2;
			this.points[i].addSpring(this.points[index], this.elasticity, this.radius * 2);
			this.points[index].addSpring(this.points[i], this.elasticity, this.radius * 2);
		}
		
		
		this.points[this.points.length - 1].addSpring(this.points[0], this.elasticity, this.radius / 2);
		
		this.draw = function() {
			if(this.particle.x + this.radius >= width) {
				var h = this.particle.getHeading();
				this.particle.x = width - this.radius;
				var lx = this.force.getX(),
					ly = this.force.getY();
					this.particle.setSpeed(this.particle.getSpeed() * 0.4);
				this.force = vector.create(-1 * lx, ly);
			}
			if(this.particle.x - this.radius <= 0) {
				var h = this.particle.getHeading();
				this.particle.x = 0 + this.radius;
				var lx = this.force.getX(),
					ly = this.force.getY();
					this.particle.setSpeed(this.particle.getSpeed() * 0.4);
				this.force = vector.create(-1 * lx, ly);
			}
			if(this.particle.y + this.radius >= height) {
				var h = this.particle.getHeading();
				this.particle.y = height - this.radius;
				var lx = this.force.getX(),
					ly = this.force.getY();
					this.particle.setSpeed(this.particle.getSpeed() * 0.4);
				this.force = vector.create(lx, -1 * ly);
			}
			if(this.particle.y - this.radius <= 0) {
				var h = this.particle.getHeading();
				this.particle.y = 0 + this.radius;
				var lx = this.force.getX(),
					ly = this.force.getY();
				this.particle.setSpeed(this.particle.getSpeed() * 0.4);
				this.force = vector.create(lx, -1 * ly);
			}
			
			for(var w = 0; w < blobs.length; w++) {
				if(blobs[w] != this) {
					this.particle.gravitateTo(blobs[w].particle);
				}
			}
			
			this.particle.gravitateTo(mouseParticle);
				

			//this.particle.accelerate(this.force.getX(), this.force.getY());
			this.particle.update();
			/*for(var i = 0; i < this.points.length; i++) {
				this.points[i].accelerate(this.force.getX(), this.force.getY());
			}*/
			var rval = Math.floor(255 - (this.particle.mass / 300 * 255));
			ctx.fillStyle = "rgba(" + rval + ", 0, 0, 1)";
			ctx.strokeStyle = "rgba(" + rval + ", 0, 0, 1)";
			for(var i = 0; i < this.points.length; i++) {
				this.points[i].update();
				ctx.beginPath();
				ctx.arc(this.points[i].x, this.points[i].y, this.pointRadius, 0, Math.PI * 2);
				ctx.fill();
				
					for(var k = 0; k < this.points[i].springs.length; k++) {
						ctx.moveTo(this.points[i].x, this.points[i].y);
						ctx.lineTo(this.points[i].springs[k].point.x, this.points[i].springs[k].point.y);
						ctx.stroke();
					}
					
				ctx.closePath();
			}
			
			/*ctx.beginPath();
			ctx.arc(this.particle.x, this.particle.y, this.radius, 0, Math.PI * 2);
			ctx.fillStyle = "red";
			ctx.arc(this.particle.x, this.particle.y, 20, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			ctx.closePath();*/
		};
	};
	
	for(var t = 0; t < 10; t++) {
		var m1 = (Math.random() < 0.5) ? Math.random() * -0.01 : Math.random() * 0.01,
	   	 	m2 = (Math.random() < 0.5) ? Math.random() * -0.01 : Math.random() * 0.01;
		var blob1 = new blob(Math.random() * width / 2 + width / 4, Math.random() * height / 2 + height / 4, vector.create(m1, m2));
		//var blob1 = new blob(Math.random() * width / 2 + width / 4, Math.random() * height / 2 + height / 4, vector.create(0, 0));
		blobs.push(blob1);
	}
	
	canvas.addEventListener("mousedown", function(event) {
		var chosen;
		for(var i = 0; i < orbits.length; i++) {
			if(utils.distanceTo(event.x, event.y, orbits[i].x, orbits[i].y) <= orbits[i].radius) {
				//alert("okay")
				chosen = orbits[i];
				location.href = 'Information/info.html';
			}
		}
	});
	
	canvas.addEventListener("mousemove", function(event) {
		mouseParticle.x = event.x;
		mouseParticle.y = event.y;
	});
	
	update();
	
	function update() {
		ctx.clearRect(0, 0, width, height);
		//ctx.fillStyle = "black";
		for(var t = 0; t < blobs.length; t++) {
			//ctx.fillStyle = utils.randomColor();
			blobs[t].draw();
		}
		
		
		/*ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
		ctx.fillRect(0, 0, width, height);*/
		
		/*ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(middle.x, middle.y, 200, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();*/
		
		/*ctx.beginPath();
		ctx.fillStyle = "orange";
		ctx.arc(middle.x, middle.y, 75, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();*/
		
		ctx.font = "100px Times";
		ctx.fillStyle = "black";
		ctx.fillText("Westview", width / 2 - 200, height / 2 - 100);
		ctx.fillText("Software Developers", width / 2 - 430, height / 2);
		ctx.fillText("Association", width / 2 - 275, height / 2 + 100);
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		ctx.fillRect(0, 0, width, height);
		
		ctx.font = "15px Times";
		
		for(var v = 0; v < orbits.length; v++) {
			var pt = orbits[v];
				pt.update();
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "white";
			ctx.fillText(text[v], pt.x - text[v].length * 5, pt.y + 5);
		}
		
		requestAnimationFrame(update);
	}
}

setup();