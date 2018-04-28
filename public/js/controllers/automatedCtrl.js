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
					grid 		: [[]],
					path 		: [],
					lot_id		: $routeParams.lotid
				};

				$scope.option = 'create'
				$rootScope.towns = res.data;
				for(var i = 0; i < $rootScope.towns.length; i++){
					$scope.activity.grid[i] = [];
					for(var j = 0; j < $rootScope.towns.width; j++){
						$scope.activity.grid[i][j] = false;
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
			$scope.toggleSelectAll(false);
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
			$scope.activity.label = $scope.activity.type + $scope.activity.label
		}

		// $scope.selectedActivity = false;
		$scope.toggleActivity = function(activity){
			console.log(activity);
			$scope.activity.grid = activity.grid;
			$scope.startPoint = activity.path[0]
		}

		$scope.toggleSelectAll = function(flag){
			$scope.hasPath = flag;
			$scope.activity.path = [];
			for(var i = 0; i < $rootScope.towns.length.length; i++){
				if(!(i%2)){
					for(var j = 0; j < $rootScope.towns.width.length; j++){
						$scope.activity.grid[i][j] = flag;
						pathFunction(i, j);
					}
				} else {
					for(var j = $rootScope.towns.width.length - 1; j > -1; j--){
						$scope.activity.grid[i][j] = flag;
						pathFunction(i, j);
					}
				}
			}
		}

		$scope.checkFunction = function(x, y){
			pathFunction(x, y);
		}

		var pathFunction = function(x, y){
			console.log($scope.activity.grid[x][y]);
			if($scope.activity.grid[x][y]){
				$scope.activity.path = createPath($scope.activity.path, x, y);
				if($scope.activity.path.length > 1){
					var direction = getDirection($scope.activity.path[$scope.activity.path.length - 2], $scope.activity.path[$scope.activity.path.length - 1]);
					if(!direction){
						$scope.hasInvalid = $scope.activity.path[$scope.activity.path.length - 1];
						$scope.message = "Invalid path!";
					}
				}
			} else { 
				$scope.activity.path = removePath($scope.activity.path, x, y);
				if($scope.hasInvalid){
					$scope.hasInvalid = false;
					$scope.message = "";
				}
			}
		}

		var createPath = function(path, x, y){
			path.push({x: x, y: y});
			if(path.length == 1){
				$scope.startPoint = path[0];
			}
			return path;
		}

		var removePath = function(path, x, y){
			var index = _.findIndex(path, function(item){
				return item.x == x && item.y == y;
			});
			var removedPoints = _.slice(path, index, path.length)
			var dropCount =  path.length - index;
			path = _.dropRight(path, dropCount)
			removedPoints.forEach(function(item){
				$scope.activity.grid[item.x][item.y] = false;
			});
			if(!path.length){
				$scope.startPoint = false;
				return [];
			}
			return path;
		}

		var getDirection = function(from, to){
			if(from.x == (to.x) + 1 && from.y == (to.y)){
				return "South";
			} else if(from.x == (to.x) - 1 && from.y == to.y){
				return "North";
			} else if(from.x == (to.x) && from.y == (to.y) + 1){
				return "East";
			} else if(from.x == (to.x) && from.y == (to.y) - 1){
				return "West";
			}
			return false;
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
				console.log(res);
				$ctrl.ok();
			}, function(error){
				console.log(error);
			});
		}
		
		// $scope.count = 0;
		// $scope.validateLotName = function(){
		// 	$scope.count = $scope.name.length;
		// }

		$scope.validateForm = function(){
			console.log("Validating...");
			if(!$scope.name || !$scope.province || !$scope.length1 || !$scope.width){
				return true;
			}
			if(isNaN(parseInt($scope.length1)) || isNaN(parseInt($scope.width))){
				return true;
			}
		}

	}
]);

