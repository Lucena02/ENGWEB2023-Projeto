let map;

var mapPositionLat = 0
var mapPositionLng = 0


export function setCoords(lat,lng){
    console.log('Coordinates:', lat, lng);
    mapPositionLat = parseFloat(lat.substring(1,lat.length-1));
    mapPositionLng = parseFloat(lng.substring(1,lat.length-1));
    console.log('Coordinates:', mapPositionLat, mapPositionLng);
    
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  var uluru = {
    lat: parseFloat(document.getElementById('mapcoords').getAttribute("data-lat")),
    lng: parseFloat(document.getElementById('mapcoords').getAttribute("data-lng"))
  };
  console.log(uluru);
  map = new Map(document.getElementById("map"), {
    center: uluru,
    zoom: 15,
  });
}

initMap();