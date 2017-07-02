var serviceMod = angular.module('serviceMod', ['ngStorage']);
	// All services in app

serviceMod.factory('localStorageService', ['$localStorage','checkedBoxes', function($localStorage,checkedBoxes){
	var loadShopListItems = function(shopListTitle) {
		// $localStorage.$reset();
		// window.localStorage.clear();	
		// ANVÄND OM DET BEHÖVER TÖMMAS
		var $storage = $localStorage.$default({
			shopLists: {},
		});

		// Om vi inte skickar med något argument - returnerar alla.
		if(!shopListTitle) {
			return $storage.shopLists;
		}

		// Returnera listan om den finns
		if ($storage.shopLists[shopListTitle]) {
			return $storage.shopLists[shopListTitle];
		} else {
			return false;
		}
	};

	var saveShopListItems = function(shopListTitle, items) {
		$localStorage.shopLists[shopListTitle] = items;
		while(checkedBoxes.length > 0) {
          checkedBoxes.pop();
        }
	};

	var deleteShopListItems = function(shopListTitle) {
		delete $localStorage.shopLists[shopListTitle];
		console.log('deleted ' + shopListTitle, 'lists: ', $localStorage.shopLists);	
	}

	var initializeStorage = function() {
		window.localStorage.setItem("favourites", "[]");
		console.log("Initialized local storage");
	}

	// Getter for the local favourites-data
	var loadAllFavourites = function() {
		var favouriteList = JSON.parse(window.localStorage.getItem("favourites"));
		return favouriteList;
	}

	var saveToFavourites = function(recipeId, title) {
		var data = loadAllFavourites();
		var newArray = { id: recipeId, foodName: title };
		data.push(newArray);
		window.localStorage["favourites"] = JSON.stringify(data);
		console.log("id "+recipeId+" saved to favourites");
	}

	var loadFavourite = function(id) {
		var favouriteList = JSON.parse(window.localStorage.getItem("favourites"));
		var getEntry = favouriteList[id];
		return getEntry;
	}

	// Deletes the received id from the local favourites-data
	var deleteFavourite = function(id) {
		//delete $localStorage.favourites[id];
		var data = loadAllFavourites();
		for (var i = 0; i < data.length; i++) {
			if (data[i].id === id) {
				data.splice(i, 1);
			}
		}
		window.localStorage["favourites"] = JSON.stringify(data);
		console.log("id "+id+" deleted from favourites");
	}

	return {
		loadShopListItems:loadShopListItems,
		saveShopListItems:saveShopListItems,
		deleteShopListItems:deleteShopListItems,
		initializeStorage:initializeStorage,
		loadAllFavourites:loadAllFavourites,
		saveToFavourites:saveToFavourites,
		loadFavourite:loadFavourite,
		deleteFavourite:deleteFavourite
	};
}]);


serviceMod.factory('getResult', ['$q', '$http', 'searchIngredients', 'searchType', function($q, $http, searchIngredients, searchType){

		return {
    		get: function(fromPage, numberOfPages, ingredients, type) {

		var apiKey = 'dvx44z3IGLBGqvZUdmII9Z4LBTE806pm';
		var url = "http://api.bigoven.com/recipes"+"?api_key="+apiKey+"&sort=rating"+"&pg="+fromPage+"&rpp="+numberOfPages;
	
		var resultData = $q.defer();

		if(ingredients && ingredients.length){
			searchIngredients.list = ingredients;
		}
		
		if(type){
			searchType.type = type;
		}
		
		if(searchIngredients.list.length){
			url = url+"&any_kw=";
		};
		for(var i in searchIngredients.list){
			console.log(searchIngredients.list[i]);
			url = url+searchIngredients.list[i];
			if(searchIngredients.list.length > 1 && i-1 !== searchIngredients.list.length){
				url = url+",";
			}
		};
		if(searchType.type){
			url = url+"&include_primarycat="+searchType.type;
		};

		console.log(url);

	
		$http.get(url).success(function(data) {
        	resultData.resolve(data);
		});
		
      			return resultData.promise;
    		}
  		};

}]);


