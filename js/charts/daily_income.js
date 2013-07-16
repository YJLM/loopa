loopa.charts.daily_income = function(opts) {
  var _self = {
    content_manager: null,
    container: null,
    svg: null,
    days: [
      'Monday','Tuesday',
      'Wednesday','Thursday',
      'Friday','Saturday','Sunday'
    ],
    init: function() {
      this.initSvg();
      this.initChart();
    },
    initChart: function() {
      this.chart = nv.models.lineChart()
                              .x(function(d){ return d.day; })
                              .y(function(d){ return d.income; });

      this.chart.xAxis.axisLabel("Day").tickFormat(function(d){
        return _self.days[d];
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
    }
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
