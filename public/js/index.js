'use strict';

angular.module("indexApp", 
	["ngRoute",
	"autoFarm.controllers.manualCtrl",
	"autoFarm.controllers.autoCtrl",
	"controllers.modalController"])
.config(["$routeProvider", "$locationProvider",
	function($routeProvider, $locationProvider){
		$routeProvider
		.when("/", {
			templateUrl: 	"/partials/home.html",
			controller:     "indexCtrl"
		})
		.when("/manual", {
			templateUrl: 	"/partials/manualPage.html",
			controller: 	"manualCtrl"
		})
		.when("/automated", {
			templateUrl: "/partials/autoChoose.html",
			controller: 	"autoCtrl"
		})
		.when("/automated/:lotid", {
			templateUrl: "/partials/autoControl.html",
			controller: 	"autoCtrl"
		})
		.when("/activities", {
			templateUrl: "/partials/activityPage.html"
		})
}])
.controller("indexCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		$scope.active = $location.url();
		$http({
			method	: 'GET', 
			url		: '/getSocketData'
		}).then(function(res){
			$rootScope.hostAddress = res.data;
			console.log(res);
		}, function(error){
			console.log(error);
		});

		$scope.time = new Date();
		var time = $scope.time;
		var hours = time.getHours();
		
		if(hours < 12){
			$scope.greet = "Good Morning";
		}
		else if(hours >= 12 && hours <= 17){
			$scope.greet = "Good Afternoon";
		}
		else if(hours > 17 && hours <=24){
			$scope.greet = "Good Evening";
		}
	}	
]);

// Add this directive where you keep your directive
