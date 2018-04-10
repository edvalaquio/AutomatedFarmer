'use strict';

angular.module("autoFarm.controllers.autoCtrl", [])
.controller("autoCtrl", ["$rootScope", "$scope", "$window", "$location",
	function($rootScope, $scope, $window, $location){
		// var socket;
		var socket = io();
		console.log("Here in autoCtrl");
		$scope.area = "none";
		$scope.xAxis = false;
		$scope.yAxis = false;

		$scope.computeDimensions = function(length, width){
			$scope.area = length*width;
			$scope.xAxis = computeRange(length);
			$scope.yAxis = computeRange(width);
			$scope.axis = initializeAxis($scope.xAxis, $scope.yAxis);
			console.log($scope.xAxis);
			console.log($scope.yAxis);
		}

		// $scope.storeAxis = function(x, y){
		// 	// console.log($scope.axis);
		// 	$scope.axis[x][y] = !$scope.axis[x][y];
		// 	console.log($scope.axis);
		// }

		$scope.printAxis = function(){
			console.log($scope.axis);
		}

		var computeRange = function(value){
			var array = [];
			for(var i = 0; i < value; i++){
				array.push(i);
			}
			return array;
		}

		var initializeAxis = function(x, y){
			var temp = [[]];
			for(var i = 0; i < x; i++){
				for(var j = 0; j < y; j++){
					temp[i][j] = false;
				}
			}
			return temp;
		}

		// $scope.sample = false;
		// $scope.move = function(direction){
		// 	console.log(direction);
		// 	socket.emit('move', direction);
		// }

		// var timeout;
		// $scope.buttonPressed = function(direction){
		// 	//~ console.log(direction);
		// 	$scope.pressed = true;
		// 	timeout = setInterval(function(){
		// 		socket.emit('move', direction);
		// 	}, 0.5);
		// };

		// $scope.buttonReleased = function(){
		// 	$scope.pressed = false;
		// 	clearInterval(timeout);
		// 	socket.emit('stop');
		// };
	}	
]);
