
var something = function(input){
	input++;
	// console.log(input);
	return input;
}

// var numbers = 1;
var sample = function(){
	var hello = 1;
	var interval = setInterval(something, 1000, hello);
}

sample();