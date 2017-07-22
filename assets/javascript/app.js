// API key
var mapsKey = "AIzaSyCdasgXLKtxe1vhh8nU7KP3tgCYB8o2yZg";
var map, icon, fullName, loc, cseData;
var cityState = [];
//zomato
var lat,lon,entityId,entityType;
var food = [];
var foodArr = [];
//weather
var stAbbr,city;
var markers = [];
var markerArr = [];
var events = [];
var eventsArr = [];
var places = [];
var placesArr = [];
var state = 0;
var newMap = {
	center: {lat: 35.2271, lng: -80.8431},
	zoom: 8,
	scrollwheel:  false
};
$("#cityimage").attr("src", "assets/images/placeholderCity.jpg");
function windowInfoCreate(marker, location, content) {
	var info = {
		content: content,
		position: location
	};
	var infoWindow = new google.maps.InfoWindow(info);
	google.maps.event.addListener(marker, "click", function() {
		infoWindow.open(map);
	});
}
function addPlaceMarkers() {
	icon = {
	    url: "assets/images/markBear.png",
	    scaledSize: new google.maps.Size(50, 50),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25, 50)
	}
	var count = 0;
	var max = 9;
	// console.log(places);
	if(places.length < 10) {
		max = places.length - 1;
	}
	var displayPlaces = setInterval(function() {
		var location = places[count].geometry.location;
		var marker = new google.maps.Marker({
		    position: location,
		    map: map,
		    icon: icon,
		    animation: google.maps.Animation.DROP,
		    clickable: true
		});
		placesArr.push(marker);
		if(places[count]) {
			var content = places[count].name + "<br>" + count + "<br>" + "<br>" + places[count].vicinity + "<br>" + places[count].types;
			windowInfoCreate(marker, location, content);
		}
		if(count == max) {
			clearInterval(displayPlaces);
		}
		// console.log(places[count].name);
		// $("#hotImage").append(newItem);
		// var newItem = $("<div class='w3-card itemDisplay'>" + places[count].name + "</div>");
		var newDiv = $('<div class="w3-card subInfocardRight" data-index="' + count + '"><div class="row header"><div class="wrapper"><p>' + places[count].name + '</p></div></div></div>');
		$("#hotImage").append(newDiv);
		$("#fooImage").empty();
		$("#entImage").empty();
		count ++;
	}, 125);
}
function addEventMarkers() {
	icon = {
	    url: "assets/images/markBear.png",
	    scaledSize: new google.maps.Size(50, 50),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25, 50)
	}
	var count = 0;
	var max = 9;
	if(events.length < 10) {
		max = events.length - 1;
	}
	var displayMarkers = setInterval(function() {
		var lat = events[count].latitude;
		var lng = events[count].longitude;
		var latLng = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
		    position: latLng,
		    map: map,
		    icon: icon,
		    animation: google.maps.Animation.DROP,
		    clickable: true
		});
		eventsArr.push(marker);
		if(events[count]) {
			// console.log(markers[count]);
			var content = events[count].title; // + "<br>" + events[count].vicinity + "<br>" + events[count].types;
			windowInfoCreate(marker, latLng, content);
		}
		if(count == max) {
			clearInterval(displayMarkers);
		}
		$("#entImage").append($('<div class="w3-card subInfocardRight" data-index="' + count + '"><div class="row header"><div class="wrapper"><p>' + events[count].title + '</p></div></div></div>'));
		$("#fooImage").empty();
		$("#hotImage").empty();
		count ++;
	}, 125);
}
function addFoodMarkers() {
	icon = {
	    url: "assets/images/markBear.png",
	    scaledSize: new google.maps.Size(50, 50),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25, 50)
	}
	// console.log(food[0]);
	var count = 0;
	var max = 9;
	if(food.length < 10) {
		max = food.length - 1;
	}
	var displayMarkers = setInterval(function() {	
		var lat = food[count].location.latitude;
		var lng = food[count].location.longitude;
		var latLng = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
		    position: latLng,
		    map: map,
		    icon: icon,
		    animation: google.maps.Animation.DROP,
		    clickable: true
		});
		foodArr.push(marker);
		if(food[count]) {
			// console.log(markers[count]);
			var content = food[count].name; // + "<br>" + food[count].vicinity + "<br>" + food[count].types;
			windowInfoCreate(marker, latLng, content);
		}
		if(count == max) {
			clearInterval(displayMarkers);
		}
		$("#fooImage").append($('<div class="w3-card subInfocardRight" data-index="' + count + '"><div class="row header"><div class="wrapper"><p>' + food[count].name + '</p></div></div></div>'));
		$("#hotImage").empty();
		$("#entImage").empty();
		count ++;
	}, 125);
}
function zoomMarker(markers, index) {
	map.panTo(markers[index].getPosition());
   	map.setZoom(17);
}
function searchPlaces(results, status) {
	if(status == google.maps.places.PlacesServiceStatus.OK) {
		for(var i = 0; i < results.length; i++) {
			var place = results[i];
			places.push(place);
		}
		// var test = markers[0].photos[0].getUrl();
	}
}
// function addEvents() {
// 	for(var i = 0; i < events.length; i ++) {
// 		var place = events[i];
// 		eventMarkers.push(place);
// 	}
// }
function addPlaces(latLng) {
	var googlePlaces = new google.maps.places.PlacesService(map);
	// 1609.34 is one mile in meters
	var request = {
		location: latLng,
		radius: 5000,
		types: ["lodging"]
	};
	googlePlaces.nearbySearch(request, searchPlaces);
}
function initMap() {
  	map = new google.maps.Map(document.getElementById("map"), newMap);
  		var options = {
  			types: ["(cities)"],
  			componentRestrictions: {"country": "us"}
  		};
  	var input = document.getElementById("autocomplete");
  	var autocomplete = new google.maps.places.Autocomplete(input, options);
  	google.maps.event.addListener(autocomplete, 'place_changed', function () {
    	fullName = autocomplete.getPlace().formatted_address;
    	if(fullName) {
    		citySearch();
    	}
    	
	});
}
function updateMap(lat, lng, zLevel) {
  	var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(zLevel);
    scrollwheel:  false;
}

