

Smog.Sunset = function(){

	/*=========================================================================
		vars
	=========================================================================*/
	var $background;
	var $gradient;
	
	//iniiiiit
	function init(){
		//grab the references
		$background = $("#Background");
		$gradient = $("#Gradient");
		//listen for resize
		$(window).resize(resize);
		//set the size initialy
		resize();
	}

	//called on resize
	function resize(){
		
	}

	//called on update 60fps
	function update(particleCount){

	}

	//called once a second
	function slowUpdate(particleCount){
		var opacity = Math.min(particleCount / 100, 1);
		$gradient.css({
			opacity : opacity,
		});

		//and the background color
		$background.css({
			opacity : 1 - opacity,
		});
	}

	return {
		initialize : init,
		update : update,
		slowUpdate : slowUpdate,
	}
}();