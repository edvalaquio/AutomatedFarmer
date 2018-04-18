'use strict';

angular.module("autoFarm.controllers.autoCtrl", ["ui.bootstrap"])
.controller("autoCtrl", ["$rootScope", "$scope", "$window", "$location",
	function($rootScope, $scope, $window, $location){
		// var socket;

		$scope.towns = ['Jaro', 'Tanza', 'Miagao', 'Jamindan', 'Iloilo', 'Roxas'];

		var socket = io('http://' + $rootScope.hostAddress + ':3000');
		console.log("Here in autoCtrl");
		$scope.xAxis = false;
		$scope.yAxis = false;
		$scope.axis = [[]];

		$scope.computeDimensions = function(length, width){
			// $scope.area = length*width;
			$scope.xAxis = computeRange(length);
			$scope.yAxis = computeRange(width);
			for(var i = 0; i < length; i++){
				$scope.axis[i] = [];
				for(var j = 0; j < width; j++){
					$scope.axis[i][j] = false;
				}
			}
		}

		$scope.printAxis = function(){
			console.log($scope.axis);
		}

		$scope.checkPath = function(){
			for(var i = 0; i < $scope.xAxis.length; i++){
				if(_.includes($scope.axis[i], true)){
					$scope.hasPath = true;
					break;
				}
				$scope.hasPath = false;
			}
		}

		$scope.toggleSelectAll = function(flag){
			$scope.hasPath = false;
			if(flag){
				$scope.hasPath = flag;
			}
			for(var i = 0; i < $scope.xAxis.length; i++){
				for(var j = 0; j < $scope.yAxis.length; j++){
					$scope.axis[i][j] = flag;
				}
			}
			console.log($scope.axis);
		}

		var computeRange = function(value){
			var array = [];
			for(var i = 0; i < value; i++){
				array.push(i);
			}
			return array;
		}
	}	
]);
