'use strict';

angular.module("indexApp", 
	["ngRoute",
	"autoFarm.controllers.manualCtrl"])
.config(["$routeProvider", "$locationProvider",
	function($routeProvider, $locationProvider){
		$routeProvider
		.when("/", {
			templateUrl: "/partials/homePage.html"
		})
		.when("/manual", {
			templateUrl: 	"/partials/manualPage.html",
			controller: 	"manualCtrl"
		})
		.when("/automated", {
			templateUrl: "/partials/autoPage.html"
		})
		.when("/activities", {
			templateUrl: "/partials/activityPage.html"
		})
}])
// Add this directive where you keep your directive