/*=============================================================================
	HUMAN
=============================================================================*/
Smog.Human = (function(){

	var humanKey = 73; //I

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
				e.preventDefault();
				clickEnd();
			}
		});
		//bind all of the events
		$("#Person").bind("mousedown touchstart", function(e){
			e.preventDefault();
			clickStart();
		});
		$("#Person").bind("mouseup touchend", function(e){
			e.preventDefault();
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
		Smog.Human.clickEnd();
	}

	//trigger the click action
	function clickFire(){
		Smog.Human.clicked();
	}

	return {
		initialize : init,
		clicked : function(){},
		clickEnd : function(){}
	}
})();


/*=============================================================================
	CAR
=============================================================================*/
Smog.Car = (function(){

	var carKey = 69; //E

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
		Smog.Car.clickEnd();
	}

	//trigger the click action
	function clickFire(){
		Smog.Car.clicked();
	}

	return {
		initialize : init,
		clicked : function(){},
		clickEnd : function(){}
	}
})();