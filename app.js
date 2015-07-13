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
		return $http.get('http://localhost:3000/posts')
	}

	this.deleteInventory = function(id){
		$http.delete('http://localhost:3000/posts/'+id);
	}

	this.updateInventory = function(upItem, id){
		$http.put('http://localhost:3000/posts/'+id, upItem);
	}

	this.createInventory = function(newItem){
		$http.post('http://localhost:3000/posts', newItem);
	}
}])

app.controller('myCtrl', ['$scope', 'inventory', function ($scope, inventory) {
	inventory.getInventory().success(function(data){
		$scope.inventory = data;
	});

	$scope.updatedItem = {};

	$scope.newItem = {};

	$scope.delete = function(id){
		inventory.deleteInventory(id);
	};

	$scope.update = function(){
		inventory.updateInventory($scope.updatedItem, $scope.updatedItem.id);
		$scope.updatedItem = {};
	}

	$scope.create = function(){
		inventory.createInventory($scope.newItem);
		$scope.newItem = {};

	}
}])
