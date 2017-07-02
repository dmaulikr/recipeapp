var recipeApp = angular.module('recipeApp', 
    ['routeMod','readShopListMod','resListMod','shopListsMod','Recipe','searchModel', 'serviceMod', 
    'favRecipes', 'modalMod', 'loginMod', 'userControlsMod'])
 .controller('MainCtrl',['$scope', '$route', function($scope, $route) { 
        $scope.$route = $route;
        $scope.iphone = navigator.userAgent.match(/(iPhone|iPod|iPad)/);

        $scope.back = function() {
            history.back();
        };

}]).config(['connection', function(connection){
      // Så vi inte chrashar om det inte är en telefon:
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) { 

            $(document).on("online", deviceIsOnline);
            $(document).on("offline", deviceIsOffline);

            console.log("connectiontype: ", navigator.connection.type);

            if(!(navigator.connection.type === Connection.UNKNOWN &&
               navigator.connection.type === Connection.NONE)) {
                $(document).trigger("online");
            } else {
                $(document).trigger("offline");
            }
    
            function deviceIsOnline() {
                connection.online = true;
                console.log("online:", connection.online);
            }

            function deviceIsOffline() {
                connection.online = false;
                console.log("online: ", connection.online);
            }
        };

    
}]);


serviceMod.constant('connection', {'online': true});


    // För att kunna testa i både browser och device-
    // Vet ej om detta fungerar på emulator.
    // OBS! gör också så att det inte går att testa den som webapp i mobilen om nån nu tänkt göra det.

$(document).ready(function() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
         $(document).on("deviceready", onDeviceReady);
    } else {
        onDeviceReady();
    }
}); 

function onDeviceReady(){
    var el = $('#recipeApp');
    angular.bootstrap(el,['recipeApp']);
};
        
