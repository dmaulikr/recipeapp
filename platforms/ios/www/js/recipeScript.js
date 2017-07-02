
var recipeApp = angular.module('Recipe', []);

recipeApp.controller('RecipeCtrl', ['$scope','$routeParams', "$http", 'localStorageService','checkedBoxes', '$sce', 'getRecipe', function($scope, $routeParams, $http, localStorageService, checkedBoxes, $sce, getRecipe) {

	var recipeId = Number($routeParams.recipeId);
	
	console.log(recipeId);
	/*var apiKey = 'dvxY2E2ald7pAb0Mc8O7786EB7kg9I1H';
	var url = "http://api.bigoven.com/recipe/"+recipeId+"?api_key="+apiKey;*/

	getRecipe.get(recipeId).then(function(recipe) {
		var data = recipe;
		console.log(data);
		console.log(window.localStorage["favourites"]);

		$scope.name = data.Title;
		var tempInstruction = data.Instructions.replace(/\r?\n/g, '<br>');

		if (tempInstruction.search("http://") != -1) {
			console.log("URL found in Instructions");
			var urlIndex = tempInstruction.indexOf("http://");
			tempInstruction = convertToURL(urlIndex, tempInstruction);
		}
		//tempInstruction.replace(/<br>/g, '\n');
		$scope.instructions = $sce.trustAsHtml(tempInstruction);
		$scope.ingredientList = data.Ingredients;
		console.log($scope.ingredientList);
		var imageUrl = data.ImageURL;
		$scope.image = imageUrl.replace('/upload/', '/upload/t_recipe-640/');
	});

			if (window.localStorage.getItem("favourites") === null) {
			localStorageService.initializeStorage();
		}
	for (var i = 0; i < localStorageService.loadAllFavourites().length; i++) {
		if (recipeId === localStorageService.loadFavourite(i).id) {
			document.getElementById("favButton").style.color = "red";
			break;
		}
	}

	/*$http.get(url).success(function(data) {

	});*/

	$scope.checkAll = function() {
		console.log("Checking all boxes...");
		var checkBoxes = document.getElementsByName("check");

		for (var i = 0; i < checkBoxes.length; i++) {
			if(!$scope.ingredientList[i].IsHeading) {
				checkBoxes[i].checked = true;
			}
		}
	};

	$scope.uncheckAll = function() {
		console.log("Unchecking all boxes...");
		var checkBoxes = document.getElementsByName("check");

		for (var i = 0; i < checkBoxes.length; i++) {
			checkBoxes[i].checked = false;
		}
	};
	$scope.validateBoxes = function() {

		var checkBoxes = document.getElementsByName("check");
		for (var i = 0; i < checkBoxes.length; i++) {
			if(checkBoxes[i].checked && $scope.ingredientList[i].IsHeading === false) {
				console.log("success");
				var item = ($scope.ingredientList[i].MetricDisplayQuantity+" "+$scope.ingredientList[i].MetricUnit+" "+$scope.ingredientList[i].Name);
				checkedBoxes.push({'item': item, 'checked': false});
			}
		}
	};

	$scope.favourite = function() {
		
		if (window.localStorage.getItem("favourites") === null) {
			localStorageService.initializeStorage();
		}

		var favorites = localStorageService.loadAllFavourites();
		console.log("List: "+favorites+" - Current id: "+recipeId);

		if (checkForDuplicates(favorites, recipeId) === true) {
			if(confirm("Add to favourites?")) { 
				localStorageService.saveToFavourites(recipeId, $scope.name);
				document.getElementById("favButton").style.color = "red";
			}
		} else {
			if (confirm("Remove from favourites?")) {
				localStorageService.deleteFavourite(recipeId);
				document.getElementById("favButton").style.color = "white";
			}
		}
	};

	var checkForDuplicates = function(data, recipeId) {
		if (!data) {
			console.log("Storage is empty");
			return true;
		} else {
			for (var i = 0; i < data.length; i++) {
				console.log(i + " - " + data);
				if (data[i].id === recipeId) {
					return false;
				}
			}
			return true;
		}
	};

	var convertToURL = function(firstPos, text) {

		var lastPos;
		var temp = text;
		var url;

		for (var i = firstPos; i < temp.length; i++) {

			if (temp.charAt(i) == " ") {
				console.log("Found space");
				lastPos = i;

				temp = temp.substring(firstPos, lastPos);
				url = "<a href='"+temp+"''></a>";
				console.log(url);
				break;
			} else if (i+1 === temp.length) {
				console.log("Reached end");
				lastPos = temp.length;

				temp = temp.substring(firstPos, lastPos);
				url = "<a href='"+temp+"' onclick='window.open('"+temp+"', '_system); return false;''>"+temp+"</a>";
				//url = "<a href='"+temp+"'>"+temp+"</a>";
				console.log(url);
				break;
			}
			
		}
		var newText = text.substr(0, firstPos) + " " + url + text.substr(lastPos, text.length);
		return newText;
	}
}]);





