var _ = require('lodash');

var Path = function(matrix){
	this.matrix = matrix;
	this.row = matrix.length;
	this.column = matrix[0].length;
}

Path.prototype.verifyPath = function(){}

Path.prototype.generateStartPoints = function(){
	var startPoints = [];
	for(var i = 0; i < this.row; i++){
		for(var j = 0; j < this.column; j++){
			var currentNode = {
				value 	: this.matrix[i][j],
				x 		: i,
				y 		: j
			};
			if(currentNode.value && this.isStartPoint(currentNode)){
				startPoints.push({x: currentNode.x, y: currentNode.y});
			}
		}
	}
	return startPoints;
}

Path.prototype.isStartPoint = function(node){
	var neighbors = this.getNeighbors(node);
	var numTrue = _.filter(neighbors, ['value', true]);
	var numFalse = _.filter(neighbors, ['value', false]);
	var numNone = _.filter(neighbors, ['value', 'none']);
	if(numTrue.length == 3 && ((numFalse.length + numNone.length) == 5)){
		return true;
	} 
	return false;
}

Path.prototype.getNeighbors = function(node){
	var neighbors = [];
	for(var i = node.x - 1; i < node.x + 2; i++){
		for(var j = node.y - 1; j < node.y + 2; j++){
			var coordinate =  i + ',' + j;
			var value;

			if(i < 0 || j < 0 || i == this.row || j == this.column){
				value = "none";
			} else if(i == node.x && j == node.y){
				value = "self";
			} else {
				value = this.matrix[i][j]
			}

			var side = this.getSide(i, j, node);
			neighbors.push({
				coordinate: coordinate,
				value: 		value,
				side: 		side
			});
		}
	}
	return neighbors;
}

Path.prototype.getSide = function(i, j, node){
	if(j == node.y){
		side = "";
	} else if(j < node.y){
		side = "top";
	} else {
		side = "bottom";
	}
	if(i == node.x){
		side = side + "";
	} else if(i < node.x){
		side = side + "left";
	} else {
		side = side + "right";
	}
	return side;
}

Path.prototype.generatePath = function(startPoint){}

var sample = [
	[true,true,false],
	[true,true,false],
	[false,true,false]
]
var pathSample = new Path(sample);
console.log(pathSample.getNeighbors({value: true, x: 0, y: 0}));
console.log(pathSample.generateStartPoints());

module.exports = Path;