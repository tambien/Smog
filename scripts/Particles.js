Smog.Particles = function(){

	/*=========================================================================
		GLOBALS
	=========================================================================*/

	var particles = [];

	var exhaustPosition = {x : 0, y: 0};
	var intakePosition = {x : 0, y: 0};

	function init(){
		$(window).resize(resize);
		resize();
	}

	function resize(){
		var offset = $("#Exhaust").offset();
		exhaustPosition = {x : offset.left, y : offset.top};
		var inOffset = $("#Intake").offset();
		intakePosition = {x : inOffset.left, y : inOffset.top};
	}

	function update(){
		//update all of the particle positions/opacity
		var now = Date.now();
		var newParticles = [];
		for (var i=0, len = particles.length; i < len; i++){
			var part = particles[i];
			if (!part.update(now)){
				newParticles.push(part);
			} else {
				part.dispose();
			}
		}
		particles = newParticles;
	}

	function newParticle(){
		var randX = RAND.int(exhaustPosition.x + 200, exhaustPosition.x + 300);
		var randY = RAND.int(exhaustPosition.y - 300, exhaustPosition.y - 400);
		var part = new Smog.Particle(exhaustPosition, {x: randX, y: randY}, true);
		particles.push(part);
	}	

	function removeParticle(){
		var randX = RAND.int(intakePosition.x - 150, intakePosition.x - 200);
		var randY = RAND.int(intakePosition.y - 100, intakePosition.y - 200);
		var part = new Smog.Particle({x: randX, y: randY}, intakePosition, false);
		particles.push(part);
	}

	return {
		initialize : init,
		update : update,
		car : newParticle,
		human : removeParticle,
	}
}();


/*=============================================================================
	PARTICLE

	moves from 'from' to 'to', appears or disappears
=============================================================================*/
Smog.Particle = function( from, to , appearing){
	this.from = from;
	this.to = to;
	this.appear = appearing;
	this.startTime = Date.now();
	this.$el = $("<div class='Particle'></div>");
	$("#Particles").append(this.$el);
}

Smog.Particle.prototype.appearTime = 200;

Smog.Particle.prototype.animationTime = 1000;


/*
	@returns {boolean} false if the particle still 
	needs updating or true if it's done and should be disposed
*/
Smog.Particle.prototype.update = function(now){
	var progress = now - this.startTime;
	if (progress > this.animationTime){
		return true;
	} else if (this.appear){
		var scale = TERP.lin(progress, 0, this.appearTime, 0, 1, true);
		var opacity = TERP.lin(progress, 0, this.animationTime, 1, 0);
		//put it in a new position
		var x = TERP.log(progress, 0, this.animationTime, this.from.x, this.to.x);
		var y = TERP.exp(progress, 0, this.animationTime, this.from.y, this.to.y);
		var translateString = ["translate3d(",x, "px, ", y, "px, 0px) scale(", scale , ")"];
		//and the opacity
		this.$el.css({
			"transform" : translateString.join(""),
			"opacity" : opacity
		});
		return false;
	} else {
		var opacity = TERP.lin(progress, 0, this.appearTime, 0, 1, true);
		var scale = 1 - TERP.lin(progress, this.animationTime - this.appearTime, this.animationTime, 0, 1, true);
		//put it in a new position
		var x = TERP.exp(progress, 0, this.animationTime, this.from.x, this.to.x);
		var y = TERP.log(progress, 0, this.animationTime, this.from.y, this.to.y);
		var translateString = ["translate3d(",x, "px, ", y, "px, 0px) scale(", scale , ")"];
		//and the opacity
		this.$el.css({
			"transform" : translateString.join(""),
			"opacity" : opacity
		});
		return false;
	}
}


Smog.Particle.prototype.dispose = function(){
	this.$el.remove();
	this.$el = null;
	this.from = null;
	this.to = null;
}
