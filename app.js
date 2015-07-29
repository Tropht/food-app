var app = angular.module('app', ['ui.router', 'ui.rCalendar']);

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

//calls to db.json 
app.service('dbItem', ['$http', function ($http) {
	this.getMenu = function(id){
		return $http.get('http://localhost:3000/menu/'+id)
	}

	this.getKitchen = function(){
		return $http.get('http://localhost:3000/kitchenItems')
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

	this.getFoodItems = function(){
		return $http.get('http://localhost:3000/foodDB')
	}

}])

	
app.controller('myCtrl', ['$scope', 'dbItem', function ($scope, dbItem) {
	dbItem.getKitchen().success(function(data){
		$scope.kitchen = data;
	});
	dbItem.getGrocery().success(function(data){
		$scope.groceries = data;
	});

	$scope.unitOptions = ["item(s)", "ounce(s)", "cup(s)", "TableSpoon(s)", "teaspoon(s)"];
	$scope.newItem = {};
	$scope.newMenuItem = {};
	$scope.updatedItem = {};
	$scope.updatedMenuItem = {};
	$scope.menuSelection = "";
	$scope.hideUpdate = true;

	var today = parseInt(moment().format("YYYYMMDD"));
	//$scope.today = day.getDay();
	var numberYo = parseInt(today);
	console.log(numberYo);
	$scope.selectedDay = today;
	//get original menu
	dbItem.getMenu(today).success(function(data){
			$scope.menu = data;
		}).error(function(data){
			$scope.menu.id = today;
			$scope.menu.breakfast = [];
			$scope.menu.lunch = [];
			$scope.menu.dinner = [];
		});
	//update menu view based on selected date
	$scope.getDailyMenu = function(selectedDate){
		dbItem.getMenu(selectedDate).success(function(data){
			$scope.menu = data;
		}).error(function(data){
			$scope.menu.id = selectedDate;
			$scope.menu.breakfast = [];
			$scope.menu.lunch = [];
			$scope.menu.dinner = [];
		});
		$scope.selectedDay = selectedDate;
	};
	
	//search items
	$scope.search = function(terms) {
		dbItem.getFoodItems().success(function(data) {
			$scope.dbSearchItems = data;
		
			$scope.searchResults = [];
			if (terms === "");
			
			for (var i = 0; i < $scope.dbSearchItems.length; i++)
			{
				if($scope.dbSearchItems[i].item.toLowerCase().replace(/ /g, '').indexOf(terms.toLowerCase().replace(/ /g, '')) !== -1) 
				{
					$scope.searchResults.push($scope.dbSearchItems[i]);
				}
			}
		});
	};	

	//creating, and updating items in the Menu
	$scope.createMenu = function(menu, menuSelection){
		console.log("called createMenu function for creating new item in "+ menuSelection);
		if($scope.newItem.quanityType != "item(s)"){
			$scope.newItem.quanityNum = $scope.getBaseQuantity($scope.newItem);
			$scope.newItem.quanityType = "ounce(s)";
		}
		$scope.newMenuItem = menu;
		switch(menuSelection){
			case "breakfast":
				console.log("calling breakfast");
				$scope.newMenuItem.breakfast.push($scope.newItem);
				break;
			case "lunch":
				console.log("calling lunch");
				$scope.newMenuItem.lunch.push($scope.newItem);
				break;
			case "dinner":
				console.log("calling dinner");
				$scope.newMenuItem.dinner.push($scope.newItem);
				break;
			default:
				console.log("Error, no option selected");
		}
		console.log("ready to add new itmes to DB");
		dbItem.createdbItem("menu", $scope.newMenuItem);
		$scope.newItem = {};
		$scope.newMenuItem = {};
	};

	$scope.updateMenu = function(menu, id){
		console.log("called menu ID # " + menu.id + " update function for " + $scope.menuSelection);
		$scope.updatedMenuItem = menu;
		if($scope.updatedItem.quanityType != "item(s)"){
			$scope.updatedItem.quanityNum = $scope.getBaseQuantity($scope.updatedItem);
			$scope.newItem.quanityType = "ounce(s)";
		}
		switch($scope.menuSelection){
			case "breakfast":
				for(var i = 0; i < $scope.updatedMenuItem.breakfast.length; i++){
					if($scope.updatedMenuItem.breakfast[i].id == id){
						$scope.updatedMenuItem.breakfast[i] = $scope.updatedItem;
						break;
					}
				}
				break;
			case "lunch":
				for(var i = 0; i < $scope.updatedMenuItem.lunch.length; i++){
					if($scope.updatedMenuItem.lunch[i].id == id){
						$scope.updatedMenuItem.lunch[i] = $scope.updatedItem;
						break;
					}
				}
				break;
			case "dinner":
				for(var i = 0; i < $scope.updatedMenuItem.dinner.length; i++){
					if($scope.updatedMenuItem.dinner[i].id == id){
						$scope.updatedMenuItem.dinner[i] = $scope.updatedItem;
						break;
					}
				}
		}
		dbItem.updatedbItem("menu", $scope.updatedMenuItem, $scope.selectedDay);
		$scope.updatedItem = {};
		$scope.updatedMenuItem = {};
		$scope.hideUpdate = true;
	};
	
	//creating, updating, and deleting items in Kitchen & Grocery
	$scope.create = function(list){
		console.log("called create function for " + list);
		if($scope.newItem.quanityType != "item(s)"){
			$scope.newItem.quanityNum = $scope.getBaseQuantity($scope.newItem);
			$scope.newItem.quanityType = "ounce(s)";
		}
		dbItem.createdbItem(list, $scope.newItem);
		$scope.newItem = {};
	};

	$scope.update = function(list, id){
		console.log("called update function for " + list);
		if($scope.updatedItem.quanityType != "item(s)"){
			$scope.newItem.quanityNum = $scope.getBaseQuantity($scope.updatedItem);
			$scope.newItem.quanityType = "ounce(s)";
		}
		dbItem.updatedbItem(list, $scope.updatedItem, id);
		$scope.updatedItem = {};
		$scope.hideUpdate = true;
	};

	$scope.delete = function(list, id){
		console.log("called delete function for " + list);
		dbItem.deletedbItem(list, id);
	};

	// Hiding the update fields until selected, then hiding the add option
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
			default: //if ounce(s) or type not listed
				return item.quanityNum;
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

//Calendar Control
	//Variables
	var selectDay = document.getElementsByClassName("monthview-selected");
	var selectMonthAndYear = document.getElementsByClassName("calendar-header");
	var events = [];
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
    $scope.test = function(){
    	console.log(events);
    };

    //Grocery List
	$scope.addToGroceryList = function(){
		$scope.list.push({
			body: document.getElementById("groceryItem").value
		});
		document.getElementById("groceryItem").value = "";
	}
	$scope.list = [
		{
			body: 'Things to get...'
		}
	];

}])



//jQuery
$(document).ready(function(){

	$('.footerNav').click(function(){
		$('.footerNav').removeClass('active');
		$(this).addClass('active');
	});
});


