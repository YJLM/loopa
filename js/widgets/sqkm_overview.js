loopa.widgets.sqkm_overview = function(opts) {
  var _self = {
    container: null,    
    km_container: null,
    content_manager: null,
    init: function() {
      this.buildMarkup();
    },
    buildMarkup: function() {
      var inner_panel = this.container.append('div').classed('inner-panel',true);
      this.buildHeaderMarkup(inner_panel);
      this.buildStatsMarkup(inner_panel);
    },
    buildHeaderMarkup: function(inner_panel) {
      var header = inner_panel.append('div').classed('panel-header',true);
      var left = header.append('div').classed('left',true);
      this.km_container = left.append('h2');
      left.append('h3').text('overview').classed('blue',true);
      var right = header.append('div').classed('right',true);
      right.append('a').text('x').attr('href','#').on('click', function(){
        _self.hide()
        _self.onClose();
      });
      header.append('div').classed('clear',true);      
    },
    buildStatsMarkup: function(inner_panel) {
      var overview_container = inner_panel.append('div').attr('class', 'overview-container');   
      
      var stat_container = overview_container.append('div').attr('class', 'left km-stat');
      this.income_container = stat_container.append('div').attr('class', 'big');
      stat_container.append('div').attr('class','stat-name').text('income / month');
      
      stat_container = overview_container.append('div').attr('class', 'left km-stat');
      this.clients_container = stat_container.append('div').attr('class', 'big');
      stat_container.append('div').attr('class','stat-name').text('clients');
    },
    show: function() {
      this.container
                    .style('display','block')
                    .transition()
                    .style('opacity',1)
                    .style('margin-left', '0em');
    },
    hide: function() {
      this.container.transition()
                    .style('display','none')
                    .style('opacity',0)
                    .style('margin-left', '-3em');
    },
    update: function(id) {
      var data = this.content_manager.get(id);
      this.km_container.text('KM ' + id);
      this.income_container.text('$' + (+data.income).toShortString());
      this.clients_container.text(+data.clients);                                            
    },
    reset: function() {
      this.content_manager.reset();
    },
    onClose: function() {
      
    }    
  };
  for(key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
