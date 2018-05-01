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
				
				$rootScope.activity = {
					label 		: "",
					template 	: "",
					lot_id		: $routeParams.lotid
				};
				$rootScope.template = {
					grid 	: 	[[]],
					path 	: 	[]
				}

				$scope.option = 'create'
				$rootScope.towns = res.data;
				for(var i = 0; i < $rootScope.towns.length; i++){
					$rootScope.template.grid[i] = [];
					for(var j = 0; j < $rootScope.towns.width; j++){
						$rootScope.template.grid[i][j] = false;
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
			$scope.toggleSelectAll(false);
			$rootScope.activity.label = "";
			if($rootScope.activity.type != 'plow'){
				var type = "";
				if($rootScope.activity.type == 'seed'){
					type = 'plow';
				} else {
					type = 'seed';
				}

				$rootScope.templateList = []
				$http({
					method	: 'GET', 
					url		: '/getTemplateActivity/' + $routeParams.lotid + '/' + type
				}).then(function(res){
					console.log(res);
					$rootScope.templateList = res.data;
					console.log($rootScope.templateList);
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
					url		: '/getTemplateActivity/' + $routeParams.lotid + '/' + $rootScope.activity.type
				}).then(function(res){
					console.log(res);
					$scope.activityList = res.data
				}, function(error){
					console.log(error);
				});
			}
			$scope.option = flag;
		}

		$scope.setTemplate = function(activity, isChosen){
			// console.log(activity);
			if(!activity){
				return;
			}
			if(isChosen){
				$rootScope.activity.id = activity.id;
				$rootScope.activity.label = activity.label
			}
			
			$rootScope.activity.template = activity.template_id;
			$rootScope.template.path = activity.path;
			$rootScope.template.grid = activity.grid;
			
			$scope.startPoint = activity.path[0];
		}

		// $scope.setPreviousActivity = function(activity){
		// 	if(!activity){
		// 		return;
		// 	}
		// 	console.log(activity);
			
		// 	$rootScope.activity.template = activity.template_id;
		// 	$rootScope.template.path = activity.path;
		// 	$rootScope.template.grid = activity.grid;
			
		// 	$scope.startPoint = activity.path[0];
		// 	// console.log($rootScope.template.grid);
		// }

		$scope.toggleSelectAll = function(flag){
			$scope.hasPath = flag;
			$rootScope.template.path = [];
			for(var i = 0; i < $rootScope.towns.length.length; i++){
				if(i%2 == 0){
					for(var j = 0; j < $rootScope.towns.width.length; j++){
						$rootScope.template.grid[i][j] = flag;
						pathFunction(i, j);
					}
				} else {
					for(var j = $rootScope.towns.width.length - 1; j > -1; j--){
						$rootScope.template.grid[i][j] = flag;
						pathFunction(i, j);
					}
				}
			}
		}

		$scope.checkFunction = function(x, y){
			pathFunction(x, y);
		}

		var pathFunction = function(x, y){
			if($rootScope.template.grid[x][y]){
				$rootScope.template.path = createPath($rootScope.template.path, x, y);
				if($rootScope.template.path.length > 1){
					var direction = getDirection($rootScope.template.path[$rootScope.template.path.length - 2], $rootScope.template.path[$rootScope.template.path.length - 1]);
					if(!direction){
						$scope.hasInvalid = $rootScope.template.path[$rootScope.template.path.length - 1];
						$scope.message = "Invalid path!";
					}
				}
			} else { 
				$rootScope.template.path = removePath($rootScope.template.path, x, y);
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
				$rootScope.template.grid[item.x][item.y] = false;
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
			var data = $scope.lot;
			console.log(data);
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

		$add.validateTemplate = function($ctrl){
			$http({
				method	: 'POST', 
				url		: '/getTemplates',
				data 	: {
					activity 	: $rootScope.activity,
					template 	: $rootScope.template 
				}
			}).then(function(res){
				console.log(res.data);
				if(res.data.length == 0){
					$ctrl.open('addActivityModal', false);
				} else {
					console.log("Template already exists as: " + res.data[0].label);
				}
				$ctrl.ok();
			}, function(error){
				console.log(error);
			});
		}

		$add.checkActivityLabel = function(label, type){
			if(!label){
				var randomString = Math.random().toString(36).substring(7);
				$rootScope.activity.label = type + "_" + randomString;
			}
		}

		$add.submitActivity = function($ctrl){
			// console.log($rootScope.activity);
			// console.log($rootScope.template);
			// $rootScope.activity.date = new Date();
			$http({
				method	: 'POST', 
				url		: '/addTemplate',
				data 	: {
					activity 	: $rootScope.activity,
					template 	: $rootScope.template 
				}
			}).then(function(res){
				$ctrl.ok();
				$window.localStorage.setItem('activity', JSON.stringify($add.activity));
        		$window.location.href = "#!/automated/autoPilot";
			}, function(error){
				console.log(error);
			});
		}

		$add.useActivity = function($ctrl){
			console.log($rootScope.activity);
			$ctrl.ok();
			$window.localStorage.setItem('activity', JSON.stringify($rootScope.activity));
			$window.localStorage.setItem('template', JSON.stringify($rootScope.template));
    		$window.location.href = "#!/automated/autoPilot";
		}
		
		$scope.validateForm = function(){
			console.log("Validating...");
			if($scope.lot){
				// console.log($scope.lot);
				if($scope.lot.name && $scope.lot.province && $scope.lot.length1 && $scope.lot.width){
					return true;
				} else {
					return false;
				}
				// if(!isNaN(parseInt($scope.lot.length1)) || !isNaN(parseInt($scope.lot.width))){
				// 	return true;
				// }
			}
		}

	}
]);

autoModule.controller("autoPilotCtrl", ["$rootScope", "$scope", "$window", "$location", "$http",
	function($rootScope, $scope, $window, $location, $http){
		
		console.log("Here in autoPilotCtrl");

		

		if($window.localStorage.getItem('activity') == null || $window.localStorage.getItem('template') == null){
			$window.location.href = "#!/automated/";
			return;
		}

		if(!$rootScope.activity || !$rootScope.template){
			$rootScope.activity = JSON.parse($window.localStorage.getItem('activity'));
			$rootScope.template = JSON.parse($window.localStorage.getItem('template'));
		}

		var socket = io('http://' + $rootScope.hostAddress + ':3000');
		$scope.sample = function(){
			var data = $scope.activity;
			data.path = $rootScope.template.path;
			data.grid = $rootScope.template.grid;
			socket.emit('generate-dummy-data', data);
		}

		socket.on('plow-finished', function(data){
			console.log(data.message);
			console.log(data.coordinates);
		})


	}
]);

