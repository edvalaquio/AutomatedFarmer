'use strict';

angular.module("autoFarm.controllers.activityCtrl", [])
.controller("activityCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		// var socket;
		if($location.url() == '/activities' || $location.url() == '/'){
			$http({
				method	: 'GET',
				url 	: '/getEvents'
			}).then(function(res){
				$scope.lotEvents = res.data.data;
				console.log($scope.lotEvents);
			}, function(error){
				console.log(error);
			});
		}

		if($location.url() == 'activities' || $location.url() == '/'){
			$http({
				method 	: 'GET',
				url 	: '/getRiceAge'
			}).then(function(res){
				$scope.riceAge = res.data.data;
				console.log($scope.riceAge);
			}, function(error){
				console.log(error);
			});
		}
	}	
]);
