angular.module('modalMod', ['ui.bootstrap'])
.controller('ModalCtrl', ['$scope', '$modal','localStorageService','checkedBoxes','$location', function($scope, $modal, localStorageService, checkedBoxes,$location) {

  $scope.shopLists = localStorageService.loadShopListItems();
  //open the modal with options
  $scope.open = function () {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'modal.html',
        controller: 'ModalInstanceCtrl',
        windowClass: 'modal.css',
        size: 'sm',
        resolve: {
          shopLists: function () {
            return $scope.shopLists;
          }
        }
      });
      //the result that comes back. Made it return an object for different inputs
      modalInstance.result.then(function(result) {
        var items = [];
        //fetch listitems if a list has entries
        if(!result.makeNew){
          items = localStorageService.loadShopListItems(result.input);  
        };
        //push new entries
        for (var i = 0; i<checkedBoxes.length; i++){
            items.push(checkedBoxes[i]);
        }
        //save the new list make a toast and redirect to shoplist
        localStorageService.saveShopListItems(result.input, items);
        //comment out plugin if running in web browser
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
          window.plugins.toast.showShortCenter('Listan sparad i '+result.input, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
          }
        $location.path('/readShopList/'+result.input);
      }, function () {
        
        console.log("dismissed"+ new Date());
      });
    
  };

}])

.controller('ModalInstanceCtrl',['$scope','$modalInstance','shopLists',function($scope, $modalInstance, shopLists) {

  $scope.shopLists = shopLists;
  $scope.selected = null;
  $scope.show = false;
  //handle clicks on itemrows
  $scope.select = function(key){
    $scope.selected = key;
    $scope.show = false;
    $scope.textInput="";
  };
  //new list button
  $scope.newList = function(){
    $scope.show = !$scope.show;
    $scope.selected = null;
    
    
  };
  //handle if input is from list or a new named list
  $scope.ok = function (event) {
    if(!$scope.show){
      //if inputfield not shown
      if($scope.selected){
        $modalInstance.close({input:$scope.selected});
      }
      else {
        //if no list is selected button doesn't work and makes toast
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
          window.plugins.toast.showShortCenter('Välj en lista', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        }
      }
    }
    else{
      //if button newList is pushed and a list name has been entered
      if($scope.modalForm.$valid) {
        $modalInstance.close({input:$scope.textInput, makeNew:"yes"});
        $scope.textInput="";
      }
      else{
        //if there is no text in inputField
        event.preventDefault();
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 
          window.plugins.toast.showShortCenter('Fyll i namn', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        }
      }
    }    
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
//directive to put focus on inputfield when clicking button "newList"
.directive('inputFocus', function($timeout) {
    return function(scope, element, attrs) {
       scope.$watch('show', 
         function (newValue) { 
            $timeout(function() {
                newValue && element[0].focus();
            }, 0, false);
         });
      };    
  });
