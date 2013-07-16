var app = {  
  sqkm_details: null,
  sqkm_overview: null,
  map_controller: null,
  current_day_container: null,
  active_view_switcher: null,
  view_panel: null,
  init: function() {
    this.initMap();
    this.initDetails();
    this.initViewSwitcher();
    this.initSidebar();
    this.initCurrentDayContainer();
    this.initViewPanel();
    this.initOverview();
  },
  initViewPanel: function() {
    this.view_panel = d3.select('#daily-view-panel');
  },
  initCurrentDayContainer: function() {
    this.current_day_container = d3.select('#current-day');
  },
  initSidebar: function() {
    var _self = this;
    d3.selectAll('#sidebar a.nav').on('click', function(){
      d3.selectAll('#sidebar a.nav').classed('active',false);      
      d3.select(this).classed('active',true);
      var day = d3.select(this).attr('data-day');
      _self.map_controller.updateDate(day);
      _self.current_day_container.text(day);
    });
  },
  initOverview: function() {
    var _self = this;
    var content_manager = loopa.content_managers.totals();
    content_manager.load();
    this.sqkm_overview = sqkm_overview({
      container: d3.select('.square-km-overview'),
      content_manager: content_manager,
      onClose: function() {
        _self.sqkm_details.hide();
        _self.showViewPanel();
      }
    });
  },
  initDetails: function() {    
    this.sqkm_details = sqkm_details({
      container: d3.select('.square-detail-panel')
    });
    this.addCharts();
  },  
  addCharts: function() {
    this.addIncomeChart();
    this.addTopProductsChart();    
  },
  addIncomeChart: function() {
    var cm = loopa.content_managers.daily();
    cm.load();
    var chart = loopa.charts.daily_income({
      content_manager: cm,
      container: this.sqkm_details.tabs_view_wrapper.select('.line-view')
    });
    this.sqkm_details.addChart(chart);
  },
  addTopProductsChart: function() {
    var cm = loopa.content_managers.top_products();
    cm.load();
    chart = loopa.charts.top_products({
      content_manager: cm,
      container: this.sqkm_details.tabs_view_wrapper.select('.pie-view')
    });
    this.sqkm_details.addChart(chart);
  },
  initMap: function() {
    var _self = this;
    this.map_controller = map_controller({
      container_id: 'daily-map',
      squareOnClick: function(data, element){
        _self.squareOnClick(data, element);
      },
      scale_handler: daily_scale_handler({
        scale_container: d3.select("#day-colour-scale"),
        ranges: loopa.config.colour_ranges
      }),
      current_view: 'clients',
      current_date: 'monday',
      parser: daily_parser()
    });
  },
  initViewSwitcher: function() {
    var _self = this;
    d3.selectAll('a.view-switcher').on('click', function(){
      _self.map_controller.updateView(d3.select(this).attr('data-view'));        
      if(_self.active_view_switcher){
        _self.active_view_switcher.classed('active',false);
      }
      _self.active_view_switcher = d3.select(this).classed('active',true);
    });
  },  
  squareOnClick: function(data, element) {        
    this.sqkm_overview.update(data.properties.id);  
    this.sqkm_details.update(data.properties.id);    
    this.sqkm_details.show();    
    this.sqkm_overview.show();    
    this.hideViewPanel();
  },
  showViewPanel: function() {
    this.view_panel
        .transition()
        .style('margin-left', '0em')
        .style('opacity', 1);
  },
  hideViewPanel: function() {
    this.view_panel
        .transition()
        .style('margin-left', '3em')
        .style('opacity', 0);
  },
  getSquareCenter: function(bottom_left, top_right) {
    var lat = bottom_left[1] + (top_right[1] - bottom_left[1]) / 2;
    var long = bottom_left[0] + (top_right[0] - bottom_left[0]) / 2;
    return [lat, long];    
  } 
};

app.init();
