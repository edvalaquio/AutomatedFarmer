'use strict';

var autoModule = angular.module("autoFarm.controllers.autoCtrl", ["ui.bootstrap"])
autoModule.controller("autoCtrl", ["$rootScope", "$scope", "$window", "$location", "$http", "$routeParams", "modalService",
	function($rootScope, $scope, $window, $location, $http, $routeParams, modalService){
		// var socket;
		if($location.url() == '/automated'){
			$http({
				method	: 'GET', 
				url		: '/getLots'
			}).then(function(res){
				console.log(res.data);
				$rootScope.towns = res.data;
			}, function(error){
				console.log(error);
			});
		} else {
			$http({
				method	: 'GET', 
				url		: '/getLot/' + $routeParams.lotid
			}).then(function(res){
				var d = new Date();

				var temp = '(' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ')';

				$scope.activity = {
					label 		: temp,
					date 		: '',
					type 		: '',
					path 		: [[]],
					startPoint 	: '',
					direction	: '',
					lot_id		: $routeParams.lotid
				};

				$scope.option = 'create'
				$rootScope.towns = res.data;
				for(var i = 0; i < $rootScope.towns.length; i++){
					$scope.activity.path[i] = [];
					for(var j = 0; j < $rootScope.towns.width; j++){
						$scope.activity.path[i][j] = false;
					}
				}
				$rootScope.towns.length = computeRange($rootScope.towns.length);
				$rootScope.towns.width = computeRange($rootScope.towns.width);
			}, function(error){
				console.log(error);
			});

		}

		var socket = io('http://' + $rootScope.hostAddress + ':3000');
		console.log("Here in autoCtrl");

		$scope.toggleOption = function(flag){
			if(flag == 'choose'){
				$scope.activityList = []
				$http({
					method	: 'GET', 
					url		: '/getActivity/' + $routeParams.lotid
				}).then(function(res){
					console.log(res);
					$scope.activityList = res.data
				}, function(error){
					console.log(error);
				});
			}
			$scope.option = flag;
		}

		$scope.createLabel = function(){
			$http({
				method	: 'GET', 
				url		: '/getActivity/' + $routeParams.lotid
			}).then(function(res){
				var temp = $scope.activity.type + $scope.activity.label;
				var count = 0;
				res.data.forEach(function(item){
					if(item.label.startsWith(temp)){
						count++;
					}
				})
				$scope.activity.label = temp + "_" + count;
			}, function(error){
				console.log(error);
			});
		}

		$scope.checkPath = function(){
			for(var i = 0; i < $rootScope.towns.length.length; i++){
				if(_.includes($scope.activity.path[i], true)){
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
			for(var i = 0; i < $rootScope.towns.length.length; i++){
				for(var j = 0; j < $rootScope.towns.width.length; j++){
					$scope.activity.path[i][j] = flag;
				}
			}
			console.log($scope.activity.path);
		}

		$scope.checkStartPoints = function(path){
			console.log($scope.activity);
			console.log($scope.activityList);
			// var array = [];
			// for(var i = 0; i < path.length; i++){
			// 	for(var j = 0; j < path[i].length; j++){
			// 		if(path[i][j]){
			// 			var temp = "(" + i + "," + j + ")";
			// 			array.push(temp);
			// 		}
			// 	}
			// }
			// console.log(array);
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

autoModule.controller("autoModalCtrl", ["$scope", "$window", "$location", "$http", "modalService",
	function($scope, $window, $location, $http, modalService){
		var $add = this;
		console.log("Here in autoModalCtrl");
		if(modalService.getData('activity')){
			$add.activity = modalService.getData('activity')
		}
		$add.addLot = function($ctrl){
			var data = {
				'name' 		: $add.name + "",
				'province' 	: $add.province + "",
				'town' 		: $add.town + "",
				'brgy' 		: $add.brgy + "",
				'length' 	: $add.length,
				'width' 	: $add.width
			}
			$http({
				method	: 'POST', 
				url		: '/addLot',
				data 	: data
			}).then(function(res){
        		$window.location.href = "#!/automated/" + res.data.lotid
				console.log(res);
				$ctrl.ok();
			}, function(error){
				console.log(error);
			});
		}

		$add.submitActivityLabel = function($ctrl){
			// console.log($add.activity);
			$add.activity.date = new Date();
			$http({
				method	: 'POST', 
				url		: '/addActivity',
				data 	: $add.activity
			}).then(function(res){
        		// $window.location.href = "#!/automated/" + res.data.lotid
				console.log(res);
				$ctrl.ok();
			}, function(error){
				console.log(error);
			});
		}

	}
]);

