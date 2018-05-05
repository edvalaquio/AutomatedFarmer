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
			templateUrl: 	"/partials/activityPage.html"
		})
		.when("/manual", {
			templateUrl: 	"/partials/manualPage.html",
			controller: 	"manualCtrl"
		})
		.when("/automated/autoPilot", {
			templateUrl: 	"/partials/autoPilotPage.html",
			controller: 	"autoPilotCtrl"
		})
		.when("/automated", {
			templateUrl: 	"/partials/autoChoosePage.html",
			controller: 	"autoCtrl"
		})
		.when("/automated/schedule/:lotid", {
			templateUrl: 	"/partials/autoSchedulePage.html",
			controller: 	"autoCtrl"
		})
		.when("/automated/activity/:lotid", {
			templateUrl: 	"/partials/autoControlPage.html",
			controller: 	"autoCtrl"
		})
		.when("/activities", {
			templateUrl: 	"/partials/activityPage.html"
		})
}])
.controller("indexCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		$scope.active = $location.url();
		if(!$scope.hasSocket){
			$http({
				method	: 'GET', 
				url		: '/getSocketData'
			}).then(function(res){
				var hostAddress = res.data;
				$rootScope.socket = io('http://' + hostAddress + ':3000');
				$scope.hasSocket = true;
				console.log(res);
			}, function(error){
				console.log(error);
			});
		}

		if($location.url() == '/activities' || 
			$location.url() == '/'){
			$http({
				method	: 'GET',
				url 	: '/getLotActivities'
			}).then(function(res){
				$scope.lotActivities = res.data;
				console.log(res.data);
			}, function(error){
				console.log(error);
			});
		}
	}	
]);

// Add this directive where you keep your directive
