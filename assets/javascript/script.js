var entityId = "";
var entityType = "";
    function onload(param) {

        Zomato.init({
            key: "d150aa87132f13a2b96ee66a7f926f6f"
        });
        // debugger;
        Zomato.locations({
            //replace query with the city name from google search
            query: "charlotte",
            //replace with the lat/long variables
            latitude: 35.2270869,
            longitude: -80.8431267,
            //returns the first matching city
            count: 1
        }, function(s) {
            // document.getElementById("locations_op").innerHTML = JSON.stringify(s);
            console.log(s)
            // debugger;
            //need these to run the locationsDetails function
            entityId = s.location_suggestions[0].entity_id;
            entityType = s.location_suggestions[0].entity_type;
            alsoload()
        });
    };

    function alsoload(param) {   
        Zomato.locationsDetails({
            entity_id: entityId,
            entity_type: entityType,
        }, function(s) {
            // document.getElementById("locations_op").innerHTML = JSON.stringify(s);
            console.log(s)
            console.log(entityId)
            console.log(entityType)
        });
    };