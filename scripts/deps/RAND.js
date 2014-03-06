var RAND = (function(){

	//RANDOM NUMBER GENERATOR//////////////////////////////////////////////////
	//From http://baagoe.com/en/RandomMusings/javascript/
	//Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
	var generator = (function(){
		function Mash() {
			var n = 0xefc8249d;
			var mash = function(data) {
				data = data.toString();
				var i;
				for( i = 0; i < data.length; i++) {
					n += data.charCodeAt(i);
					var h = 0.02519603282416938 * n;
					n = h >>> 0;
					h -= n;
					h *= n;
					n = h >>> 0;
					h -= n;
					n += h * 0x100000000;
					// 2^32
				}
				return (n >>> 0) * 2.3283064365386963e-10;
				// 2^-32
			};

			mash.version = 'Mash 0.9';
			return mash;
		};

		// From http://baagoe.com/en/RandomMusings/javascript/
		function Alea() {
			return ( function(args) {
				// Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
				var s0 = 0;
				var s1 = 0;
				var s2 = 0;
				var c = 1;

				if(args.length == 0) {
					args = [+new Date];
				}
				var mash = Mash();
				s0 = mash(' ');
				s1 = mash(' ');
				s2 = mash(' ');

				for(var i = 0; i < args.length; i++) {
					s0 -= mash(args[i]);
					if(s0 < 0) {
						s0 += 1;
					}
					s1 -= mash(args[i]);
					if(s1 < 0) {
						s1 += 1;
					}
					s2 -= mash(args[i]);
					if(s2 < 0) {
						s2 += 1;
					}
				}
				mash = null;

				var random = function() {
					var t = 2091639 * s0 + c * 2.3283064365386963e-10;
					// 2^-32
					s0 = s1;
					s1 = s2;
					return s2 = t - ( c = t | 0);
				};
				random.uint32 = function() {
					return random() * 0x100000000;
					// 2^32
				};
				random.fract53 = function() {
					return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16;
					// 2^-53
				};
				random.version = 'Alea 0.9';
				random.args = args;
				return random;

			}(Array.prototype.slice.call(arguments)));
		};
		return Alea();
	})();

	//@param {number} input 0 - 1
	function scale(input, outputMin, outputMax){
		return input*(outputMax - outputMin) + outputMin;
	}


	//GET RANDOMS//////////////////////////////////////////////////////////////
	
	function getRandom(){
		var num = generator();
		if (arguments.length === 2){
			return scale(num, arguments[0], arguments[1]);
		} else if (arguments.length === 1){
			return num*arguments[0];
		} else {
			return num;
		}
	}

	function getRandomInt(){
		return parseInt(getRandom.apply(this, arguments), 10);
	}

	function getRandomArray(){
		var from;
		var to;
		var length;
		if (arguments.length === 3){
			length = arguments[2];
			to = arguments[1];
			from = arguments[0];
		} else if (arguments.length === 2){
			length = arguments[1];
			to = arguments[0];
			from = 0;
		} else if (arguments.length === 1){
			length = arguments[0];
			from = 0;
			to = 1;
		}
		var randArray = new Array(length);
		for (var i = 0; i < length; i++){
			randArray[i] = getRandom(from, to);
		}
		return randArray;
	}

	function getRandomString(length){
		var alphaNumeric = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var alphaNumericLen = alphaNumeric.length;
		var randStr = new Array(length);
		for (var i = 0; i < length; i++){
			randStr[i] = alphaNumeric.charAt(getRandomInt(alphaNumericLen));
		}
		return randStr.join("");
	}

	//pick one from the array
	function choose(array) {
		return array[getRandomInt(array.length)];
	};

	//@returns a shuffled copy of the input array
	//sourced from http://snippets.dzone.com/posts/show/849
	function shuffleArray(arr) {
		var o = arr.slice(0);
		for(var j, x, i = o.length; i; j = parseInt(generator() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};


	return {
		num : getRandom,
		int : getRandomInt,
		array : getRandomArray,
		string : getRandomString,
		choose : choose,
		shuffle : shuffleArray,
	}
})();
