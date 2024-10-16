var map = L.map('map').setView([50, 0.15], 8);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZjkyMzAxamIiLCJhIjoiY2t6aWFqd3I5MWtsNjJub2NlYnYyMjYzNCJ9.QQZEWC408QPHTwtBiZ_FXA', {

    id: 'OpenStreetMap',
    minZoom: 5,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & <a href="https://map.openseamap.org/legend.php?lang=en&page=license">OpenSeaMap</a>, ' +
       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
    
}).addTo(map);

var boatIcon = L.icon({

    iconUrl: 'boat-tour.svg',

    iconSize:     [15, 38],
    iconAnchor:   [7.5, 10], 
    popupAnchor:  [7.5, 10]

});

var locations = [
  ["BOAT", 48, 0.15],
  ["BOAT2", 49, 0.15],
  ["BOAT3", 50, 0.15],
  ["BOAT4", 51, 0.15],
  ["BOAT5", 52, 0.15]
];


for (var i = 0; i < locations.length; i++) {

  var content = "";

  for (var j = 0; j < (locations[i].length); j++) {

    content = content + String(locations[i][j]) + "<br>";

  }

  marker = new L.marker([locations[i][1], locations[i][2]], {icon: boatIcon})
    .bindPopup(content)
    .addTo(map);
}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

map.addLayer({
    id: 'OpenSeaMap',
    minZoom: 5,
    maxZoom: 18,
    source: {
        tiles: ['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'],
        tileSize: 512
    },
    zoomOffset: -1
});

