var sqkm_details = function(opts) {
  var _self = {
    tabs_container: null,
    tabs_view_wrapper: null,
    container: null,
    sqkm: null,
    view_width: 448,
    active_tab: null,
    charts: [],
    map: null,
    tabs: [      
      {index: 0, icon: 'line', view: 'line-view'},
      {index: 1, icon: 'pie', view: 'pie-view'},
      {index: 2, icon: 'curve', view: 'curve-view'},
      {index: 3, icon: 'map', view: 'map-view'}
    ],
    init: function() {
      this.buildMarkup();  
      this.initMap();   
    },
    initMap: function() {
      this.map = loopa.maps.clients_map({
        container: this.tabs_view_wrapper.select('.map-view')[0][0]        
      });  
    },
    buildMarkup: function() {
      var inner_panel = this.container.append('div').attr('class','inner-panel');
      inner_panel.append('h2').text('Details');
      this.buildTabsMarkup(inner_panel);      
    },
    buildTabsMarkup: function(inner_panel) {            
      var viewport = inner_panel.append('div').attr('class','tabs-viewport').style('width', this.view_width + 'px');
      this.tabs_view_wrapper = viewport.append('div')
                            .attr('class','tabs-view-wrapper')
                            .style('width', (this.tabs.length * this.view_width) + 'px');
      var _self = this;
      this.tabs.forEach(function(tab){
        _self.tabs_view_wrapper
                              .append('div')
                              .style('width', _self.view_width + 'px')
                              .attr('class','tab-view left ' + tab.view);
      });                            

      this.tabs_view_wrapper.append('div').attr('class','clear');

      this.tabs_container = inner_panel.append('div').attr('class','tabs-container'); 
      var _self = this;
      this.tabs_container.selectAll('div.tab')
                    .data(this.tabs)
                    .enter()
                    .append('a')
                    .attr('class', function(d){ return 'tab ' + d.icon; })
                    .attr('href','#')                    
                    .on('mousedown', function(d){ _self.tabOnClick(d,d3.select(this)); });      
    },    
    tabOnClick: function(d, element) {
      if(this.active_tab) {
        this.active_tab.classed('active',false);
      }
      this.active_tab = element.classed('active',true);
      d3.event.preventDefault();
      this.tabs_view_wrapper
          .transition()
          .ease('linear')
          .duration(300)
          .style('margin-left',(-d.index * this.view_width) + 'px');
    },
    show: function() {
      this.container.transition()
                    .style('opacity',1)
                    .style('margin-top', '0em');
    },
    hide: function() {
      this.container.transition()
                    .style('opacity',0)
                    .style('margin-top', '1em');
    },
    update: function(id,coordinates) {       
      this.charts.forEach(function(chart){
        chart.draw(id);
      });
      this.map.update(coordinates);
    },
    addChart: function(chart) {
      this.charts.push(chart);
    }        
  };
  for(key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
