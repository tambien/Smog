Smog.Audio = (function(){

	var gotchPlayer;

	var audioContext = window.AudioContext !== undefined ? new AudioContext() : new webkitAudioContext();
	//shim the context
	if (audioContext.createGain === undefined){
		audioContext.createGain = audioContext.createGainNode;
	}

	//effects
	var tuna = new Tuna(audioContext);
	var distortion;
	//setup the compresor
	var compressor = audioContext.createDynamicsCompressor();
	compressor.threshold.value = -12;

	function init(){
		//make the player
		gotchPlayer = new Smog.Audio.Player("./audio/gotch.mp3", audioContext, function(){
			Smog.Audio.loaded = true;
		});
		distortion = new Smog.Audio.Distortion(tuna, audioContext);

		//connect it up
		gotchPlayer.connect(distortion.input);
		distortion.connect(audioContext.destination);
		compressor.connect(audioContext.destination);
	}

	function play(){
		gotchPlayer.loop(audioContext);
	}

	function slowUpdate(particleCount){
		distortion.dryness(TERP.exp(particleCount, 0, 100, 0, 1));
	}

	return {
		initialize : init,
		context : audioContext,
		slowUpdate : slowUpdate,
		play : play,
		loaded : false,
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
		this.source = context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.loop = true;
		this.source.connect(this.output);
		if (typeof this.source.start === "function"){
			this.source.start();
		} else {
			//fall back to older web audio implementation
			this.source.noteOn();
		}
	} 
}

Smog.Audio.Player.prototype.stop = function(){
	var source = this.source;
	if (typeof this.source.stop === "function"){
		source.stop();
	} else {
		//fall back to older web audio implementation
		source.noteOff();
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
	//wet connection
	this.input.connect(this.distortion.input);
	this.distortion.connect(this.wet);
	this.wet.connect(this.output);

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