serviceMod.factory('parseUserService', ['$q', 'connection', 'localStorageService', function($q, connection, localStorageService) {


	var PARSE_APP = "jGZri2yuHYfMfZ7VGx8zUujr3EpK7GbfK8hUG5Xp";
	var PARSE_JS = "KFijtSMNg9fzh3YoIejNEQLYxtlKtl2j218aXv2E";
	initParse();


	function initParse() {
		Parse.initialize(PARSE_APP, PARSE_JS);
		console.log('parse init run');
	};

	
	return {

		auth: function() {
			if(connection.online) {
				var user = Parse.User.current();
				if(user) {
					console.log(user);
					return user;	
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		destroyAllParseListsExcept: function(shopListsToKeep) {
			console.log(shopListsToKeep);
			// var user = Parse.User.current();
			// var ShopListObject = Parse.Object.extend("ShopListObject");
			// var query = new Parse.Query(ShopListObject);
			var promises = [];
			var service = this;

			return $q(function(resolve, reject) {
				service.getParseListsAllExcept(shopListsToKeep).then(					
					function(results) {
						angular.forEach(results, function(object, i) {

							promises.push(object.destroy(
								{
									success: function() {
										console.log("destroyed!");
									},
									error: function() {
										console.log("error destroying!");
									}
								}));
						});
					},
					function(error) {
						reject();
					});

				$q.all(promises).then(
					function() {
						resolve();
					},
					function() {
						reject();
					});

			});
		}, 

		saveParseListsAll: function(shopLists) {
			var promises = [];
			var service = this;

			var listsToKeep = [];

			return $q(function(resolve, reject) {


				// skapar en lista av promises som returneras av saveParseList
				angular.forEach(shopLists, function(items, title) {
					this.push(service.saveParseList(title, items));	
					listsToKeep.push(title);
				}, promises);

				// resolvar om alla listans promises resolvar, annars reject.
				$q.all(promises).then(
					function() {
						service.destroyAllParseListsExcept(listsToKeep).then(
							function() {
								resolve();
							},
							function() {
								reject();
							});
					},
					function() {
						reject();
					});
			});
		},

		saveParseList: function(shopListTitle, items) {
			var user = Parse.User.current();
			var service = this;
			return $q(function(resolve, reject) {
				service.getParseList(shopListTitle).then(
					function(fetchedLists) {
						if (fetchedLists.length === 0) {
							
							var ShopListObject = Parse.Object.extend("ShopListObject");
							var shopListObject = new ShopListObject();

							shopListObject.set("user", user);
							shopListObject.set("title", shopListTitle);
							shopListObject.set("items", items);
							shopListObject.setACL(new Parse.ACL(user));

							shopListObject.save(null, {
								success:function(object) {
									console.log("Saved the object!");
									resolve();
								}, 
								error:function(object,error) {
									alert("Sorry, I couldn't save it.");
									reject();
								}
							});
						} else {
							var fetchedList = fetchedLists[0]; // bara ett resultat här eftersom iv har unika titlar.
							fetchedList.set("items", items); // Uppdaterar hela listan. 
							fetchedList.save(null, {
								success:function(object) {
									console.log("Saved the object!");
									resolve();
								}, 
								error:function(object,error) {
									alert("Sorry, I couldn't save it. "+ error);
									console.log(error);
									reject();
								}
							});
						}

				}, 
					function(error) {
						// handle error
				});
			});
		},

		getParseList: function(shopListTitle) {

			var user = Parse.User.current();
			var ShopListObject = Parse.Object.extend("ShopListObject");

			var query = new Parse.Query(ShopListObject);

			query.equalTo("user", user);
			query.equalTo("title", shopListTitle);

			return $q(function(resolve, reject) {
				query.find({
					success:function(results) {
						resolve(results);
					},
					error:function(error) {
						alert("Error when retrieving shopping list!");
						reject(error);
					}
				});	
			});
		},

		getParseListsAll: function() {

			var user = Parse.User.current();
			var ShopListObject = Parse.Object.extend("ShopListObject");

			var query = new Parse.Query(ShopListObject);

			query.equalTo("user", user);

			return $q(function(resolve, reject) {
				query.find({
					success:function(results) {
						console.log(results);
						resolve(results);
					},
					error:function(error) {
						alert("Error when retrieving shopping lists!");
						reject(error);
					}
				});	
			});

		},

		getParseListsAllExcept: function(itemsToKeep) {

			var user = Parse.User.current();
			var ShopListObject = Parse.Object.extend("ShopListObject");

			var query = new Parse.Query(ShopListObject);

			query.equalTo("user", user);
			
			query.notContainedIn("title", itemsToKeep);
			

			console.log(query);

			return $q(function(resolve, reject) {
				query.find({
					success:function(results) {
						console.log(results);
						resolve(results);
					},
					error:function(error) {
						alert("Error when retrieving shopping lists!");
						reject(error);
					}
				});	
			});

		},

		loginUser: function(username, password) {


			return $q(function(resolve, reject){
			
				Parse.User.logIn(username, password, {
					success: function(user) {
						console.log("User: ", user.getUsername(), " logged in");
						resolve(user);
					},
					error: function(user, error) {
						reject(error);
					}
				});

			});

		},
		
		signUpUser: function(username, password) {

			var user = new Parse.User();	
			user.set("username", username);
			user.set("password", password);
			return $q(function(resolve, reject) {
				user.signUp(null, {
					success: function(user) {
						console.log("user signedUp");
						resolve(user);
					},
					error: function(user, error) {
					    // Show the error message somewhere and let the user try again.
						alert("Error: " + error.code + " " + error.message);
						reject();
					}
				});
			});
		},

		logOut: function() {
			Parse.User.logOut();
			console.log('User logged out');
			return;
		}
	}

}]);

serviceMod.value('checkedBoxes', []);
serviceMod.value('searchIngredients', {'list': []});
serviceMod.value('searchType', {'type': null});
serviceMod.value('searchCuisine', {'cuisine': null});


// getRecipes is used to search through the database for recipes with matching search-results in
// whichever category that the user might have chosen (or not), and provides a recipe-list in order from highest rated to lowest

serviceMod.factory('getRecipes', ['$q', '$http', 'searchIngredients', 'searchType', 'searchCuisine', function($q, $http, searchIngredients, searchType, searchCuisine){

    return {
        get: function(fromPage, numberOfRecipes, ingredients, type, cuisine) {

        	Parse.initialize("jGZri2yuHYfMfZ7VGx8zUujr3EpK7GbfK8hUG5Xp", "KFijtSMNg9fzh3YoIejNEQLYxtlKtl2j218aXv2E");
  
		  	var resultList = [];
		    var resultData = $q.defer();
		    var Recipes = Parse.Object.extend("Recipes");
		    var query = new Parse.Query(Recipes);
		    

		    if(ingredients){
		      searchIngredients.list = ingredients;
		    };
		    if(type){
		      searchType.type = type;
		    };
		    if(cuisine){
		      searchCuisine.cuisine = cuisine;
		    };

		    if(searchIngredients.list.length){
		      query.containsAll("IngredientsSearch", searchIngredients.list);
		    };
		    
		    if(searchType.type){
		      query.equalTo("Category", searchType.type);
		    };
		    if(searchCuisine.cuisine){
		      query.equalTo("Cuisine", searchCuisine.cuisine);
		    };

		    var skip = numberOfRecipes * (fromPage - 1);
		    query.skip(skip);
		    query.limit(numberOfRecipes);
		    query.descending("StarRating");

		    query.find({
		    	success: function(result) {
		        
		        	for(var i in result){
		        		resultList.push(result[i].attributes)
		        	}

		        	resultData.resolve(resultList);
		        
		      	},
		      	error: function(error) {
		        	console.log(error);
		      	}
		    });
		    
		    return resultData.promise;     
		}
 	};

}]);

serviceMod.factory('recipeCount', ['$q', '$http', 'searchIngredients', 'searchType', 'searchCuisine', function($q, $http, searchIngredients, searchType, searchCuisine){

    return {
        get: function(ingredients, type, cuisine) {

        	Parse.initialize("jGZri2yuHYfMfZ7VGx8zUujr3EpK7GbfK8hUG5Xp", "KFijtSMNg9fzh3YoIejNEQLYxtlKtl2j218aXv2E");
  
		    var resultData = $q.defer();
		    var Recipes = Parse.Object.extend("Recipes");
		 
		    var query = new Parse.Query(Recipes);
		    var q2 = new Parse.Query(Recipes);
		   

		    if(ingredients){
		      searchIngredients.list = ingredients;
		    };
		    if(type){
		      searchType.type = type;
		    };
		    if(cuisine){
		      searchCuisine.cuisine = cuisine;
		    };

		    if(searchIngredients.list.length){
		      query.containsAll("IngredientsSearch", searchIngredients.list);
		    };
		    
		    if(searchType.type){
		      query.equalTo("Category", searchType.type);
		    };
		    if(searchCuisine.cuisine){
		      query.equalTo("Cuisine", searchCuisine.cuisine);
		    };

		    query.count({
		    	success: function(result) {
					resultData.resolve(result);
		      	},
		      	error: function(error) {
		        	console.log(error);
		      	}
		    });
		    
		    return resultData.promise;     
		}
	};

}]);

serviceMod.factory('getRecipe', ['$q', '$http', function($q, $http){

    return {
        get: function(recipeID) {

        	Parse.initialize("jGZri2yuHYfMfZ7VGx8zUujr3EpK7GbfK8hUG5Xp", "KFijtSMNg9fzh3YoIejNEQLYxtlKtl2j218aXv2E");
  
		    var resultData = $q.defer();
		    var Recipes = Parse.Object.extend("Recipes");
		 
		    var query = new Parse.Query(Recipes);
		    query.equalTo("RecipeID", recipeID); 
		    
		    query.find({
		    	success: function(result) {
		        resultData.resolve(result[0].attributes);
		      	},
		      	error: function(error) {
		        	console.log(error);
		      	}
		    });
    	
       		return resultData.promise;     
    	}
 	};

}]);
