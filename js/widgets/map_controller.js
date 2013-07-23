loopa.widgets.map_controller = function(opts) {
  var _self = {
    map: null,
    center: [0,0],
    svg: null,
    g: null,
    zoom: 11,
    container_id: null,
    feature_collection: [],
    bounds: null,
    path: null,
    parser: null,
    scale_ranges: {},
    current_date: null,
    current_view: null,
    scale_handler: null,
    last_marker: null,
    active_km: null,
    data_file: null,
    geojson_file: "km2.json",
    init: function() {
      this.initMap();      
      this.initPath();
      this.initOverlay();
      this.loadData();
    },    
    initPath: function() {  
      this.path = d3.geo.path().projection(function(x){ return _self.project(x) });
    },    
    updateDate: function(date) {
      this.current_date = date;
      this.scale_handler.update(this.current_date, this.current_view);
      this.redraw();
      this.updateMarker();
    },
    updateView: function(view) {
      this.current_view = view;
      this.scale_handler.update(this.current_date,this.current_view);
      this.redraw();
    },
    updateMarker: function() {
      if(this.last_marker) {
        this.last_marker
            .closePopup()
            .unbindPopup()
            .bindPopup(this.getMarkerPopupMarkup( this.active_km.datum() ))
            .openPopup();
      }
    },
    redraw: function() {
      this.g.selectAll("path")
            .data(this.feature_collection.features)
            .transition()
            .style('fill', function(d) { 
              return _self.scale_handler.scale(d.properties[_self.current_date][_self.current_view]); 
            });
    },
    initMap: function() {       
      this.map = new L.map(this.container_id, {
        center: this.center,
        zoom: this.zoom
      })
      .addLayer(new L.TileLayer(loopa.config.cloudmade.layer_url() ));
    },
    initOverlay: function() {
      this.svg = d3.select(this.map.getPanes().overlayPane).append("svg");
      this.g = this.svg.append("g").classed('leaflet-zoom-hide',true);
    },
    loadData: function() {
      queue()
        .defer(d3.json, loopa.data.getFilename(this.geojson_file))
        .defer(d3.csv, loopa.data.getFilename(this.data_file))
        .await(function(a,b,c){ _self.onDataLoaded(a,b,c); });      
    },
    mergeData: function(data) {
      var hashtable = {};
      data.forEach(function(row){
        hashtable[row.id] = _self.parser.buildSqkm(row);
      });
      this.feature_collection.features.forEach(function(feature){
        var the_data = hashtable[feature.properties.id];
        for(key in the_data) {
         feature.properties[key] = the_data[key];
        }        
      });      
    },
    onDataLoaded: function(error, feature_collection, data) {
      this.feature_collection = feature_collection;
      this.scale_handler.init(data,this.current_date,this.current_view);  
      
      this.mergeData(data);      
      
      this.bounds = d3.geo.bounds(this.feature_collection);      
      var features = this.g.selectAll("path")
                            .data(this.feature_collection.features)
                            .enter()
                            .append("path")
                            .style('fill', function(d) { 
                              return _self.scale_handler.scale(d.properties[_self.current_date][_self.current_view]); 
                            })
                            .classed('square-km',true)
                            .on("click", function(data){ _self._squareOnClick(data, d3.select(this)); });
                            
      this.map.on("viewreset", function(){ _self.reset(features); });
      this.reset(features);
      this.centerMap();      
    },
    centerMap: function() {
      var max_latitude = d3.max(this.feature_collection.features, function(feature) { 
        return d3.max(feature.geometry.coordinates, function(array){
          return array[0][1];
        });
      });
      var min_latitude = d3.min(this.feature_collection.features, function(feature) { 
        return d3.min(feature.geometry.coordinates, function(array){
          return array[0][1];
        });
      });
      
      var max_longitude = d3.max(this.feature_collection.features, function(feature) { 
        return d3.max(feature.geometry.coordinates, function(array){
          return array[0][0];
        });
      });
      var min_longitude = d3.min(this.feature_collection.features, function(feature) { 
        return d3.min(feature.geometry.coordinates, function(array){
          return array[0][0];
        });
      });
      
      this.map.setView([(max_latitude + min_latitude) / 2, (max_longitude + min_longitude) / 2], this.zoom);
    },
    _squareOnClick: function(data, element) {
      this.active_km = element;
      var latLng = this.getSquareCenter(data.geometry.coordinates[0][0], data.geometry.coordinates[0][2]);
      if(this.last_marker) {
        this.map.removeLayer(this.last_marker);
      }
      this.last_marker = L.marker(latLng)
                          .addTo(this.map)
                          .bindPopup(this.getMarkerPopupMarkup(data));
      setTimeout(function(){
        _self.last_marker.openPopup();
      },100);
      this.squareOnClick(data, element);
    },
    getMarkerPopupMarkup: function(data) {
      var s = '<span class="blue uppercase">' + this.current_date + ' stats </span><br />';
      s += 'Clients: ' + data.properties[this.current_date].clients + '<br />';
      s += 'Income: $' + data.properties[this.current_date].income.toMoney() + '<br />';
      return s;
    },
    squareOnClick: function(data, element) {
      
    },
    getSquareCenter: function(bottom_left, top_right) {
      var lat = bottom_left[1] + (top_right[1] - bottom_left[1]) / 2;
      var long = bottom_left[0] + (top_right[0] - bottom_left[0]) / 2;
      return [lat, long];    
    },    
    reset: function(features) {      
      var bottom_left = this.project(this.bounds[0]),
          top_right = this.project(this.bounds[1]);

      this.svg
          .attr("width", top_right[0] - bottom_left[0])
          .attr("height", bottom_left[1] - top_right[1])          
          .style("margin-left", bottom_left[0] + "px")
          .style("margin-top", top_right[1] + "px");
      this.g.attr("transform", "translate(" + -bottom_left[0] + "," + -top_right[1] + ")");            
      features.attr("d", this.path);
    },
    project: function(x) {
      var point = this.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
      return [point.x, point.y];
    }    
  };
  
  for(key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
