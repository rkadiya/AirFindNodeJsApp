
function getAirportByState(state) {
	var url = window.location.protocol + "//" + window.location.host + "/api/airports/state/" + state.toString();
	var representationOfDesiredState = "The cheese is old and moldy, where is the bathroom?";
	var client = new XMLHttpRequest();
	client.open("GET", url, false);
	client.setRequestHeader("Content-Type", "application/json");
	client.send(representationOfDesiredState);
	if (client.status == 200)
		printAirports(JSON.parse(client.responseText));
	else
	    alert("Please select a state.");
}

function getAirportsByAddressProximity(addressFromClient, distanceFromClient) {
	if (addressFromClient == "" || distanceFromClient == "" || distanceFromClient == 0) {
		alert("Please provide both address and proximity distance.");
        return;
	}
	$.ajax({
        url : window.location.protocol + "//" + window.location.host + "/api/airports/address/prox",
        type: "POST",
        data: JSON.stringify(
            {address: addressFromClient, distance: distanceFromClient}
        ),
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        success    : function(res){
            printAirports(res);
        }
    });
}

function getNearestAirport(addressFromClient) {
	if (addressFromClient == "") {
		alert("Please provide address.");
        return;
	}
	$.ajax({
        url : window.location.protocol + "//" + window.location.host + "/api/airports/nearest",
        type: "POST",
        data: JSON.stringify(
            {address: addressFromClient}
        ),
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        success    : function(res){
            printAirports(res);
        }
    });
}

function getNearestInternationalAirport(addressFromClient) {
	if (addressFromClient == "") {
		alert("Please provide address.");
        return;
	}
	$.ajax({
        url : window.location.protocol + "//" + window.location.host + "/api/airports/nearestInternational",
        type: "POST",
        data: JSON.stringify(
            {address: addressFromClient}
        ),
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        success    : function(res){
            printAirports(res);
        }
    });
}

function printAirports(airports) {
	var ap = "";
	ap += "<div class=\"row\">\n"
	ap += "<div class=\"col-md-12\">\n"
    for (var i = 0; i < airports.length; i++) {
    	ap += "<div class=\"well\"\n>";
    	ap += "<h4>" + airports[i].name + "</h4>\n";
    	ap += "<ul>\n";
    	ap += "<li><strong>Code: </strong>" + airports[i].code + "</li>\n";
    	ap += "</ul>\n";
    	ap += "</div>\n";
    }
    ap += "</div>\n";
    ap += "</div>\n";
    showInMap(airports);
	document.getElementById("jsondatahere").innerHTML = ap;
}

function showInMap(locations) {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(39.50, -98.35),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].loc.coordinates[1], locations[i].loc.coordinates[0]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i].name);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

}