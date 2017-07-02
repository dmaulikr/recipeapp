
var favApp = angular.module('favRecipes', []);

favApp.controller('favRecipesCtrl', ['$scope', "$http", 'localStorageService', '$location', function($scope, $http, localStorageService, $location) {

	$scope.favourites = localStorageService.loadAllFavourites();
	console.log($scope.favourites);

	$scope.deleteFav = function(id) {
		if (confirm("Remove from favourites?")) {
			localStorageService.deleteFavourite(id);
			location.reload();
		}
	}

	$scope.getPage = function(id){
		console.log(id);
		$location.path("/recipeView/"+id);
	};
}]);