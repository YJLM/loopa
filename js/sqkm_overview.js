var sqkm_overview = function(opts) {
  var _self = {
    container: null,
    overview_container: null,
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
      left.append('h2').text('KM 10');
      left.append('h3').text('overview').classed('blue',true);
      var right = header.append('div').classed('right',true);
      right.append('a').text('x').attr('href','#').on('click', function(){
        _self.hide()
        _self.onClose();
      });
      header.append('div').classed('clear',true);      
    },
    buildStatsMarkup: function(inner_panel) {
      this.overview_container = inner_panel.append('div').classed('overview-container',true);      
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
    update: function(data) {
      var stats = this.overview_container.selectAll('div.km-stat')
                                         .data(data); 
      console.log(stats.data());
      var new_stats = stats.enter()
                            .append('div')
                            .attr('class','left km-stat');
                            
      new_stats.append('div')
               .attr('class','big');
               
      new_stats.append('div')
              .attr('class','stat-name');
      
      stats.selectAll('div.big').text(function(d){ 
        return d.value; 
      });
      
      stats.selectAll('div.stat-name').text(function(d){ 
        return d.stat_name; 
      });

                                         
/*      for(var i = 0; i < 3; ++i) {
        var stat = container.append('div').attr('class','left km-stat');
        stat.append('div').classed('big',true).text(10);
        stat.append('div').classed('stat-name',true).text('orders');
      } 
      container.append('div').classed('clear',true);        */
    },
    onClose: function() {
      
    }    
  };
  for(key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
}
