
var loginMod = angular.module('loginMod', []);


loginMod.controller('LoginController', ['$scope', 'parseUserService', '$location',
 function($scope, parseUserService, $location){
 	var parse = parseUserService;

 	$scope.loading = false;


	$scope.login = function() {
		if ($scope.loginForm.$valid) {
		$scope.loadText = "Logging in..."
		flipLoading();
		
			parse.loginUser($scope.emailInput, $scope.passwordInput).then(
				function(user) {
					// Check för testning via browser.
					if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
						window.plugins.toast.showShortCenter('Logged in as user ' + user.getUsername());
					}
					history.back();
				},

				function(error){
					if(error.code === 101) {
						alert("Wrong username or password");
					} else {
						alert("Error: " + error.code + " " + error.message);

					}
				}).finally(flipLoading);
		} else {
			alert("Please fill in all the fields");
		};
	};

	var flipLoading = function() {
		$scope.loading = !$scope.loading;
	};

	$scope.signup = function() {
		if ($scope.loginForm.$valid) {
		flipLoading();
		$scope.loadText = "Signing up..."
			parse.signUpUser($scope.emailInput, $scope.passwordInput).then(
				function(user) {
					// Kan tas bort när vi sätter till device
					if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
						window.plugins.toast.showShortCenter('Signed up as user ' + user.getUsername());
					}
					history.back();
				},
				function(error){
					// handle errors
					alert("Error: " + error.code + " " + error.message);
				}).finally(flipLoading);
		} else {
			alert("Please fill in all the fields");
		};
	};

}]);

