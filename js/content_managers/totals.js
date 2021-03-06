loopa.content_managers.totals = function(opts) {
  var _self = {
    file: "totals.csv",
    data: {},
    load: function(callback) {
      d3.csv(loopa.data.getFilename(_self.file), function(error,data) {
        if(error) {
            
        }
        else {
          data.forEach(function(row){
            _self.data[row.id] = _self.parseRow(row);
          });
          if(callback) callback(_self.data); 
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
    },
    reset: function() {
      this.data = {};
      this.load();
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
};
