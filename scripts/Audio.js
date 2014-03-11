Smog.Audio = (function(){

	var gotchPlayer;

	var audioContext = window.AudioContext !== undefined ? new AudioContext() : new webkitAudioContext();
	//shim the context
	if (audioContext.createGain === undefined){
		audioContext.createGain = audioContext.createGainNode;
	}

	//effects
	var tuna = new Tuna(audioContext);
	var distortion, filter;
	//setup the compresor
	var compressor = audioContext.createDynamicsCompressor();
	compressor.threshold.value = -12;

	function init(){
		//make the player
		gotchPlayer = new Smog.Audio.Player("./audio/gotch.mp3", audioContext, function(){
			Smog.Audio.loaded();
		});
		distortion = new Smog.Audio.Distortion(tuna, audioContext);
		filter = new Smog.Audio.Filter(audioContext);

		//connect it up
		gotchPlayer.connect(distortion.input);
		distortion.connect(filter.input);
		filter.connect(compressor);
		compressor.connect(audioContext.destination);
	}

	function play(){
		gotchPlayer.loop(audioContext);
	}

	function stop(){
		gotchPlayer.stop(audioContext);
	}

	function slowUpdate(particleCount){
		distortion.dryness(TERP.exp(particleCount, 0, 100, 0, 1));
	}

	return {
		initialize : init,
		context : audioContext,
		slowUpdate : slowUpdate,
		play : play,
		stop: stop,
		loaded : function(){},
		humanClick : function(){
			filter.humanClick();
		},
		humanRelease : function(){
			filter.humanRelease();
		},
		carClick : function(){
			filter.carClick();
		},
		carRelease : function(){
			filter.carRelease();
		},
		setAndFade : function(param, value, duration){
			var currentValue = param.value;
			var now = audioContext.currentTime;
			param.setValueAtTime(currentValue, now);
			param.linearRampToValueAtTime(value, now + duration);
		}
	}
})();


/*=============================================================================
	AUDIO PLAYER
=============================================================================*/
Smog.Audio.Player = function(url, audioContext, callback){
	this.output = audioContext.createGain();
	this.source = null;
	//load it up
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	// Decode asynchronously
	var self = this;
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(b) {
			self.buffer = b;
			if (callback){
				callback();
			}
		});
	}
	request.send();
}


Smog.Audio.Player.prototype.loop = function(context){
	if (this.buffer !== null){
		var now = context.currentTime;
		this.source = context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.loop = true;
		this.source.connect(this.output);
		if (typeof this.source.start === "function"){
			this.source.start(now);
		} else {
			//fall back to older web audio implementation
			this.source.noteOn(now);
		}
	} 
}

Smog.Audio.Player.prototype.stop = function(){
	var source = this.source;
	if (typeof this.source.stop === "function"){
		source.stop(0);
	} else {
		//fall back to older web audio implementation
		source.noteOff(0);
	}
}

Smog.Audio.Player.prototype.connect = function(node){
	this.output.connect(node);
}


/*=============================================================================
	DISTORTION EFFECT
=============================================================================*/
Smog.Audio.Distortion = function(tuna, audioContext){
	//connect the player to some effects
	this.distortion = new tuna.Overdrive({
		outputGain: 1,         //0 to 1+
		drive: .1,              //0 to 1
		curveAmount: 1,          //0 to 1
		algorithmIndex: 1,       //0 to 5, selects one of our drive algorithms
	});

	this.dry = audioContext.createGain();
	this.wet = audioContext.createGain();

	this.input = audioContext.createGain();
	this.output = audioContext.createGain();

	//dry channel
	this.input.connect(this.dry);
	this.dry.connect(this.output);
	this.dry.gain.value = 1;
	//wet connection
	this.input.connect(this.distortion.input);
	this.distortion.connect(this.wet);
	this.wet.connect(this.output);
	this.wet.gain.value = 0;

	this.audioContext = audioContext;
}

Smog.Audio.Distortion.prototype.connect = function(node){
	this.output.connect(node);
}

//@param {number} dryness 0-1
//happens over 1 second duration
Smog.Audio.Distortion.prototype.dryness = function(dryness){
	var now = this.audioContext.currentTime;
	//set the dry
	var currentDry = this.dry.gain.value;
	this.dry.gain.setValueAtTime(currentDry, now);
	this.dry.gain.linearRampToValueAtTime(1 - dryness, now + 1);
	//and the wet
	var currentWet = this.wet.gain.value;
	this.wet.gain.setValueAtTime(currentWet, now);
	this.wet.gain.linearRampToValueAtTime(dryness*1.3, now + 1);
}

/*=============================================================================
	FILTER
=============================================================================*/
Smog.Audio.Filter = function(audioContext){
	//flags
	this.humanDown = false;
	this.carDown = false;
	//the lets
	this.input = audioContext.createGain();
	this.output = audioContext.createGain();
	//the filters
	this.carFilter = audioContext.createBiquadFilter();
	this.carFilter.type = 0;
	this.carFilter.frequency.value = 250;
	this.carFilter.Q.value = 10;
	this.humanFilter = audioContext.createBiquadFilter();
	this.humanFilter.type = 1;
	this.humanFilter.frequency.value = 1600;
	this.humanFilter.Q.value = 10;
	//the gains
	this.carGain = audioContext.createGain();
	this.carGain.gain.value = 0;
	this.humanGain = audioContext.createGain();
	this.humanGain.gain.value = 0;
	this.passThrough = audioContext.createGain();
	this.passThrough.gain.value = 1;
	//connect it up
	this.input.connect(this.passThrough);
	this.passThrough.connect(this.output);
	//car filter
	this.input.connect(this.carGain);
	this.carGain.connect(this.carFilter);
	this.carFilter.connect(this.output);
	//human filter
	this.input.connect(this.humanGain);
	this.humanGain.connect(this.humanFilter);
	this.humanFilter.connect(this.output);
}

Smog.Audio.Filter.prototype.fadeTime = .01;

Smog.Audio.Filter.prototype.humanClick = function(){
	this.humanDown = true;
	this.byPass();
	Smog.Audio.setAndFade(this.humanGain.gain, 1, this.fadeTime);
}

Smog.Audio.Filter.prototype.humanRelease = function(){
	this.humanDown = false;
	this.byPass();
	Smog.Audio.setAndFade(this.humanGain.gain, 0, this.fadeTime);
}

Smog.Audio.Filter.prototype.carClick = function(){
	this.carDown = true;
	this.byPass();
	Smog.Audio.setAndFade(this.carGain.gain, 1, this.fadeTime);
}

Smog.Audio.Filter.prototype.carRelease = function(){
	this.carDown = false;
	this.byPass();
	Smog.Audio.setAndFade(this.carGain.gain, 0, this.fadeTime);
}

Smog.Audio.Filter.prototype.byPass = function(){
	if (this.carDown || this.humanDown){
		Smog.Audio.setAndFade(this.passThrough.gain, 0, this.fadeTime);
	} else {
		Smog.Audio.setAndFade(this.passThrough.gain, 1, this.fadeTime);
	}
}

Smog.Audio.Filter.prototype.connect = function(node){
	this.output.connect(node);
}