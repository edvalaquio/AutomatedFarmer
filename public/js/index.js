'use strict';

angular.module("indexApp", 
	["ngRoute",
	"controllers.modalController",
	"autoFarm.controllers.manualCtrl",
	"autoFarm.controllers.autoCtrl"])
.config(["$routeProvider", "$locationProvider",
	function($routeProvider, $locationProvider){
		$routeProvider
		.when("/", {
			templateUrl: "/partials/homePage.php"
		})
		.when("/manual", {
			templateUrl: 	"/partials/manualPage.html",
			controller: 	"manualCtrl"
		})
		.when("/automated", {
			templateUrl: "/partials/autoPage.html",
			controller: 	"autoCtrl"
		})
		.when("/activities", {
			templateUrl: "/partials/activityPage.html"
		})
}])
.controller("indexCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
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
