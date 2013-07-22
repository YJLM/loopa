loopa.maps.clients_map = function(opts) {
  var _self = {
    container:  null, // HTML div
    map: null,
    zoom: 15,
    svg: null,
    g: null,
    bounds: null,
    center: [4.701891, -74.1157285],
    content_manager: null,
    features: null,
    scale: null,
    last_marker: null,
    init: function() {
      this.initMap();   
      this.initOverlay();           
      this.initScale();
    },
    initScale: function() {
      this.scale = d3.scale.linear().range([0,25]);
    },
    reset: function() {                     
      _self.features.attr("cx",function(d) { return _self.map.latLngToLayerPoint(d.latLng).x; });
		  _self.features.attr("cy",function(d) { return _self.map.latLngToLayerPoint(d.latLng).y; });
		  _self.features.attr("r",function(d) { return 2*Math.log(_self.map.getZoom())*Math.sqrt(_self.scale(d.income)/Math.PI); });
    },
    initOverlay: function() {
      this.map._initPathRoot();
      this.svg = d3.select(_self.container).select('svg');
      this.g = this.svg.append('g');
    },
    initMap: function() {
      this.map = new L.map(this.container, {
        center: this.center,
        zoom: this.zoom
      })
      .addLayer(new L.TileLayer(loopa.config.cloudmade.layer_url() ));
    },
    update: function(id,coordinates,zoom) {      
      this.map.setView(coordinates, zoom || this.zoom);
      var records = this.content_manager.get(id) || [];
      this.updateScale(records);
      this.removeLastMarker();
      if(this.features) {
        this.features.remove();
      }      
      this.drawCircles(records);
    },
    removeLastMarker: function() {
      if(this.last_marker) {
        this.map.removeLayer(this.last_marker);
      }
    },
    drawCircles: function(records) {
      records.forEach(function(record){
        record.latLng = new L.LatLng(record.latitude, record.longitude);
      });
      
      _self.features = _self.g.selectAll("circle")
                      .data(records)
                      .enter()
                      .append("circle")
                      .attr('class','client')
                      .on("click", function(d){ _self.circleOnClick(d); });
      
      _self.reset();
      _self.map.on("viewreset", function() { _self.reset(); });
    },
    circleOnClick: function(d) {
      this.removeLastMarker();
      this.last_marker = L.marker(d.latLng)
                          .addTo(this.map)
                          .bindPopup(this.getMarkerPopupMarkup(d));
      setTimeout(function(){
        _self.last_marker.openPopup();
      },100);
    },    
    getMarkerPopupMarkup: function(d) {
      var s = '<span class="blue uppercase">' + d.name + '</span><br />';
      s += 'Income: $' + d.income.toMoney() + '<br />';
      return s;
    },
    updateScale: function(records) {    
      this.scale.domain([
        d3.min(records, function(d){ return d.income; }),
        d3.max(records, function(d){ return d.income; })
      ]);
    }     
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
