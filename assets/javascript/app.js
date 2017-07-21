// API key
var mapsKey = "AIzaSyCdasgXLKtxe1vhh8nU7KP3tgCYB8o2yZg";
var map, icon, fullName;
var cityState = [];
var food = [];
var foodArr = [];
var markers = [];
var markerArr = [];
var events = [];
var eventMarkers = [];
var eventsMarkerArr = [];
var places = [];
var placesArr = [];
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
	var count = 10;
	// console.log(places);
	if(places.length < 10) {
		count = places.length;
	}
	var displayPlaces = setInterval(function() {
		count --;
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
			var content = places[count].name + "<br>" + places[count].vicinity + "<br>" + places[count].types;
			windowInfoCreate(marker, location, content);
		}
		if(count == 0) {
			clearInterval(displayPlaces);
		}
		console.log(places[count].name);
		var newItem = $("<div class='w3-card itemDisplay'>" + places[count].name + "</div>");
		$("#rightCol").append(newItem);
	}, 125);
}
function addEventMarkers() {
	icon = {
	    url: "assets/images/markBear.png",
	    scaledSize: new google.maps.Size(50, 50),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25, 50)
	}
	var count = 10;
	if(events.length < 10) {
		count = events.length;
	}
	var displayMarkers = setInterval(function() {
		count --;
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
		eventsMarkerArr.push(marker);
		if(events[count]) {
			// console.log(markers[count]);
			var content = events[count].title; // + "<br>" + events[count].vicinity + "<br>" + events[count].types;
			windowInfoCreate(marker, latLng, content);
		}
		if(count == 0) {
			clearInterval(displayMarkers);
		}
		$(".rightCol").append($('<div class="w3-card infocardRight"><div class="row header"><div class="wrapper"><p>' + events[count].title + '</p></div></div></div>'));
	}, 125);
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
	clearMarkers(eventsMarkerArr);
	clearMarkers(placesArr);
	clearMarkers(foodArr);
	food = [];
	foodArr = [];
	events = [];
	eventMarkers = [];
	eventsMarkerArr = [];
	places = [];
	placesArr = [];
	var query = fullName;
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&sensor=false";
	$.get(queryURL, function(data) {
		// holds lat and lng values
		var loc = data.results[0].geometry.location;
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
		zomatoSearch(loc.lat, loc.lng);
		weatherCall();
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

	if($(this).attr("id") == "hotelBtn") {
		clearMarkers(placesArr);
		clearMarkers(eventsMarkerArr);
		clearMarkers(foodArr);

		addPlaceMarkers();
	}
	if($(this).attr("id") == "entBtn") {
		clearMarkers(placesArr);
		clearMarkers(eventsMarkerArr);
		clearMarkers(foodArr);

		addEventMarkers();
	}
	if($(this).attr("id") == "foodBtn") {
		clearMarkers(placesArr);
		clearMarkers(eventsMarkerArr);
		clearMarkers(foodArr);

		addFoodMarkers();
	}		
});
// allows for Enter key to submit input field value
// $("#autocomplete").keyup(function(event){
//     if(event.keyCode == 13){
//         $(".searchButton").click();
//     }
// });
// CSE search for images temporarily disabled
function cseSearch(query) {
	var cseKey = "AIzaSyBQWDimnA-AjyNZlXIsh_R3Ld8wYlAksfA";
	// var cseKey = "AIzaSyDrufMCRtOuOdYgbTXT-piKR3A-hZb5YvU";
	var SEid = "004303949972187002826:5vg83odxtam";
	// var query = prompt("Enter a Search");
	var queryURL = "https://www.googleapis.com/customsearch/v1?&key=" + cseKey + "&cx=" + SEid + "&q=" + query + "+hotels";
	$.get(queryURL, function(data) {
		$(".display2").empty();
		$("#banner").attr("background-image", "");
		$("#banner").attr("style", "background-image: url('" + data.items[0].pagemap.cse_image[0].src + "')");
		for(var i = 0; i < data.items.length; i ++) {
			if(data.items[i].pagemap.cse_image) {
				for(var j = 0; j < data.items[i].pagemap.cse_image.length; j ++) {
					var temp = $("<div class='imgWrap col-xs-12'><img class='image col-xs-12' src='" + data.items[i].pagemap.cse_image[0].src + "'></div>");
					$(".display2").append(temp);
				}
			}
		}
	});	
}
var entityId = "";
var entityType = "";
function zomatoSearch(lat, lng) {
	Zomato.init({
        key: "d150aa87132f13a2b96ee66a7f926f6f"
    });
    Zomato.geocode({
        lat: lat,
        lon: lng
    }, function(data) {
        // document.getElementById("locations_op").innerHTML = JSON.stringify(s);
        // console.log(data)
        for(var i = 0; i < data.nearby_restaurants.length; i++) {
        	// console.log(data.nearby_restaurants[i].restaurant.name);
			var place = data.nearby_restaurants[i].restaurant;
			food.push(place);
		}
    });
}
function weatherCall() {
	var queryURL = "https://api.wunderground.com/api/49f1eacd626559d9/geolookup/conditions/q/" + cityState[1] + "/" + cityState[0] + ".json"

	$.ajax({
		url : queryURL,
		dataType : "jsonp",
		success : function(data) {
			var location = data['location']['city'];
			var temp_f = data['current_observation']['temp_f'];
			var image = data['current_observation']['icon_url'];
			var conditions = data['current_observation']['weather'];  
			$(".weatherImg").attr("src", image);
			$(".temp").html(temp_f + "&#8457");
		}
	});
}
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