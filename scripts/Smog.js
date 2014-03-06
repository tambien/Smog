$(function(){
	Smog.initialize();
});


var Smog = function(){

	function init(){
		//init the sunset
		Smog.Sunset.initialize();
		Smog.Particles.initialize();
		Smog.Audio.initialize();
		Smog.Audio.loaded = loaded;
		Smog.Interface.initialize();
		Smog.Interface.playClicked = play;
		Smog.Interface.stopClicked = stop;

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

	function loaded(){
		Smog.Interface.loaded();
	}

	function play(){
		Smog.Audio.play();
	}

	function stop(){
		Smog.Audio.stop();
	}

	return {
		initialize : init,
		particleCount : 15,
	}
}();


Smog.Interface = (function(){

	var $playButton;

	function init(){

	}

	function clicked(e){
		e.preventDefault();
		$("#Play").removeClass("Visible");
		Smog.Interface.playClicked();
		$("#Stop").addClass("Visible");
	}

	function loaded(){
		$("#Play").addClass("Visible");
		$("#Play").click(clicked);
		$("#Stop").click(stop);
		$("#Loading").removeClass("Visible");
	}

	function stop(){
		$("#Play").addClass("Visible");
		$("#Stop").removeClass("Visible");
		Smog.Interface.stopClicked();
	}

	return {
		initialize: init,
		playClicked : function(){},
		stopClicked : function(){},
		loaded : loaded
	}
})()


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();