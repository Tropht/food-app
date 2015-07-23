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
	.state('searchItems',{
		url:'/searchItems',
		templateUrl:'searchItems.html'
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

app.service('dbItem', ['$http', function ($http) {
	this.getMenu = function(){
		return $http.get('http://localhost:3000/menu')
	}

	this.getKitchen = function(){
		return $http.get('http://localhost:3000/foodItems')
	}

	this.getGrocery = function(){
		return $http.get('http://localhost:3000/groceryList')
	}

	this.deletedbItem = function(list, id){
		console.log('http://localhost:3000/'+list+'/'+id);
		$http.delete('http://localhost:3000/'+list+'/'+id);
	}

	this.updatedbItem = function(list, upItem, id){
		console.log('http://localhost:3000/'+list+'/'+id);
		$http.put('http://localhost:3000/'+list+'/'+id, upItem);
	}

	this.createdbItem = function(list, newItem){
		$http.post('http://localhost:3000/'+list, newItem);
	}

	//new search items
	this.getSearchItems = function(){
		return $http.get('http://localhost:3000/foodDB')
	}

}])

	
app.controller('myCtrl', ['$scope', 'dbItem', function ($scope, dbItem) {
	dbItem.getMenu().success(function(data){
		$scope.menu = data;
	})
	dbItem.getKitchen().success(function(data){
		$scope.kitchen = data;
	});
	dbItem.getGrocery().success(function(data){
		$scope.groceries = data;
	});

	$scope.unitOptions = ["item(s)", "ounce(s)", "cup(s)", "TableSpoon(s)", "teaspoon(s)"];
	$scope.updatedItem = {};
	$scope.newItem = {};
	$scope.hideUpdate = true;


	$scope.getsearchItems = function(terms) {
		dbItem.getSearchItems().success(function(data) {
			$scope.dbSearchItems = data;
		
			$scope.searchResults = [];
			for (var i = 0; i < $scope.dbSearchItems.length; i++)
			{
				if($scope.dbSearchItems[i].item.indexOf(terms) !== -1) 
				{
					$scope.searchResults.push($scope.dbSearchItems[i]);
				}
			}
		});
	};

	
	//creating-adding, updating, and deleting items in the dbItem
	$scope.create = function(list){
		console.log("called create function for " + list);
		$scope.newItem.baseQuanity = $scope.getBaseQuantity($scope.newItem);
		dbItem.createdbItem(list, $scope.newItem);
		$scope.newItem = {};
	};

	$scope.update = function(list, id){
		console.log("called update function for " + list);
		$scope.updatedItem.baseQuanity = $scope.getBaseQuantity($scope.updatedItem);
		dbItem.updatedbItem(list, $scope.updatedItem, id);
		$scope.updatedItem = {};
		$scope.hideUpdate = true;
	};

	$scope.delete = function(list, id){
		console.log("called delete function for " + list);
		dbItem.deletedbItem(list, id);
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

	$scope.filterBy = '';

	$scope.setFilter = function(item){
		switch(item){
			case "type":
				if($scope.filterBy === "type"){
					$scope.filterBy =  "-type";
				}else if($scope.filterBy === "-type"){
					$scope.filterBy = '';
				}else{
    			$scope.filterBy = item;
    			}
    			break;
			case "item":
				if($scope.filterBy === "item"){
					$scope.filterBy =  "-item";
				}else if($scope.filterBy === "-item"){
					$scope.filterBy = '';
				}else{
    			$scope.filterBy = item;
    			}
    			break;
			case "quanity":
    			if($scope.filterBy === "quanity"){
					$scope.filterBy =  "-quanity";
				}else if($scope.filterBy === "-quanity"){
					$scope.filterBy = '';
				}else{
    			$scope.filterBy = item;
    			}
    			break;
			case "price":
    			if($scope.filterBy === "price"){
					$scope.filterBy =  "-price";
				}else if($scope.filterBy === "-price"){
					$scope.filterBy = '';
				}else{
    			$scope.filterBy = item;
    			}
    			break;
		}
	};

}])

