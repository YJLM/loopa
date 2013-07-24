loopa.content_managers.monthly_income = function(opts) {
  var _self = {
    file: "per_month.csv",
    avg_key: 'AVERAGE',
    months: [
      'january','february','march','april','may',
      'june','july','august',
      'september','october','november','december'
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
        values: this.getMonthValues(row)
      };      
      return obj;      
    },
    getMonthValues: function(row) {
      var values = [];
      this.months.forEach(function(month,index){
        values.push({
          month: index,
          income: +row['income-' + month] || 0
        });
      });
      return values;
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
