loopa.maps.clients_map = function(opts) {
  var _self = {
    container:  null, // HTML div
    map: null,
    zoom: 15,
    center: [4.701891, -74.1157285],
    init: function() {
      this.initMap();    
    },
    initMap: function() {
      this.map = new L.map(this.container, {
        center: this.center,
        zoom: this.zoom
      })
      .addLayer(new L.TileLayer(loopa.config.cloudmade.layer_url() ));
    },
    update: function(coordinates,zoom) {      
      this.map.setView(coordinates, zoom || this.zoom);
    }      
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
