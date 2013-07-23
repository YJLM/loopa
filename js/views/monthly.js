loopa.views.monthly = {  
  sqkm_details: null,
  sqkm_overview: null,
  map_controller: null,
  current_month_container: null,
  active_view_switcher: null,
  view_panel: null,
  ranking_cm: null,
  container: null,
  init: function() {
    this.initContainer();
    this.initRankingContentManager();
    this.initMap();
    this.initDetails();
    this.initViewSwitcher();
    this.initSidebar();
    this.initCurrentMonthContainer();
    this.initViewPanel();
    this.initOverview();    
  },
  initContainer: function() {
    this.container = d3.select('#monthly-view');
  },
  initRankingContentManager: function() {
    this.ranking_cm = loopa.content_managers.sqkm_ranking();
  },
  initViewPanel: function() {
    this.view_panel = d3.select('#monthly-view-panel');
  },
  initCurrentMonthContainer: function() {
    this.current_month_container = d3.select('#current-month');
  },
  initSidebar: function() {
    var _self = this;
    this.container.selectAll('.sidebar a.nav').on('click', function(){
      _self.container.selectAll('.sidebar a.nav').classed('active',false);      
      d3.select(this).classed('active',true);
      var month = d3.select(this).attr('data-date');
      _self.map_controller.updateDate(month);
      _self.current_month_container.text(month);
    });
  },
  initOverview: function() {
    var _self = this;
    var content_manager = loopa.content_managers.totals();
    content_manager.load(function(data){
      _self.ranking_cm.load(data);
    });
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
    var chart = loopa.charts.sqkm_ranking({
      content_manager: this.ranking_cm,
      container: this.sqkm_details.tabs_view_wrapper.select('.curve-view')
    });
    this.sqkm_details.addChart(chart);
  },
  addIncomeChart: function() {
    var cm = loopa.content_managers.monthly_income();
    cm.load();
    var chart = loopa.charts.monthly_income({
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
      container_id: 'monthly-map',
      squareOnClick: function(data, element){
        _self.squareOnClick(data, element);
      },
      scale_handler: monthly_scale_handler({
        scale_container: d3.select("#month-colour-scale"),
        ranges: loopa.config.colour_ranges
      }),
      current_view: 'clients',
      current_date: 'january',
      parser: monthly_parser(),
      data_file: 'per_month.csv',
      getMarkerPopupMarkup: function(data) {
        var s = '<span class="blue uppercase">' + this.current_date + ' stats </span><br />';
        s += 'Clients: ' + data.properties[this.current_date].clients + '<br />';
        s += 'Income: $' + data.properties[this.current_date].income.toMoney() + '<br />';
        s += 'Orders: ' + data.properties[this.current_date].orders;
        return s;
      }
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
  } 
};
