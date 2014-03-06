$(function(){
	Smog.initialize();
});


var Smog = function(){

	function init(){
		//init the sunset
		Smog.Sunset.initialize();
		Smog.Particles.initialize();
		Smog.Audio.initialize();

		//the actors
		Smog.Human.initialize();
		Smog.Human.clicked = humanClicked;

		Smog.Car.initialize();
		Smog.Car.clicked = carClicked;

		//start the loops
		update();
		slowUpdate();
	}

	function bindEvents(){
		
	}

	//called 60fps
	function update(){
		requestAnimFrame(update);
		// Smog.Sunset.update();
		Smog.Particles.update();
	}

	//calls 1fps
	function slowUpdate(){
		setTimeout(slowUpdate, 1000);
		Smog.Sunset.slowUpdate(Smog.particleCount);
		Smog.Audio.slowUpdate(Smog.particleCount);
	}

	function humanClicked(){
		Smog.particleCount--;
		Smog.particleCount = Math.max(Smog.particleCount, 0);
		if (Smog.particleCount > 0){
			Smog.Particles.human();
		}
	}


	function carClicked(){
		Smog.particleCount++;
		Smog.particleCount = Math.min(Smog.particleCount, 100);
		Smog.Particles.car();
	}

	return {
		initialize : init,
		particleCount : 15,
	}
}();


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();