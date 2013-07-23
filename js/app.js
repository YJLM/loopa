var app = {  
  view_height: 646,
  init: function() {
    this.initCompany();
    this.initViews();
    this.initNav();    
  },
  initCompany: function() {
    loopa.company_id = +window.location.hash.replace('#','') || 2;
  },
  initNav: function() {
    var _self = this;
    d3.select('#daily-view-nav').on('click', function(){
      _self.showDailyView();
      _self.setActiveNav(d3.select(this));
    });
    d3.select('#monthly-view-nav').on('click', function(){
      _self.showMonthlyView();
      _self.setActiveNav(d3.select(this));
    });
    d3.select('#overview-nav').on('click', function(){
      loopa.views.overview.show();
      _self.setActiveNav(d3.select(this));
    });
  },
  setActiveNav: function(active_trigger) {
    d3.select('a.nav.active').classed('active',false);
    active_trigger.classed('active',true);
  },
  initViews: function() {
    loopa.views.daily.init();
    loopa.views.monthly.init();
    loopa.views.overview.init();
  },
  showMonthlyView: function() {
    loopa.views.overview.hide();
    loopa.views.daily.container
                .transition()
                .style('margin-top',-this.view_height + 'px');
  },
  showDailyView: function() {
    loopa.views.overview.hide();
    loopa.views.daily.container
                .transition()
                .style('margin-top', 0 + 'px');
  }
}

app.init();


