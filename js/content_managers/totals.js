var totals = function(opts) {
  var _self = {
    file: "data/totals.csv",
    data: {},
    load: function() {
      d3.csv(_self.file, function(error,data) {
        if(error) {
            
        }
        else {
          data.forEach(function(row){
            _self.data[row.id] = _self.parseRow(row);
          });
        }
      });
    },
    parseRow: function(row) {
      return {
        income: row.income,
        clients: row.clients
      };
    },
    get: function(id) {      
      return _self.data[id];
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
}