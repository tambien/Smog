$(function(){
	Smog.initialize();
});


var Smog = function(){

	var isPlaying = false;

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
		Smog.Human.clickEnd = humanRelease;

		Smog.Car.initialize();
		Smog.Car.clicked = carClicked;
		Smog.Car.clickEnd = carRelease;

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
		if (isPlaying){
			Smog.particleCount--;
			Smog.particleCount = Math.max(Smog.particleCount, 0);
			if (Smog.particleCount === 0){
				Smog.Interface.soClean();
			}
		}
		if (Smog.particleCount > 0){
			Smog.Particles.human();
		}
		Smog.Audio.humanClick();
	}

	function humanRelease(){
		Smog.Audio.humanRelease();
	}


	function carClicked(){
		if (isPlaying){
			Smog.particleCount++;
			Smog.particleCount = Math.min(Smog.particleCount, 100);
			if (Smog.particleCount === 100){
				Smog.Interface.soDirty();
			}
		}
		Smog.Particles.car();
		Smog.Audio.carClick();
	}

	function carRelease(){
		Smog.Audio.carRelease();
	}

	function loaded(){
		Smog.Interface.loaded();
	}

	function play(){
		Smog.Audio.play();
		isPlaying = true;
	}

	function stop(){
		Smog.Audio.stop();
		isPlaying = false;
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
		$(".Instruction").removeClass("Visible");
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
		$(".Instruction").addClass("Visible");
		Smog.Interface.stopClicked();
	}

	function soDirty(){
		$("#SoDirty").addClass("Visible");
		setTimeout(function(){
			$("#SoDirty").removeClass("Visible");
		}, 1000);
	}

	function soClean(){
		$("#SoClean").addClass("Visible");
		setTimeout(function(){
			$("#SoClean").removeClass("Visible");
		}, 1000);	
	}

	return {
		initialize: init,
		playClicked : function(){},
		stopClicked : function(){},
		loaded : loaded,
		soClean : soClean,
		soDirty : soDirty
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