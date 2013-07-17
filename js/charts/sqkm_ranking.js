loopa.charts.sqkm_ranking = function(opts) {
  var _self = {
    content_manager: null,
    container: null,
    svg: null,
    data: [],
    drawn: false,
    last_point: null,
    init: function() {
      this.initSvg();
      this.initChart();
    },
    initChart: function() {
      this.chart = nv.models.lineChart() 
                            .x(function(d,i) { return i; })
                            .y(function(d) { return d.income; });
      this.chart.tooltipContent(function(x,y,e,graph) {
        return '<h3>KM ' + graph.point.label + '</h3>' +
               '<p>$' +  graph.point.income.toMoney() + '</p>';
      });
      this.chart.xAxis.tickFormat(function(d){
        return "";
      }).staggerLabels(true);
      this.chart.yAxis.tickFormat(function(d){
        return d.toShortString();
      });
    },
    initSvg: function(){
      this.container.append('svg').style('height','275px');
      this.svg = this.container.selectAll('svg');
    },
    draw: function(id) {
      if(!_self.drawn) {
        _self.data = _self.content_manager.get();          
        nv.addGraph(function(){                
          _self.svg.datum(_self.data).transition().call(_self.chart);                  
          _self.drawCircle(id);
          return _self.chart;
        });        
        _self.drawn = true;
      }
      else {
        _self.drawCircle(id);
      }            
    },
    drawCircle: function(id) {
      var index = _self.getIndex(id);
      if(index >= 0) {     
        if(_self.last_point) {
          _self.last_point.classed('active',false);
        }     
        _self.last_point = _self.svg.select('.nv-point-' + index)
                  .classed('active',true);
      }
    },
    getIndex: function(id) {      
      var data = _self.data[0].values;             
      var index = -1;
      data.forEach(function(o, i){     
        if(+o.label == +id) {
          index = i;
          return index;
        }
      });
      return index;
    }
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
