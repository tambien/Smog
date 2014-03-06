var TERP = function(){

	/*=========================================================================
		SCALING
	=========================================================================*/

	/*
		@param {number} input 0 - 1
		@param {number} outputMin
		@param {number} outputMax
		@returns {number}
	*/
	function interpolate(input, outputMin, outputMax){
		return input*(outputMax - outputMin) + outputMin;
	}

	/*
		@param {number} input
		@param {number} inputMin
		@param {number} inputMax
		@returns {number} normalizes the input between 0-1
	*/
	function normalize(input, inputMin, inputMax){
		//make sure that min < max
		if (inputMin > inputMax){
			var tmp = inputMax;
			inputMax = inputMin;
			inputMin = tmp;
		} else if (inputMin == inputMax){
			return 0;
		}
		return (input - inputMin) / (inputMax - inputMin);
	}

	
	/*=========================================================================
		SCALARS
	=========================================================================*/

	/*
		@param {number} input 0-1
		@returns {number} 
	*/
	function linear(x){
		return x;
	}

	/*
		@param {number} input 0-1
		@returns {number} 
	*/
	function exponential(x){
		return x*x;
	}

	/*
		@param {number} input 0-1
		@returns {number} 
	*/
	function logarithmic(x){
		return Math.log(interpolate(x, 1, 10)) / Math.LN10;
	}

	/*
		@param {number} input
		@param {number} min
		@param {number} max

		clips the output of input to be between min and max
	*/
	function clip(input, min, max){
		input = Math.max(input, min);
		input = Math.min(input, max);
		return input;
	}

	/*=========================================================================
		SCALE
	=========================================================================*/

	function scaleInput(args, scalar){
		//if it includes the input min/max
		if (args.length  > 4){
			var norm = normalize(args[0], args[1], args[2]);
			var scaled = scalar(norm);
			var ret = interpolate(scaled, args[3], args[4]);
			if (args[5]){
				ret = clip(ret, args[3], args[4]);
			}
			return ret;
		//else no input min/max
		} else {
			var scaled = scalar(args[0]);
			var ret = interpolate(scaled, args[1], args[2]);
			if (args[3]){
				ret = clip(ret, args[1], args[2]);
			}
			return ret;
		} 
	}

	return {
		lin : function(){
			return scaleInput(arguments, linear);
		},
		exp : function(){
			return scaleInput(arguments, exponential);
		},
		log : function(){
			return scaleInput(arguments, logarithmic);
		},
	}
}();