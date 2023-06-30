let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 41.544494531853466, lng: -8.426232643797164 },
    zoom: 15,
  });
}

initMap();