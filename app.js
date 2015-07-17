var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/home');

	$stateProvider

	// NESTED VIEWS
	.state('home',{
		url: '/home',
		templateUrl:'home.html'
	})
	.state('menu',{
		url:'/menu',
		templateUrl:'menu.html'
	})
	.state('recipe',{
		url:'/recipe',
		templateUrl:'recipe.html'
	})
	.state('kitchen',{
		url:'/kitchen',
		templateUrl:'kitchen.html'
	})
	.state('grocery',{
		url:'/grocery',
		templateUrl:'grocery.html'
	})
})

app.service('inventory', ['$http', function ($http) {
	this.getInventory = function(){
		return $http.get('http://localhost:3000/foodItems')
	}

	this.deleteInventory = function(id){
		$http.delete('http://localhost:3000/foodItems/'+id);
	}

	this.updateInventory = function(upItem, id){
		$http.put('http://localhost:3000/foodItems/'+id, upItem);
	}

	this.createInventory = function(newItem){
		$http.post('http://localhost:3000/foodItems', newItem);
	}


}])

app.service('recipe', ['$http', function ($http) {
	this.getRecipeSearch = function(terms){
		return $http.get('recipeSearch.json', {method:'GET', url:'recipeSearch.json', params:{_app_id:"",_app_key:"",q:terms}});
		//'https://api.yummly.com/v1'
	}

	
	this.getRecipeGet = function(){
		return $http.get('recipeGet.json')
		//'https://api.yummly.com/v1'
	}

}])


app.controller('myCtrl', ['$scope', 'inventory', 'recipe', function ($scope, inventory, recipe) {
	inventory.getInventory().success(function(data){
		$scope.kitchen = data;
	});
	$scope.unitOptions = ["item(s)", "ounce(s)", "cup(s)", "TableSpoon(s)", "teaspoon(s)"];
	$scope.updatedItem = {};
	$scope.newItem = {};
	$scope.hideUpdate = true;

	$scope.newItem = {};
	$scope.getRecipeSearch = function(terms) {
		recipe.getRecipeSearch(terms).success(function(data) {
			$scope.searchResults = data.matches;
		});
	}
	$scope.getRecipeGet = recipe.getRecipeGet;

	
	//creating-adding, updating, and deleting items in the Inventory (kitchen list)
	$scope.create = function(){
		$scope.newItem.baseQuanity = $scope.getBaseQuantity($scope.newItem);
		inventory.createInventory($scope.newItem);
		$scope.newItem = {};
	};

	$scope.update = function(id){
		$scope.updatedItem.baseQuanity = $scope.getBaseQuantity($scope.updatedItem);
		inventory.updateInventory($scope.updatedItem, id);
		$scope.updatedItem = {};
		$scope.hideUpdate = true;
	};

	$scope.delete = function(id){
		inventory.deleteInventory(id);
	};

	$scope.uHide = function(item){
		if($scope.hideUpdate == true){
			$scope.hideUpdate = false;
			$scope.updatedItem = item;
		}else if($scope.hideUpdate == false && $scope.updatedItem != item){
			$scope.updatedItem = item;
		}else {
			$scope.hideUpdate = true;
			$scope.updatedItem = {};
		}
	};

	$scope.getBaseQuantity = function(item){
		switch(item.quanityType){
			case "ounce(s)":
				return item.quanityNum;
				break;
			case "pound(s)":
				return (item.quanityNum * 16);
				break;
			case "cup(s)":
				return (item.quanityNum * 8);
				break;
			case "TableSpoon(s)":
				return (item.quanityNum * .5 );
				break;
			case "teaspoon(s)":
				return (item.quanityNum * .5 /3 );
			default:
				return "item";
		}
	};

}])
