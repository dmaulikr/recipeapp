
var readShopListMod = angular.module('readShopListMod', []);


readShopListMod.controller('ReadShopListController', ['$scope', '$routeParams', 'localStorageService', 'parseUserService', '$location',
 function($scope, $routeParams, localStorageService, parseUserService, $location){

 	var parse = parseUserService;
	$scope.shopListTitle = $routeParams.title;
	$scope.items = [];
	$scope.syncing = false;
	$scope.cartItems = [];


	var savedItems = localStorageService.loadShopListItems($scope.shopListTitle);
	if(savedItems) {
		$scope.items = savedItems;
	};

	$scope.addItem = function() {
		if ($scope.addForm.$valid) {
			$scope.items.push({'item': $scope.addItemInput, 'checked': false});
			$scope.addItemInput = "";
			var textbox = document.getElementById("addItemInputBox");
	    	textbox.focus();
	    	textbox.scrollIntoView();

	    	$scope.saveItems();
	    }
	};
	$scope.moveItem = function(index, from) {
		console.log("if from", from)
		if(from == "back"){
			var a = $scope.cartItems.splice(index,1)[0];
			console.log("ddd",a);
			$scope.items.push(a);
		} 
		else {
			var b = $scope.items.splice(index,1)[0];
			console.log("eee",b); 
			$scope.cartItems.push(b);
		}
	};
	$scope.emptyCart = function(){
		if($scope.cartItems.length != 0) {
			if (confirm("Remove Cart Items?")){
				$scope.cartItems= [];
			}
		}
	};
	$scope.removeItem = function(index) {
		$scope.items.splice(index, 1);
		$scope.saveItems();
	};

	$scope.saveItems = function(index) {
		localStorageService.saveShopListItems($scope.shopListTitle, $scope.items);
		

	};


	$scope.saveToCloud = function() {
		$scope.syncing = true;
		parse.saveParseList($scope.shopListTitle, $scope.items).then().finally(function() {
			$scope.syncing = false; 
		});	
	};

	$scope.getFromCloud = function() {
		$scope.syncing = true;
		parse.getParseList($scope.shopListTitle).then(
			function(fetchedLists) {
				if (fetchedLists.length === 0) {
					console.log("no list"); // handle
				} else {
					var fetchedList = fetchedLists[0];
					$scope.items = fetchedList.attributes.items;
					$scope.saveItems();
				};
			}, 
			function(error) {
				// handle error
			}).finally(function() {
				$scope.syncing = false;
			});
	}
}]);
/*readShopListMod.animation('.shop-animation', function() {
 	var getScope = function(e) {
   		return angular.element(e).scope();
 	};
    return {
      // shopping
      addClass: function(element,dd, done) {
      	element[0].textContent=("Shopping item");
        doneFn(element);
      },
      
      // returning
      removeClass: function(element, dd, done) {
      	
      	element.value=("returning goods");
        doneFn(element, "fin");
      },
      
    };
    function doneFn(element, type) {
    	var $scope = getScope(element);
    	console.log("typ",type);
    	if(type){
    		
    		console.log("tillbaka från shopping shopping",element);
    		setTimeout(function() {

    			$scope.items.push($scope.cartItems.splice(0,1)[0]);
    			
    			element[0].value=($scope.items[0].item);
    			$scope.$apply(); //this triggers a $digest
  			}, 1000);

    	}
    	else {
    		console.log("shopping",$scope.items);
    		setTimeout(function() {
    			console.log("ffff",getScope(element).items);
    			$scope.cartItems.push(getScope(element).items.splice(0,1)[0]);
    			console.log("gggg",getScope(element).items);
				element[0].textContent=(getScope(element).items[0].item);
    			$scope.$apply(); //this triggers a $digest
  			}, 1000);
    		
    	}
    	
    }
});

*/
