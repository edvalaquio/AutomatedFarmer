'use strict';

angular.module("autoFarm.controllers.manualCtrl", [
	"pr.longpress"])
.controller("manualCtrl", ["$rootScope", "$scope", "$window", "$location",
	function($rootScope, $scope, $window, $location){
		// var socket;
		var socket = io();
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
				console.log(direction);
			}, 200);
		};

		$scope.buttonReleased = function(){
			$scope.pressed = false;
			clearInterval(timeout);
		};
	}	
]);