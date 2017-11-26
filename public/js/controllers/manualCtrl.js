'use strict';

angular.module("autoFarm.controllers.manualCtrl", [])
.controller("manualCtrl", ["$rootScope", "$scope", "$window", "$location",
	function($rootScope, $scope, $window, $location){
		// var socket;
		var socket = io();
		console.log("Here in manualCtrl");

		$scope.move = function(direction){
			console.log(direction);
			socket.emit('move', direction);
		}
	}	
]);