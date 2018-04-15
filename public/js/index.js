'use strict';

angular.module("indexApp", 
	["ngRoute",
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
// Add this directive where you keep your directive