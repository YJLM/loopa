loopa.views.daily = {  
  sqkm_details: null,
  sqkm_overview: null,
  map_controller: null,
  current_day_container: null,
  active_view_switcher: null,
  view_panel: null,
  container: null,
  init: function() {
    this.initContainer();    
    this.initMap();
    this.initDetails();
    this.initViewSwitcher();
    this.initSidebar();
    this.initCurrentDayContainer();
    this.initViewPanel();
    this.initOverview();    
  },
  initContainer: function() {
    this.container = d3.select('#daily-view');
  },
  initViewPanel: function() {
    this.view_panel = d3.select('#daily-view-panel');
  },
  initCurrentDayContainer: function() {
    this.current_day_container = d3.select('#current-day');
  },
  initSidebar: function() {
    var _self = this;
    this.container.selectAll('.sidebar a.nav').on('click', function(){
      _self.container.selectAll('.sidebar a.nav').classed('active',false);      
      d3.select(this).classed('active',true);
      var day = d3.select(this).attr('data-date');
      _self.map_controller.updateDate(day);
      _self.current_day_container.text(day);
    });
  },
  initOverview: function() {
    var _self = this;
    var content_manager = loopa.content_managers.totals();
    content_manager.load();
    this.sqkm_overview = loopa.widgets.sqkm_overview({
      container: this.container.select('.square-km-overview'),
      content_manager: content_manager,
      onClose: function() {
        _self.sqkm_details.hide();
        _self.showViewPanel();
      }
    });
  },
  initDetails: function() {    
    this.sqkm_details = loopa.widgets.sqkm_details({
      container: this.container.select('.square-detail-panel')
    });
    this.addCharts();
  },  
  addCharts: function() {
    this.addIncomeChart();
    this.addTopProductsChart();    
    this.addRankingChart();
  },
  addRankingChart: function() {
    var cm = loopa.content_managers.sqkm_ranking();
    cm.load();
    var chart = loopa.charts.sqkm_ranking({
      content_manager: cm,
      container: this.sqkm_details.tabs_view_wrapper.select('.curve-view')
    });
    this.sqkm_details.addChart(chart);
  },
  addIncomeChart: function() {
    var cm = loopa.content_managers.daily_income();
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
    this.map_controller = loopa.widgets.map_controller({
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
      parser: daily_parser(),
      data_file: 'per_day.csv'
    });
  },
  initViewSwitcher: function() {
    var _self = this;
    this.container.selectAll('a.view-switcher').on('click', function(){
      _self.map_controller.updateView(d3.select(this).attr('data-view'));        
      if(_self.active_view_switcher){
        _self.active_view_switcher.classed('active',false);
      }
      _self.active_view_switcher = d3.select(this).classed('active',true);
    });
  },  
  squareOnClick: function(data, element) {        
    this.sqkm_overview.update(data.properties.id); 
    var center = this.getSquareCenter(data.geometry.coordinates[0][0],data.geometry.coordinates[0][2]);
    this.sqkm_details.update(data.properties.id,center);    
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
  },
  reset: function() {
    this.showViewPanel();
    this.sqkm_details.hide();
    this.sqkm_overview.hide();
    this.sqkm_overview.reset();
    this.sqkm_details.reset();
    this.map_controller.reset();
  } 
};
