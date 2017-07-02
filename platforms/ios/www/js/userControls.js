var userControlsMod = angular.module('userControlsMod', []);


userControlsMod.controller('UserControlsController', ['$scope', '$routeParams', 'parseUserService', '$location',
 function($scope, $routeParams, parseUserService, $location){ 

 	$scope.parse = parseUserService;
 	$scope.currentUser = false;

	var user = $scope.parse.auth();
	if (user) {
		$scope.currentUser = user;
	};

 	$scope.logout = function() {
		$scope.parse.logOut();
		$scope.currentUser = false;
		$scope.userActions();
	};

	$scope.userActions = function() {
		$scope.showUserActions = !$scope.showUserActions;
	};

 }]);