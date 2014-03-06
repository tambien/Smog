/*=============================================================================
	HUMAN
=============================================================================*/
Smog.Human = (function(){

	var humanKey = 76; //L

	function init(){
		//bind all of the events
		$(document).keydown(function(e){
			if (e.which === humanKey){
				e.preventDefault();
				clickStart();
			}
		});
		$(document).keyup(function(e){
			if (e.which === humanKey){
				clickEnd();
			}
		});
		//bind all of the events
		$("#Person").mousedown(function(e){
			e.preventDefault();
			clickStart();
		});
		$("#Person").mouseup(function(e){
			clickEnd();
		});
	}

	//the interval
	var fireInterval = -1;

	function clickStart(){
		if (fireInterval === -1){
			$("#Mouth").addClass("Open");
			fireInterval = setInterval(clickFire, 200);
		}
	}

	function clickEnd(){
		clearInterval(fireInterval);
		fireInterval = -1;
		$("#Mouth").removeClass("Open");
	}

	//trigger the click action
	function clickFire(){
		Smog.Human.clicked();
	}

	return {
		initialize : init,
		clicked : function(){}
	}
})();


/*=============================================================================
	CAR
=============================================================================*/
Smog.Car = (function(){

	var carKey = 83; //S

	function init(){
		//bind all of the events
		$(document).keydown(function(e){
			if (e.which === carKey){
				e.preventDefault();
				clickStart();
			}
		});
		$(document).keyup(function(e){
			if (e.which === carKey){
				clickEnd();
			}
		});
		//bind all of the events
		$("#Car").mousedown(function(e){
			e.preventDefault();
			clickStart();
		});
		$("#Car").mouseup(function(e){
			clickEnd();
		});
	}

	//the interval
	var fireInterval = -1;

	function clickStart(){
		if (fireInterval === -1){
			clickFire();
			fireInterval = setInterval(clickFire, 200);
		}
	}

	function clickEnd(){
		clearInterval(fireInterval);
		fireInterval = -1;
	}

	//trigger the click action
	function clickFire(){
		Smog.Car.clicked();
	}

	return {
		initialize : init,
		clicked : function(){}
	}
})();