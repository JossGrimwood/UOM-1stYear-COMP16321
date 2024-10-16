var map = L.map('map').setView([50, 0.15], 8);

L.RotatedMarker = L.Marker.extend({
  options: {
    rotationAngle: 0,
    rotationOrigin: "",
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this);

    L.Util.setOptions(this, options);
    this._latlng = L.latLng(latlng);

    var iconOptions = this.options.icon && this.options.icon.options;
    var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
    if (iconAnchor) {
      iconAnchor = iconAnchor[0] + "px " + iconAnchor[1] + "px";
    }

    this.options.rotationOrigin =
      this.options.rotationOrigin || iconAnchor || "center bottom";
    this.options.rotationAngle = this.options.rotationAngle || 0;

    // Ensure marker keeps rotated during dragging
    this.on("drag", function (e) {
      e.target._applyRotation();
    });
  },

  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map);
  },

  _setPos: function (pos) {
    L.Marker.prototype._setPos.call(this, pos);
    this._applyRotation();
  },

  _applyRotation: function () {
    if (this.options.rotationAngle) {
      this._icon.style[L.DomUtil.TRANSFORM + "Origin"] =
        this.options.rotationOrigin;

      this._icon.style[L.DomUtil.TRANSFORM] +=
        " rotateZ(" + this.options.rotationAngle + "deg)";
    }
  },

  setRotationAngle: function (angle) {
    this.options.rotationAngle = angle;
    this.update();
    return this;
  },

  setRotationOrigin: function (origin) {
    this.options.rotationOrigin = origin;
    this.update();
    return this;
  },
});

L.rotatedMarker = function (latlng, options) {
  return new L.RotatedMarker(latlng, options);
};

L.Control.MousePosition = L.Control.extend({

    _pos: null,

    options: {
        position: 'bottomleft',
        separator: ' : ',
        emptyString: 'Unavailable',
        lngFirst: false,
        numDigits: 5,
        lngFormatter: undefined,
        latFormatter: undefined,
        formatter: undefined,
        prefix: "",
        wrapLng: true,
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        L.DomEvent.disableClickPropagation(this._container);
        map.on('mousemove', this._onMouseMove, this);
        this._container.innerHTML = this.options.emptyString;
        return this._container;
    },

    onRemove: function (map) {
        map.off('mousemove', this._onMouseMove)
    },

    getLatLng: function() {
        return this._pos;
    },

    _onMouseMove: function (e) {
        this._pos = e.latlng.wrap();
        var lngValue = this.options.wrapLng ? e.latlng.wrap().lng : e.latlng.lng;
        var latValue = e.latlng.lat;
        var lng;
        var lat;
        var value;
        var prefixAndValue;

        if (this.options.formatter) {
            prefixAndValue = this.options.formatter(lngValue, latValue);
        } else {
            lng = this.options.lngFormatter ? this.options.lngFormatter(lngValue) : L.Util.formatNum(lngValue, this.options.numDigits);
            lat = this.options.latFormatter ? this.options.latFormatter(latValue) : L.Util.formatNum(latValue, this.options.numDigits);
            value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
            prefixAndValue = this.options.prefix + ' ' + value;
        }

        this._container.innerHTML = prefixAndValue;
    }

});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

L.control.mousePosition = function (options) {
    return new L.Control.MousePosition(options);
};

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZjkyMzAxamIiLCJhIjoiY2t6aWFqd3I5MWtsNjJub2NlYnYyMjYzNCJ9.QQZEWC408QPHTwtBiZ_FXA', {

    id: 'OpenStreetMap',
    minZoom: 2,
    maxZoom: 12,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & <a href="https://map.openseamap.org/legend.php?lang=en&page=license">OpenSeaMap</a>, ' +
       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1

}).addTo(map);

var nautical = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

var satellite = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}');

function changeLayer(layerChoice) {
    map.eachLayer(function (layer) {
       map.removeLayer(layer);
    });
    if (layerChoice === "tiles") {
        map.addLayer(tiles);
    }
    else if (layerChoice === "nautical") {
        map.addLayer(nautical);
    }
    else {
        map.addLayer(satellite);
    }
    addBoats();
}

var boatIcon = L.icon({
 
    iconUrl: 'map-icons-master/location-arrow.svg',

    iconSize:     [15, 38],
    iconAnchor:   [7.5, 10], 
    popupAnchor:  [7.5, 10]

});

var attributes = ["Name: ", "Longitude: ", "Latitude: ", "Bearing: "]

function addBoats() {
    var locations = [
      ["BOAT", 50.3, 0.3, 45],
      ["BOAT2", 49.9, 0.0, 90],
      ["BOAT3", 50, -0.18, 135],
      ["BOAT4", 50.2, 0.2, 180],
      ["BOAT5", 50.2, 0.1, 215],
    ];

    for (var i = 0; i < locations.length; i++) {

      var content = "";

      for (var j = 0; j < (locations[i].length); j++) {

        content = content + "<strong>" + attributes[j] + "</strong>" + String(locations[i][j]) + (j > 0 ? "°" : "") + "<br>";

      }

      content = content + "<a href='moreInfo.html'><strong>More Information</strong></a>"

      marker = new L.RotatedMarker([locations[i][1], locations[i][2]], {icon: boatIcon, rotationAngle: (locations[i][3] - 42), rotationOrigin: "center"}) //credit Leaflet Rotated Marker (https://www.npmjs.com/package/leaflet-marker-rotation)
        .bindPopup(content)
        .addTo(map);

    }

}

addBoats();

L.control.mousePosition().addTo(map);





//LEGACY CODE BELOW

/*function onMapClick(e) {

    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);

}*/

//map.on('click', onMapClick);

/*map.addLayer({

    id: 'OpenSeaMap',
    minZoom: 5,
    maxZoom: 18,
    source: {

        tiles: ['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'],
        tileSize: 512
        
    },
    zoomOffset: -1

});*/