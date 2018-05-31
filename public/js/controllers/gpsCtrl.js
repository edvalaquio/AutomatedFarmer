'use strict';

angular.module("autoFarm.controllers.gpsCtrl", [])
.controller("gpsCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		// var socket;
		console.log("Here in GPS Tester!");
		$scope.requestGPS = function(){
			$rootScope.socket.emit('request-gps-data');
		}

		$rootScope.socket.on('gps-data', function(data){
			$scope.gpsData = data;
		})
	}	
]);
