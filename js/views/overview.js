loopa.views.overview = {
  container: null,
  init: function() {
    this.initContainer();
    this.initCloseBtn();
    this.initTabs();
  },
  initContainer: function() {
    this.container = d3.select('#overview');
  },
  initTabs: function() {
    var _self = this;
    this.container.selectAll('a.inline-tab').on('click', function(){
      var tab = d3.select(this); 
     _self.container.select('a.inline-tab.active').classed('active',false);
     _self.container.select('div.inline-tab-view.visible').classed('visible',false);
      tab.classed('active',true);
      _self.container.select('#' + tab.attr('rel')).classed('visible',true);
    });
  },
  initCloseBtn: function() {
    var _self = this;
    this.container.select('a.close').on('click',function(){
      _self.hide();
    });
  },
  show: function() {
    this.container.classed('visible',true);
  },
  hide: function() {
    this.container.classed('visible',false);
  }
};
