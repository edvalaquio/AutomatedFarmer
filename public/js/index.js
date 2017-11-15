'use strict';

angular.module("indexApp", ["ngRoute"])
.config(["$routeProvider", "$locationProvider",
	function($routeProvider, $locationProvider){
		$routeProvider
		.when("/", {
			templateUrl: "/partials/homePage.html"
		})
		.when("/manual", {
			templateUrl: "/partials/manualPage.html"
		})
		.when("/automated", {
			templateUrl: "/partials/autoPage.html"
		})
		.when("/activities", {
			templateUrl: "/partials/activityPage.html"
		})
	}]);