var monthly_scale_handler = function(opts) {
  var _self = {
    range: [],
    scale_container: null, 
    scale_ranges: {},
    scale: null,
    ranges: {},
    months: [
      'january','february','march','april','may',
      'june','july','august',
      'september','october','november','december'
    ],
    view_keys: ['income','clients','orders'],    
    init: function(data, month, view) {
      this.scale = d3.scale.quantize();
      this.initScaleRanges(data);
      this.update(month, view);
    },
    initScaleRanges: function(data) {
      _self.months.forEach(function(month){
        _self.scale_ranges[month] = {};        
        _self.view_keys.forEach(function(view){
          _self.scale_ranges[month][view] = {
            min: d3.min(data, function(d) { return +d[view + '-' + month]; }),
            max: d3.max(data, function(d) { return +d[view + '-' + month]; })
          };
        });
      });      
    },  
    getScaleSteps: function(min, max) {
      var range_length = this.scale.range().length;
      var step = (max - min) / range_length;
      var steps = [];
      for(var i = 0; i < range_length; ++i) {
        var bottom = Math.round(i*step);
        var top = Math.round(bottom + step - 1);      
        steps.push(bottom.toShortString() + '-' + top.toShortString());
      }
      return steps;
    },
    setRange: function(range) {
      this.range = range;
      this.updateScaleSteps();                
    },
    update: function(month, view) {
      var min = this.scale_ranges[month][view].min,
          max = this.scale_ranges[month][view].max;
      this.scale.range(this.ranges[view])
                .domain([min, max]);
      this.updateScaleSteps(min, max);
    },
    updateScaleSteps: function(min, max) {
      var step_values = this.getScaleSteps(min, max);        
      var steps = this.scale_container.selectAll("div.scale-step")
                    .data(this.scale.range());
      steps.enter()
            .append("div")
            .classed('scale-step',true);

      steps
        .html(function(d,i){ return '<span>' + step_values[i] + '</span>'; })
        .transition()
        .style('background-color',function(d){ return d; });

    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
};