// geocode api request for lat lng of input field value
function citySearch() {
	$("#hotImage").empty();
	$("#entImage").empty();
	$("#fooImage").empty();
	state = 0;
	clearMarkers(eventsArr);
	clearMarkers(placesArr);
	clearMarkers(foodArr);
	food = [];
	foodArr = [];
	events = [];
	eventsArr = [];
	places = [];
	placesArr = [];
	var query = fullName;
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&sensor=false";
	$.get(queryURL, function(data) {
		// holds lat and lng values
		loc = data.results[0].geometry.location;
		cityState = data.results[0].formatted_address.split(", ");
		cityState[1] = cityState[1].substring(0, 2);

		// for(var i = 0; i < cityState.length; i ++) {
		// 	cityState[i] = cityState[i].split(",");
		// }
		// prepares the zoom level
		// var zLevel = scope(data);
		// city level
		var zLevel = 13;
		// marker zoom
		// var zLevel = 17;
		updateMap(loc.lat, loc.lng, zLevel);
		var latLng = new google.maps.LatLng(loc.lat, loc.lng);
		addPlaces(latLng);
		eventSearch(loc.lat, loc.lng);
		zomatoCitySearch(loc.lat,loc.lng);
		weatherCall(loc.lat,loc.lng);
		cseSearch(cityState[0] + " " + cityState[1]);
		// enables CSE search off for testing
		// cseSearch(query);
		// capatilizes the first letter and updates headline html
		$(".city").html(cityState[0] + ", " + cityState[1]);
		// clears the search box after submit
		// $("#autocomplete").val("");
		var realClock = setInterval(realTime, 100);
	});
}

function eventSearch(lat, lng) {
	var oArgs = { 
    	app_key: "2pRpwC3ck9hKHFqh", 
    	q:"music",
    	// "35.2270869"+"," + "-80.8431267", - charlotte
    	location: lat +"," + lng,
    	within: 10,
    	date: "This Week",
    	// "All", "Future", "Past", "Today", "Last Week", "This Week", "Next week", and months by name
    	// 'YYYYMMDD00-YYYYMMDD00', for example '2012042500-2012042700'; the last two digits of each date in this format are ignored. 
    	sort_order: "popularity",
    	sort_direction: "ascending",
    	image_sizes: "small",
    	page_size: 10
    	//number of results per page
    	// page_number: 1 
    }; 
    EVDB.API.call("/events/search", oArgs, function(data) { 
    	var event = data.events.event;
  		for(var i = 0; i < event.length; i++) {
			var place = event[i];
			events.push(place);
		}
    });
}

