'use strict';

angular.module("autoFarm.controllers.activityCtrl", [])
.controller("activityCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		// var socket;
		if($location.url() == '/activities' || 
			$location.url() == '/'){
			$http({
				method	: 'GET',
				url 	: '/getEvents'
			}).then(function(res){
				$scope.lotActivities = res.data.data;
				console.log($scope.lotActivities);
			}, function(error){
				console.log(error);
			});
		}
	}	
]);
