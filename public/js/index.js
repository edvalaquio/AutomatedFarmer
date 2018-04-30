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
			templateUrl: 	"/partials/homePage.html",
		})
		.when("/manual", {
			templateUrl: 	"/partials/manualPage.html",
			controller: 	"manualCtrl"
		})
		.when("/automated/autoPilot", {
			templateUrl: "/partials/autoPilotPage.html",
			controller: 	"autoPilotCtrl"
		})
		.when("/automated", {
			templateUrl: "/partials/autoChoosePage.html",
			controller: 	"autoCtrl"
		})
		.when("/automated/:lotid", {
			templateUrl: "/partials/autoControlPage.html",
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

	}	
]);

// Add this directive where you keep your directive
