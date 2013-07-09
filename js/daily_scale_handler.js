var daily_scale_handler = function(opts) {
  var _self = {
    range: [],
    scale_container: null, 
    scale_ranges: {},
    scale: null,
    ranges: {},
    days: [
      { range_key: 'monday', data_key: 'm' },
      { range_key: 'tuesday', data_key: 't' },
      { range_key: 'wednesday', data_key: 'w' },
      { range_key: 'thursday', data_key: 'r' },
      { range_key: 'friday', data_key: 'f' },
      { range_key: 'saturday', data_key: 's' },
      { range_key: 'sunday', data_key: 'd' }
    ],
    view_keys: ['orders','income','clients'],    
    init: function(data, day, view) {
      this.scale = d3.scale.quantize();
      this.initScaleRanges(data);
      this.update(day, view);
    },
    initScaleRanges: function(data) {
      _self.days.forEach(function(day){
        _self.scale_ranges[day.range_key] = {};        
        _self.view_keys.forEach(function(view){
          _self.scale_ranges[day.range_key][view] = {
            min: d3.min(data, function(d) { return +d[day.data_key + view]; }),
            max: d3.max(data, function(d) { return +d[day.data_key + view]; })
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
        steps.push(bottom + '-' + top);
      }
      return steps;
    },
    setRange: function(range) {
      this.range = range;
      this.updateScaleSteps();                
    },
    update: function(day, view) {
      var min = this.scale_ranges[day][view].min,
          max = this.scale_ranges[day][view].max;
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