// Sets the map on all markers in the array.
function setMapOnAll(map, arr) {
	for (var i = 0; i < arr.length; i++) {
	  arr[i].setMap(map);
	}
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers(arr) {
	setMapOnAll(null, arr);
}

// loads the map into html after the page has loaded
$("body").append($('<script class="customMap" async defer src="https://maps.googleapis.com/maps/api/js?key=' + mapsKey + '&libraries=places&callback=initMap"></script>'));
// geocode api request for lat lng of input field value
$(".infocardRight").on("click", function() {

	if($(this).attr("id") == "hotelBtn" && state != 1) {
		state = 1;
		$("#hotImage").empty();
		$("#fooImage").empty();
		$("#entImage").empty();
		clearMarkers(placesArr);
		clearMarkers(eventsArr);
		clearMarkers(foodArr);
		updateMap(loc.lat, loc.lng, 13);
		addPlaceMarkers();
	}
	if($(this).attr("id") == "entBtn" && state != 3) {
		state = 3;
		$("#hotImage").empty();
		$("#fooImage").empty();
		$("#entImage").empty();
		clearMarkers(placesArr);
		clearMarkers(eventsArr);
		clearMarkers(foodArr);
		updateMap(loc.lat, loc.lng, 13);
		addEventMarkers();
	}
	if($(this).attr("id") == "foodBtn" && state != 2) {
		state = 2;
		$("#hotImage").empty();
		$("#fooImage").empty();
		$("#entImage").empty();
		clearMarkers(placesArr);
		clearMarkers(eventsArr);
		clearMarkers(foodArr);
		updateMap(loc.lat, loc.lng, 13);
		addFoodMarkers();
	}		
});
$(document).on("click", ".subInfocardRight", function() {
	if(state == 1) {
		var index = $(this).attr("data-index");
		zoomMarker(placesArr, index);
	}
	if(state == 2) {
		var index = $(this).attr("data-index");
		zoomMarker(foodArr, index);
	}
	if(state == 3) {
		var index = $(this).attr("data-index");
		zoomMarker(eventsArr, index);
	}
});
function cseSearch(query) {
	var cseKey = "AIzaSyBQWDimnA-AjyNZlXIsh_R3Ld8wYlAksfA";
	// var cseKey = "AIzaSyDrufMCRtOuOdYgbTXT-piKR3A-hZb5YvU";
	var SEid = "004303949972187002826:5vg83odxtam";
	// var query = prompt("Enter a Search");
	var queryURL = "https://www.googleapis.com/customsearch/v1?&key=" + cseKey + "&cx=" + SEid + "&q=" + query + "+hotels";
	$.get(queryURL, function(data) {
		cseData = data.items;
		console.log(cseData);
		console.log(data.items[0].pagemap.cse_image[0].src);
	});	
}
// allows for Enter key to submit input field value
// $("#autocomplete").keyup(function(event){
//     if(event.keyCode == 13){
//         $(".searchButton").click();
//     }
// });
// CSE search for images temporarily disabled
// function cseSearch(query) {
// 	var cseKey = "AIzaSyBQWDimnA-AjyNZlXIsh_R3Ld8wYlAksfA";
// 	// var cseKey = "AIzaSyDrufMCRtOuOdYgbTXT-piKR3A-hZb5YvU";
// 	var SEid = "004303949972187002826:5vg83odxtam";
// 	// var query = prompt("Enter a Search");
// 	var queryURL = "https://www.googleapis.com/customsearch/v1?&key=" + cseKey + "&cx=" + SEid + "&q=" + query + "+hotels";
// 	$.get(queryURL, function(data) {
// 		$(".display2").empty();
// 		$("#banner").attr("background-image", "");
// 		$("#banner").attr("style", "background-image: url('" + data.items[0].pagemap.cse_image[0].src + "')");
// 		for(var i = 0; i < data.items.length; i ++) {
// 			if(data.items[i].pagemap.cse_image) {
// 				for(var j = 0; j < data.items[i].pagemap.cse_image.length; j ++) {
// 					var temp = $("<div class='imgWrap col-xs-12'><img class='image col-xs-12' src='" + data.items[i].pagemap.cse_image[0].src + "'></div>");
// 					$(".display2").append(temp);
// 				}
// 			}
// 		}
// 	});	
// }

function zomatoCitySearch(lat,lon) {

    Zomato.init({
        key: "d150aa87132f13a2b96ee66a7f926f6f"
    });
    
    Zomato.locations({
        //replace query with the city name from google search
        query: "",
        //replace with the lat/long variables
        lat: lat, 
        lon: lon,
        //returns the first matching city
        count: 1
    }, function(data) {
        // document.getElementById("locations_op").innerHTML = JSON.stringify(s);
       
        //need these to run the locationsDetails function
        entityId = data.location_suggestions[0].entity_id;
        entityType = data.location_suggestions[0].entity_type;
        zomatoCityRestaurants(entityId,entityType);
        // geocode();
    });
};

function zomatoCityRestaurants(entityId,entityType) {   
	
    Zomato.locationsDetails({
        entity_id: entityId,
        entity_type: entityType,
    }, function(data) {
        // document.getElementById("locations_op").innerHTML = JSON.stringify(s);

         for(var i = 0; i < data.best_rated_restaurant.length; i++) {
        	// console.log(data.nearby_restaurants[i].restaurant.name);
			var place = data.best_rated_restaurant[i].restaurant;
			food.push(place);
		}
    });
};


  function monthlyWeather() {
  	var d = new Date();
    var n = d.getMonth()
    var month = n + 1;
    if (month < 9) {
    	convertMonth = "0" + month
    } else {
    	convertMonth = month
    }
  	// var begin = String(startDateData);
    beginConvert = convertMonth + '01';
    end = convertMonth + '28';
  
    var monthlyURL = "https://api.wunderground.com/api/49f1eacd626559d9/planner_"+beginConvert+end+"/q/" + stAbbr + "/" + city + ".json"
    $.ajax({
      url : monthlyURL,
      dataType : "jsonp",
      success : function(data) {
        var low = data['trip']['temp_low']['avg']['F'];
        var high = data['trip']['temp_high']['avg']['F'];
        var chance = data['trip']['chance_of']['chanceofprecip']['percentage'];
        // $('#imageOne').append()
        // $('#imageOne').append("<h2>Forecasts for the month of your trip</h2>")
        // $('#imageOne').append("<h3>Average low "+low+" F°</h3>")
        // $('#imageOne').append("<h3>Average high "+high+" F°</h3>")
        // $('#imageOne').append("<h3>Chance of precipitation "+chance+" %</h3>");
      }
    });
  }

  function currentWeather() {
    var currentURL = "https://api.wunderground.com/api/49f1eacd626559d9/geolookup/conditions/q/" + stAbbr + "/" + city + ".json"

    $.ajax({
      url : currentURL,
      dataType : "jsonp",
      success : function(data) {
        var location = data['location']['city'];
        var temp_f = data['current_observation']['temp_f'];
        var image = data['current_observation']['icon_url'];
        var conditions = data['current_observation']['weather']; 
       
        $(".weatherImg").attr("src", image);
        $(".temp").html(temp_f + "&#8457");
        // $('#imageTwo').append("<h3>The current condition is "+ conditions.toLowerCase() +".</h3>")
      }
      });
  } 
function weatherCall(lat,lon) {

  var queryURL = "https://api.wunderground.com/api/49f1eacd626559d9/geolookup/q/" + lat + "," + lon + ".json"
   $.ajax({
    url : queryURL,
    dataType : "jsonp",
    success : function(data) {
      stAbbr = data.location.state
      city = data.location.city
      //add to divs
      // $("#imageOne").before("<div id='image'>")
      // $('#image').append("<h2>"+ city + "," + stAbbr +"</h2>")
      monthlyWeather();
      currentWeather();
    }
  });

}

// function weatherCall() {
// 	var queryURL = "https://api.wunderground.com/api/49f1eacd626559d9/geolookup/conditions/q/" + cityState[1] + "/" + cityState[0] + ".json"

// 	$.ajax({
// 		url : queryURL,
// 		dataType : "jsonp",
// 		success : function(data) {
// 			var location = data['location']['city'];
// 			var temp_f = data['current_observation']['temp_f'];
// 			var image = data['current_observation']['icon_url'];
// 			var conditions = data['current_observation']['weather'];  
// 			$(".weatherImg").attr("src", image);
// 			$(".temp").html(temp_f + "&#8457");
// 		}
// 	});
// }
function w3_open() {
    document.getElementById("main").style.marginRignt = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
    document.getElementById("main").style.marginRight = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}
// updates the real time clock to within 1/10 of a second
function realTime() {
  	$(".clock").html(moment().format("HH:mm:ss"));
}
// Old Code That May Be Useful

// function scope(data) {
// 	// Country
// 	if(data.results[0].address_components.length === 1) {
// 		var zLevel = 4;
// 	// State
// 	} else if(data.results[0].address_components.length === 2) {
// 		var zLevel = 6;
// 	// County
// 	} else if(data.results[0].address_components.length === 3) {
// 		var zLevel = 9;
// 	// City
// 	} else if(data.results[0].address_components.length === 5) {
// 		var zLevel = 10;
// 	// Street
// 	} else if(data.results[0].address_components.length === 7) {
// 		var zLevel = 14;
// 	// Business
// 	} else if(data.results[0].address_components.length === 10) {
// 		var zLevel = 17;
// 	// Default
// 	} else {
// 		var zLevel = 8;
// 	}
// 	return zLevel;
// }

// function addMarker(lat, lng) {
// 	icon = {
// 	    url: "assets/images/markBear.png",
// 	    scaledSize: new google.maps.Size(50, 50),
// 	    origin: new google.maps.Point(0, 0),
// 	    anchor: new google.maps.Point(25, 50)
// 	}
// 	var marker = new google.maps.Marker({
// 	    position: new google.maps.LatLng(lat, lng),
// 	    map: map,
// 	    icon: icon,
// 	    animation: google.maps.Animation.DROP
// 	});
// 	markers.push(marker);
// }