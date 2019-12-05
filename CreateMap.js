var map;

function initMap() {
  //Where player starts
  var playerPosition = { lat: 43.652772, lng: -79.383673 };
  var startCenter = { lat: 43.652772, lng: -79.383673 };
  var newCenter = { lat: 43.655772, lng: -79.383673 };

  //Creates map centered on player position
  map = new google.maps.Map(document.getElementById("map"), {
    center: startCenter,
    zoom: 15,
    streetViewControl: false,
    minZoom: 14,
    maxZoom: 19
  });

  var playerIcon = {
    url: "penguin.png",
    scaledSize: new google.maps.Size(60, 60)
  };

  var marker = new google.maps.Marker({
    position: playerPosition,
    map: map,
    icon: playerIcon
  });

  var Boundary = new google.maps.Circle({
    strokeColor: "#328ba8",
    strokeOpacity: 0.1,
    fillColor: "#328ba8",
    fillOpacity: 0.3,
    map: map,
    center: startCenter,
    radius: 1000
  });

  map.addListener("click", radiusResize);

  function radiusResize() {
    var i = 0;
    var lat_diff = newCenter.lat - startCenter.lat;
    var cen = startCenter.lat;
    var lng_diff = newCenter.lng - startCenter.lng;
    var lat_Step = lat_diff / 100; //include / number of steps later *
    var newBoundary = new google.maps.Circle({
      strokeColor: "#f5f242",
      strokeOpacity: 1,
      map: map,
      center: newCenter,
      radius: 500
    });
    function myLoop() {
      setTimeout(function() {
        cen += lat_Step;
        Boundary.setRadius((Boundary.radius -= 5));
        Boundary.setCenter({
          lat: cen,
          lng: -79.383673
        });
        i++;
        if (i < 100) {
          myLoop();
        } else {
          console.log("lat diff: " + lat_diff + " and lng: " + lng_diff);
          newBoundary.setMap(null);
        }
      }, 100);
    }
    myLoop();
  }

  // ~~Sets limit on user pan~~ //
  var allowedBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(
      playerPosition.lat * 0.9999,
      playerPosition.lng * 1.0001
    ),
    new google.maps.LatLng(
      playerPosition.lat * 1.0001,
      playerPosition.lng * 0.9999
    )
  );

  var lastValidCenter = map.getCenter();

  google.maps.event.addListener(map, "center_changed", function() {
    if (allowedBounds.contains(map.getCenter())) {
      // still within valid bounds, so save the last valid position
      lastValidCenter = map.getCenter();
      return;
    }
    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
  });
}

function findMe() {
  function gotem(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    document.getElementById("pos").innerHTML =
      "well it seems like your lat is " + lat + "and your long is " + long;
  }
  navigator.geolocation.getCurrentPosition(gotem);
}

/*{
          lat: (Boundary.center.lat += lat_step),
          lng: -79.383673
        });
        */
