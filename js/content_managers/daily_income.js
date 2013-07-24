loopa.content_managers.daily_income = function(opts) {
  var _self = {
    file: "per_day.csv",
    avg_key: 'AVERAGE',
    days: [
      {data_key: 'mo', day_value: 0},
      {data_key: 'tu', day_value: 1},
      {data_key: 'we', day_value: 2},
      {data_key: 'th', day_value: 3},
      {data_key: 'fr', day_value: 4},
      {data_key: 'sa', day_value: 5},
      {data_key: 'su', day_value: 6}
    ],
    data: {},
    load: function() {
      d3.csv(loopa.data.getFilename(_self.file), function(error,data) {
        if(error) {
            
        }
        else {
          data.forEach(function(row){
            _self.data[row.id] = _self.parseRow(row);
          });
          _self.data[_self.avg_key].key = "AVERAGE";
        }
      });
    },
    parseRow: function(row) {
      obj = {
        key: 'KM ' + row.id,
        values: this.getDayValues(row)
      };      
      return obj;      
    },
    getDayValues: function(row) {
      var values = [];
      this.days.forEach(function(hash){
        values.push({
          day: hash.day_value,
          income: +row[hash.data_key + 'income']
        });
      });
      return values;
    },
    getValues: function(object){
      
    },
    get: function(id) {            
      return [_self.data[id], _self.data[_self.avg_key]];
    },
    reset: function() {
      this.data = {};
      this.load();
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
};
