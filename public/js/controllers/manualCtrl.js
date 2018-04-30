'use strict';

angular.module("autoFarm.controllers.manualCtrl", [
	"pr.longpress"])
.controller("manualCtrl", ["$rootScope", "$scope", "$window", "$location",
	function($rootScope, $scope, $window, $location){
		// var socket;

		var socket = io('http://' + $rootScope.hostAddress + ':3000');
		console.log("Here in manualCtrl");
		$scope.sample = false;
		$scope.move = function(direction){
			console.log(direction);
			socket.emit('move', direction);
		}

		var timeout;
		$scope.buttonPressed = function(direction){
			console.log(direction);
			$scope.pressed = true;
			timeout = setInterval(function(){
				socket.emit('manual-move', direction);
			}, 0.6);
		};

		$scope.buttonReleased = function(){
			$scope.pressed = false;
			clearInterval(timeout);
			socket.emit('stop');
		};
	}	
]);
