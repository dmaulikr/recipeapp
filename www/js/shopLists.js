var shopListsMod = angular.module('shopListsMod', []);
	
	shopListsMod.controller('shopListsCtrl',['$scope', '$routeParams','$location', 'localStorageService', 'parseUserService', 
			function($scope, $routeParams, $location, localStorageService, parseUserService){

		$scope.parse = parseUserService;
		$scope.listItems = localStorageService.loadShopListItems();
		$scope.showInput = false;
		$scope.syncing = false;
		$scope.addShopList = function(event){
			
			if ($scope.listForm.$valid) {
			
				localStorageService.saveShopListItems($scope.textInput, []);
				
				$scope.textInput="";
				$scope.changeInput();
			}
			else{
				event.preventDefault();
				if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
					window.plugins.toast.showShortCenter('Fyll i namn', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
				}
				
			}
			return false;
		};
		$scope.changeInput = function(){
			$scope.showInput = !$scope.showInput;
		};
		
		$scope.goToShopList = function(title){

			$location.path('/readShopList/'+title);
			

		};
		$scope.delShopList = function(key){
			function remove (key) {
				delete $scope.listItems[key];
				localStorageService.deleteShopListItems(key);
			} 
			if(localStorageService.loadShopListItems(key).length !=0){
				if (confirm("Contains ingredients \n Remove anyway?")){
					remove(key);
				}
			} else {
				remove(key);
			}
			
		};
		$scope.gogo = function(){
			$location.path('/recipeView');
		};
		$scope.getFromCloud = function() {
			if(confirm("This will overwrite all locally saved lists with data from the cloud.\nContinue?")) {
				$scope.syncing = true;
				$scope.parse.getParseListsAll().then(
					function(results) {
						// HANDLE DATA - uppdatera alla listor eller bara titlarna?
						
						angular.forEach(results, function(object, i) {
							localStorageService.saveShopListItems(object.attributes.title, object.attributes.items);
						});
					},
					function(error){
						// HANDLE

					}).finally(function() {$scope.syncing = false;});
			};
		};
		$scope.saveToCloud = function() {
			if(confirm("This will overwrite all cloud lists with locally saved lists.\nContinue?")) {
				$scope.syncing = true;
				$scope.parse.saveParseListsAll($scope.listItems).then().finally(function() {$scope.syncing = false;});
			};
		};
	}])
	.directive('inputFocus', function($timeout) {
    return function(scope, element, attrs) {
       scope.$watch('showInput', 
         function (newValue) { 
            $timeout(function() {
                newValue && element[0].focus();
            }, 0, false);
         });
      };    
	});
	


