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
			$scope.xAxis = computeRange(length)
			$scope.yAxis = computeRange(width)
		}

		var computeRange = function(value){
			var array = [];
			for(var i = 0; i < value; i++){
				array.push(i);
			}
			return array;
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
