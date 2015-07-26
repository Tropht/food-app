var app = angular.module('app', ['ui.router','ui.rCalendar']);

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

/*app.service('inventory', ['$http', function ($http) {
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


}])*/

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
		inventory.createInventory($scope.newItem);
		$scope.newItem = {};
	};

	$scope.update = function(id){
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


}])

angular.module('app').controller('myCtrl', ['$scope', function ($scope) {
	//Variables
	var selectDay = document.getElementsByClassName("monthview-selected");
	var selectMonthAndYear = document.getElementsByClassName("calendar-header");
	var month;
	var year;

	//Checking For Year and Month
	$scope.checkMonthAndYear = function(){
		month = selectMonthAndYear[0].innerText.split(" ");
		year = month[1];
		//Assign Value to Month
		switch	(month[0].toLowerCase()){
    	case "january":
 		   	month = 0;
 		   	break;
 		case "february":
 		   	month = 1;
 		   	break;
 		case "march":
 		   	month = 2;
 		   	break;
 		case "april":
 		   	month = 3;
 		   	break;
 		case "may":
 		   	month = 4;
 		   	break;
 		case "june":
 		   	month = 5;
 		   	break;
 		case "july":
 		   	month = 6;
 		   	break;
 		case "august":
 		   	month = 7;
 		   	break;
 		case "september":
 		   	month = 8;
 		   	break;
 		case "october":
 		   	month = 9;
 		   	break;
 		case "november":
 		   	month = 10;
 		   	break;
 		case "december":
 		   	month = 11;
 		   	break;
    	}
	}

	//Loading Functions
    $scope.loadEvents = function () {
        $scope.eventSource = createEvents();
    };

    function createEvents() {
    	events = [];
        return events;
    };
    //Breakfast Lunch and Dinner Functions
    $scope.breakfast = function(){
    	if(document.getElementById("foodItems").value == 0){
    		alert("There's nothing selected!")
    	}
    	else{
	    	var day = selectDay[0].innerText;
	    	$scope.loadEvents();
	    	$scope.checkMonthAndYear();
	    	events.push({
	    		title: 'Breakfast - ' + document.getElementById("foodItems").value,
	           	startTime: new Date(year, month, day, 7, 0),
	           	endTime: new Date(year, month, day, 8, 0),
	           	allDay: false
	    	});
	    	document.getElementById("foodItems").value = "";
    	}
    };

    $scope.lunch = function(){
    	if(document.getElementById("foodItems").value == 0){
    		alert("There's nothing selected!")
    	}
    	else{
	    	var day = selectDay[0].innerText;
	    	$scope.loadEvents();
	    	$scope.checkMonthAndYear();
	    	events.push({
	    		title: 'Lunch - ' + document.getElementById("foodItems").value,
	           	startTime: new Date(year, month, day, 12, 0),
	           	endTime: new Date(year, month, day, 13, 0),
	           	allDay: false
	    	});
	    	document.getElementById("foodItems").value = "";
	    }
    };

    $scope.dinner = function(){
    	if(document.getElementById("foodItems").value == 0){
    		alert("There's nothing selected!")
    	}
    	else{
	    	var day = selectDay[0].innerText;
	    	$scope.loadEvents();
	    	$scope.checkMonthAndYear();
	    	events.push({
	    		title: 'Dinner - ' + document.getElementById("foodItems").value,
	           	startTime: new Date(year, month, day, 18, 0),
	           	endTime: new Date(year, month, day, 19, 0),
	           	allDay: false
	    	});
	    	document.getElementById("foodItems").value = "";
	    }
    };
}]);

//jQuery
$(document).ready(function(){

	$('.footerNav').click(function(){
		$('.footerNav').removeClass('active');
		$(this).addClass('active');
	});
});
