var routeMod = angular.module('routeMod', ['ngRoute']);
routeMod.config(['$routeProvider', function($routeProvider){
   
    $routeProvider.when('/shopLists', {
        templateUrl: "shopLists.html",
        activeTab: "shopLists"
    });
    $routeProvider.when('/readShopList', {
        templateUrl: "readShopList.html",
        activeTab: "shopLists"
    });
    $routeProvider.when('/readShopList/:title', {
        templateUrl: "readShopList.html",
        activeTab: "shopLists"
    });
    $routeProvider.when('/recipeView', {
        templateUrl: "recipeView.html"
    });
    $routeProvider.when('/recipeView/:recipeId', {
        templateUrl: "recipeView.html"
    });
    $routeProvider.when('/resultList', {
        templateUrl: "resultList.html",
        activeTab: "foodtoSearch"
    });
    $routeProvider.when('/resultList/:nr', {
        templateUrl: "resultList.html",
        activeTab: "foodtoSearch"
    });
    $routeProvider.when('/foodtoSearch', {
        templateUrl: "foodtoSearch.html",
        activeTab: "foodtoSearch"
    });
    $routeProvider.when('/favourites', {
        templateUrl: "favRecipes.html",
        activeTab: "favourites"
    });
    $routeProvider.when('/login', {
        templateUrl: "login.html"
    });

    $routeProvider.otherwise({
        redirectTo: "/foodtoSearch"
    });
}]);