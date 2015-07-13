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
	.state('recipe',{
		url:'/recipe',
		templateUrl:'recipe.html'
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

app.controller('myCtrl', ['$scope', 'inventory', function ($scope, inventory) {
	inventory.getInventory().success(function(data){
		$scope.kitchen = data;
	});
	$scope.hideUpdate = true;
	$scope.updatedItem = {};

	$scope.newItem = {};

	$scope.uHide = function(id, item){
		if($scope.hideUpdate == true){
			$scope.hideUpdate = false;
			$scope.updatedItem.id = id;
			$scope.updatedItem.item = item;
		}else {
			$scope.hideUpdate = true;
			$scope.updatedItem = {};
		}
	};

	$scope.delete = function(id){
		inventory.deleteInventory(id);
	};

	$scope.update = function(id){
		inventory.updateInventory($scope.updatedItem, id);
		$scope.updatedItem = {};
	}

	$scope.create = function(){
		inventory.createInventory($scope.newItem);
		$scope.newItem = {};

	}
}])
