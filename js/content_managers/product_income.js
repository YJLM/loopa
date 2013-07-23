loopa.content_managers.product_income = function(opts) {
  var _self = {
    file: 'product_income.csv',
    avg_key: "AVERAGE",
    data: {},
    load: function() {
      d3.csv(loopa.data.getFilename(this.file), function(error, data){
        if(error){
        
        }
        else {
          data.forEach(function(row){
            _self.data[row.id] = _self.parseRow(row)          
          });
        }
      });
    },
    parseRow: function(row) {
      var obj = { key: row.id, values: [] };
      delete row.id;
      for(var date in row) {
        obj.values.push({
          label: date,
          income: +row[date]
        });
      }
      return obj;
    },
    get: function(id) {
      return [_self.data[_self.avg_key], _self.data[id]];
    }
  };
  for(var key in opts) _self[key] = opts[key];
  return _self;
};
