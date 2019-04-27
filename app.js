// Initialize Firebase
var config = {
	apiKey: "AIzaSyBRUeNxucAPyphAtZWgxSWR_fCPIJPvAfo",
	authDomain: "citrushack2019-a7dd9.firebaseapp.com",
	databaseURL: "https://citrushack2019-a7dd9.firebaseio.com",
	projectId: "citrushack2019-a7dd9",
	storageBucket: "citrushack2019-a7dd9.appspot.com",
	messagingSenderId: "876422418130"
};
firebase.initializeApp(config);

var firestore = firebase.firestore();

var markersArray = [];


function posToString(latLng) {
	return latLng.lat().toString() + latLng.lng().toString();
}

function isNewMarker(latlng) {
	for (var i = 0; i < markersArray.length; i++) {
		if (markersArray[i].getPosition().equals(latlng)) {
			return false;
		}
	}
	return true;
}


getRealTimeUpdates = function(map) {
	firestore.collection("locations")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            myData = doc.data();

            if (isNewMarker(new google.maps.LatLng(myData.lat, myData.long))) {
            	console.log(doc.id, " => ", myData);
            	latlng = {lat: myData.lat, lng: myData.long};
            	createMarker(latlng, map);
            }


        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function addLocation(latLng, map) {

	console.log(latLng);

	var docRef = firestore.doc("locations/" + posToString(latLng));

	docRef.set({
		lat: latLng.lat(),
		long: latLng.lng(),
	}).then(function() {
		console.log("position saved")
	}).catch(function(error) {
		console.log("Got an error: ", error);
	})

	getRealTimeUpdates(map);
	
}



function removeMarker(marker) {
	firestore.collection("locations")
	.where("lat", "==", marker.getPosition().lat())
	.where("long", "==", marker.getPosition().lng())
	.get()
	.then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc.ref.delete();
		})
	})
	marker.setMap(null);
}




function createMarker(latlng, map) {
	var marker = new google.maps.Marker({
		position: latlng,
		icon: trashicon,
		map: map
	});
	marker.addListener('click', function() {
		removeMarker(marker);
	});
	markersArray.push(marker);
}