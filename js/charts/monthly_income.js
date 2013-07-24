loopa.charts.monthly_income = function(opts) {
  var _self = {
    content_manager: null,
    container: null,
    svg: null,
    months: [
      'January','February','March','April','May',
      'June','July','August',
      'September','October','November','December'
    ],
    init: function() {
      this.initSvg();
      this.initChart();
    },
    initChart: function() {
      this.chart = nv.models.lineChart()
                              .x(function(d,i){ return d.month; })
                              .y(function(d){ return d.income; });

      this.chart.xAxis.axisLabel("Month").tickFormat(function(d){
        return _self.months[d];
      });
      this.chart.yAxis.tickFormat(function(d){
        return '$' + d.toShortString();
      });
    },
    initSvg: function(){
      this.container.append('svg');
      this.svg = this.container.selectAll('svg');
    },
    draw: function(id) {
      var data = _self.content_manager.get(id);          
      nv.addGraph(function(){          
        _self.svg.datum(data).transition().call(_self.chart);        
        return _self.chart;
      });
    },
    reset: function() {
      this.content_manager.reset();
    }
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
