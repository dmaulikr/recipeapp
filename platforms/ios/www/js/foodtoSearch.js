var searchModel = angular.module('searchModel', ['firebase', 'ngRoute', 'ngSanitize']);

searchModel.controller('ContentCtrl', ['getResult', '$scope', '$http', '$q', '$routeParams', '$location', 'getResult', 'searchIngredients', 'searchType', 'getRecipes', 'recipeCount', 'searchCuisine',  'getRecipe', function(getResult, $scope, $http, $q, $routeParams, $location, getResult, searchIngredients, searchType, getRecipes, recipeCount, searchCuisine, getRecipe){
$scope.ingredientList = [];
$scope.x;
$scope.foodType = ["Breakfast","Main Dish", "Side Dish", "Desserts", "Appetizers", "Salad", "Soup"];
$scope.cuisine = ["Asian", "Japanese", "American", "Italian", "English"];
$scope.selectedItem;
$scope.selectedCuisine;
var ingredientSearchList = [];

searchIngredients.list = []; 
searchType.type = null;
searchCuisine.cuisine = null;

/*$http.get("http://api.bigoven.com/recipes?api_key=dvx44z3IGLBGqvZUdmII9Z4LBTE806pm&pg=1&rpp=50").success(function(data) {
            console.log(data);
});*/
//console.log($scope.ingredientList.length);

$scope.selectItem = function(i){
	if($scope.selectedItem === i){
		$scope.selectedItem = 0;
		searchType.type = null;
	}else{
		$scope.selectedItem = i;
	};
	fetch();
};

$scope.selectCuisine = function(i){
	if($scope.selectedCuisine === i){
		 $scope.selectedCuisine = 0;
		 searchCuisine.cuisine = null;
	}else{
		$scope.selectedCuisine = i;
	};
	fetch();
};


var ingredientsInput = document.getElementById('ingredientsInput');
var addIngredient = document.getElementById('addIngredient');
inputDisabled(false);

$scope.addIngredient = function(event) {
	if($scope.ingredientsInputForm.$valid && $scope.ingredientList.length < 3 && $scope.ingredientList.indexOf($scope.ingredientsInput) === -1){
		$scope.ingredientList.push($scope.ingredientsInput);
		ingredientSearchList.push($scope.ingredientsInput.toLowerCase());
		$scope.ingredientsInput = "";
		if($scope.ingredientList.length === 3){
			inputDisabled(true);
		}
	} else {
			event.preventDefault();
	};
	fetch();
};

$scope.removeIngredient = function(ingredient) {
	index = $scope.ingredientList.indexOf(ingredient);
	$scope.ingredientList.splice(index, 1);
	ingredientSearchList.splice(index, 1);
	inputDisabled(false);
	fetch();
}

function inputDisabled(b) {
	ingredientsInput.disabled = b;
	addIngredient.disabled = b;
	if(b) {
		ingredientsInput.placeholder="Maximum of three ingredients";
	} else {
		ingredientsInput.placeholder="Ingredient";
	}
}
$scope.toResult = function(){
	$location.path("/resultList/1");

}

var fetch = function(){
		console.log(ingredientSearchList);
	recipeCount.get(ingredientSearchList, $scope.selectedItem, $scope.selectedCuisine).then(function(data){
		console.log(data);
		$scope.x = data;
	});
}

fetch();
/*getRecipe.get(45525).then(function(data){
	console.log(data);
});*/

}]);

