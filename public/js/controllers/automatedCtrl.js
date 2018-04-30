'use strict';

var autoModule = angular.module("autoFarm.controllers.autoCtrl", ["ui.bootstrap"])
autoModule.controller("autoCtrl", ["$rootScope", "$scope", "$window", "$location", "$http", "$routeParams",
	function($rootScope, $scope, $window, $location, $http, $routeParams){
		// var socket;
		$scope.isLoading = true;
		if($location.url() == '/automated'){
			$http({
				method	: 'GET', 
				url		: '/getLots'
			}).then(function(res){
				console.log(res.data);
				$rootScope.towns = res.data;
				$scope.isLoading = false;
			}, function(error){
				console.log(error);
			});
		} else {
			$http({
				method	: 'GET', 
				url		: '/getLot/' + $routeParams.lotid
			}).then(function(res){
				
				$scope.activity = {
					label 		: "",
					grid 		: [[]],
					path 		: [],
					template 	: "",
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

		console.log("Here in autoCtrl");

		$scope.setActivity = function(){
			var d = new Date();
			var temp = '(' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ')';
			$scope.activity.label = $scope.activity.type + temp;
			$scope.toggleSelectAll(false);
			console.log($scope.activity.label);
			if($scope.activity.type != 'plow'){
				var type = "";
				if($scope.activity.type == 'seed'){
					type = 'plow';
				} else {
					type = 'seed';
				}

				$scope.templateList = []
				$http({
					method	: 'GET', 
					url		: '/getActivity/' + $routeParams.lotid + '/' + type
				}).then(function(res){
					console.log(res);
					$scope.templateList = res.data;
					console.log($scope.templateList);
				}, function(error){
					console.log(error);
				});
			}
		}

		$scope.toggleOption = function(flag){
			$scope.toggleSelectAll(false);
			if(flag == 'choose'){
				$scope.activityList = []
				$http({
					method	: 'GET', 
					url		: '/getActivity/' + $routeParams.lotid + '/' + $scope.activity.type
				}).then(function(res){
					console.log(res);
					$scope.activityList = res.data
				}, function(error){
					console.log(error);
				});
				// $http({
				// 	method	: 'GET', 
				// 	url		: '/getActivity/' + $routeParams.lotid + '/' + $scope.activity.type
				// }).then(function(res){
				// 	console.log(res);
				// 	$scope.activityList = res.data
				// }, function(error){
				// 	console.log(error);
				// });
			}
			$scope.option = flag;
		}

		$scope.setTemplate = function(activity){
			console.log(activity);
			$scope.activity.id = activity.id;
			$scope.activity.template = activity.template;
			$scope.activity.label = activity.label
			$scope.activity.path = activity.path;
			$scope.startPoint = activity.path[0];
			$scope.activity.grid = activity.grid;
		}

		$scope.setPreviousActivity = function(activity){
			if(!activity){
				return;
			}
			console.log(activity);
			$scope.activity.path = activity.path;
			$scope.activity.template = activity.id;
			$scope.activity.grid = activity.grid;
			$scope.startPoint = activity.path[0];
			// console.log($scope.activity.grid);
		}

		$scope.toggleSelectAll = function(flag){
			$scope.hasPath = flag;
			$scope.activity.path = [];
			for(var i = 0; i < $rootScope.towns.length.length; i++){
				if(i%2 == 0){
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

autoModule.controller("autoModalCtrl", ["$rootScope", "$scope", "$window", "$http",
	function($rootScope, $scope, $window, $http){
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

		$add.submitActivity = function($ctrl){
			console.log($add.activity);
			// $scope.activity.date = new Date();
			$http({
				method	: 'POST', 
				url		: '/addActivity',
				data 	: $add.activity
			}).then(function(res){
				// console.log(res);
				$ctrl.ok();
				$rootScope.pilotActivity = $add.activity;
				$window.localStorage.setItem('activity', JSON.stringify($add.activity));
        		$window.location.href = "#!/automated/autoPilot";
			}, function(error){
				console.log(error);
			});
		}

		$add.useActivity = function($ctrl){
			console.log($add.activity);
			$ctrl.ok();
			$rootScope.pilotActivity = $add.activity;
			$window.localStorage.setItem('activity', JSON.stringify($add.activity));
    		$window.location.href = "#!/automated/autoPilot";
			
		}
		
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

autoModule.controller("autoPilotCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		
		console.log("Here in autoPilotCtrl");
		var activity = "";
		if(!$rootScope.pilotActivity){
			activity = JSON.parse($window.localStorage.getItem('activity'));
			// $window.location.href = "#!/automated/";
			// return;
		} else {
			activity = $rootScope.pilotActivity;
		}
		// console.log($rootScope.pilotActivity);
		var socket = io('http://' + $rootScope.hostAddress + ':3000');

		$scope.sample = function(){
			socket.emit('generate-dummy-data', activity);
		}

		socket.on('plow-finished', function(data){
			console.log(data.message);
			console.log(data.coordinates);
		})


	}
]);

