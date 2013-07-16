loopa.charts.product_income = function(opts) {
  var _self = {
    content_manager: null,
    container: null,
    svg: null,
    data: [],
    init: function() {
      this.initSvg();
      this.initChart();
    },
    initChart: function() {
      this.chart = nv.models.lineChart()
                              .x(function(d,i){ return i; })
                              .y(function(d){ return d.income; });

      this.chart.xAxis.tickFormat(function(d){
        return _self.data[0].values[d] && _self.data[0].values[d].label || "";
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
      _self.data = _self.content_manager.get(id);          
      nv.addGraph(function(){        
        _self.svg.datum(_self.data).transition().call(_self.chart);        
        return _self.chart;
      });
    }  
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
