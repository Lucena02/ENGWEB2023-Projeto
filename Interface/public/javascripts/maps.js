let map;

var mapPositionLat = 0
var mapPositionLng = 0


function setCoords(lat,lng){
    console.log('Coordinates:', lat, lng);
    mapPositionLat = parseFloat(lat.substring(1,lat.length-1));
    mapPositionLng = parseFloat(lng.substring(1,lat.length-1));
    console.log('Coordinates:', mapPositionLat, mapPositionLng);
    
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: mapPositionLat, lng: mapPositionLng },
    zoom: 15,
  });
}

initMap();