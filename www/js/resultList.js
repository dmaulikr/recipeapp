var resListMod = angular.module('resListMod', ['firebase', 'ngRoute', 'ngSanitize']);
	resListMod.controller('ResultListCtrl', ['$scope', '$http', '$location', '$routeParams', 'localStorageService', 'getResult', 'getRecipes', 'recipeCount', 'searchIngredients', 'searchType', 'searchCuisine', function($scope, $http, $location, $routeParams, localStorageService, getResult, getRecipes, recipeCount, searchIngredients, searchType, searchCuisine) {
		$scope.recipes = [];
		$scope.currentPageNr = $routeParams.nr;
		$scope.nrOfPages = 0;
		$scope.foodType = ["Breakfast", "Main Dish", "Side Dish", "Desserts", "Appetizers", "Salad", "Soup"];
		$scope.cuisine = ["Asian", "Japanese", "American", "Italian", "English"];
		$scope.selectedItem;
		$scope.selectedCuisine;
		
		var apiKey = 'dvx44z3IGLBGqvZUdmII9Z4LBTE806pm';
		var nrOfRecipes = 0;
		var recipesPerPage = 25;
		var firstMenuDown = true;
		loadData($scope.currentPageNr);


		//setInterval(function(){ $scope.selectCuisine("American"); }, 15000); 
		
		// Getter of the API's data to show images and names of recipes
		function loadData(currentNr) {
			//url = "http://api.bigoven.com/recipes"+"?api_key="+apiKey+"&pg="+nr+"&rpp="+recipesPerPage+"&title_kw=chocolate"+"&include_primarycat=dessert";
			getRecipes.get(currentNr, recipesPerPage).then(function(data) {
				console.log(data);
				$scope.recipes = data;
				recipeCount.get().then(function(data) {
					nrOfRecipes = data;
					$scope.nrOfPages = Math.ceil(nrOfRecipes/recipesPerPage);
				});
			});
		};	

		// Returns a list of links with a range that doesn't go below or above the highest and lowest number of pages based on what the current page is
		$scope.pages = function() {
			var sizeOfPages = 5;
			var tempList = [];
			var first;

			if($scope.currentPageNr > 2) {
				first = $scope.currentPageNr-2;	
			}else {
				first = 1;
			}
			
			if($scope.nrOfPages < 5) {
				sizeOfPages = $scope.nrOfPages;
			}

			if(first > $scope.nrOfPages-sizeOfPages) {
				first = $scope.nrOfPages-sizeOfPages+1;
			}

			for (var i = first; i < first+sizeOfPages; i++) {
				tempList.push(i);
			};
			return tempList;
		};

		// Sets the current page-number of the list to the one received from the argument
		$scope.setPage = function(pageNr) {
			$scope.currentPageNr = pageNr;
		};	

		$scope.goTo = function(id){
			console.log(id);
			$location.path("/recipeView/"+id);
		};
		
		// Sets the current page to the previous one
		$scope.previous = function() {
			if($scope.currentPageNr > 1) {
				$scope.currentPageNr--;
				scroll(0, 0);	
			}
		};

		// Disables the previous-function if the current page is the first one
		$scope.prevDisabled = function(nr) {
			return nr === 1 ? "disabled" : "";
		};

		// Sets the current page to the next one
		$scope.next = function() {
			if($scope.currentPageNr < $scope.nrOfPages) {
				$scope.currentPageNr++;
				scroll(0, 0);
			}
		};

		// Disables the next-function if the current page is the last one
		$scope.nextDisabled = function(nr) {
			return nr === $scope.nrOfPages ? "disabled" : "";
		};

		$scope.setStar5 = function(starNr) {
			var nr = Math.ceil(starNr);

			if(nr === 5) {
				return {
					backgroundImage:'url(img/yellowstar.png)'
				};
			}else {
				return {
					backgroundImage:'url(img/star.png)'
				};
			}
		};

		$scope.setStar4 = function(starNr) {
			var nr = Math.ceil(starNr);

			if(nr >= 4) {
				return {
					backgroundImage:'url(img/yellowstar.png)'
				};
			}else {
				return {
					backgroundImage:'url(img/star.png)'
				};
			}
		};

		$scope.setStar3 = function(starNr) {
			var nr = Math.ceil(starNr);

			if(nr >= 3) {
				return {
					backgroundImage:'url(img/yellowstar.png)'
				};
			}else {
				return {
					backgroundImage:'url(img/star.png)'
				};
			}
		};

		$scope.setStar2 = function(starNr) {
			var nr = Math.ceil(starNr);

			if(nr >= 2) {
				return {
					backgroundImage:'url(img/yellowstar.png)'
				};
			}else {
				return {
					backgroundImage:'url(img/star.png)'
				};
			}
		};

		$scope.setStar1 = function(starNr) {
			var nr = Math.ceil(starNr);

			if(nr >= 1) {
				return {
					backgroundImage:'url(img/yellowstar.png)'
				};
			}else {
				return {
					backgroundImage:'url(img/star.png)'
				};
			}
		};

		$scope.filterArrow = function() {
			if($scope.arrowButton) {
				$scope.menuUp();	
			}else {
				$scope.menuDown();
			}
			$scope.arrowButton = !$scope.arrowButton;
			$scope.filterCheck = !$scope.filterCheck;
		};

		$scope.selectItem = function(i){
			if($scope.selectedItem === i){
				$scope.selectedItem = null;
				searchType.type = null;
			}else{
				$scope.selectedItem = i;
				searchType.type = i;
			};
			counter();
			loadData($scope.currentPageNr);
		};

		$scope.selectCuisine = function(i){
			if($scope.selectedCuisine === i){
		 		$scope.selectedCuisine = null;
		 		searchCuisine.cuisine = null;
			}else{
				$scope.selectedCuisine = i;
				searchCuisine.cuisine = i;
			};
			counter();
			loadData($scope.currentPageNr);
		};

		var counter = function(){
			recipeCount.get().then(function(data){
				$scope.counter = data;
			});
		};

		$scope.menuUp = function(){
			$scope.currentPageNr = 1;
			scroll(0, 0);
		};
		
		$scope.menuDown = function(){
			if(firstMenuDown) {
				$scope.selectCuisine(searchCuisine.cuisine);
				$scope.selectItem(searchType.type);
				firstMenuDown = false;
			}
		};

		/*$scope.swipe = function(event) {
		    console.log($event);
		};*/

	}]);		
		

