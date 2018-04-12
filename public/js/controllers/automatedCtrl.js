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
		$scope.axis = [[]];

		$scope.computeDimensions = function(length, width){
			$scope.area = length*width;
			$scope.xAxis = computeRange(length);
			$scope.yAxis = computeRange(width);
		}

		$scope.printAxis = function(){
			console.log($scope.axis);
		}

		$scope.toggleSelectAll = function(){

			for(var i = 0; i < $scope.xAxis.length; i++){
				$scope.axis[i] = _.values($scope.axis[i]);
				for(var j = 0; j < $scope.yAxis.length; j++){
					$scope.axis[i][j] = !$scope.axis[i][j];
				}
			}
			console.log($scope.axis);
			// console.log($scope.axis);
			// for(var i = 0; i < $scope.xAxis; i++){
			// 	$scope.axis[i] = _.values($scope.axis[x]);
			// 	// for(var j = 0; j < $scope.yAxis; j++){
			// 	// 	$scope.axis[i][j] = true;
			// 	// }
			// }
			// console.log($scope.axis);
			// console.log(_.values($scope.axis));
			// console.log(_);
			// $scope.axis.forEach(function(item, index){
			// 	// _.values(item);
			// 	item = _.values(item);
			// 	console.log(item);
			// 	item.forEach(function(item1){
			// 		item1 = true;
			// 	});
			// 	// item = Array.from(item);
			// 	// console.log(item);
			// 	// item.forEach(function(item1, index){
			// 	// })
			// });
			// console.log($scope.axis);
			// var boxes = Array.from(document.getElementsByClassName('checkbox-big'));
			// console.log(boxes);

			// boxes.forEach(function(item, index){
			// 	item.value = true;
			// });
		}

		var checkAll = function(x){
			var checks = [];
			for(var i = 0; i < x; i++){
				checks[i] = true;
			}
			return checks;
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
					temp[i][j] = true;
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
