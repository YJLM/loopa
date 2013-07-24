loopa.content_managers.sqkm_ranking = function(opts) {
  var _self = {   
    file: "totals.csv",
    values: [],
    load: function(data) {
      d3.csv(loopa.data.getFilename(_self.file), function(error,data) {
        if(error) {
            
        }
        else {         
          data.forEach(function(row){
            _self.parseRow(row);
          });          
          
          _self.values.sort(function(a,b){
              if(a.income > b.income){ return -1; }
              else if(a.income < b.income) { return 1; }
              return 0;
          });
        }
      });
    },
    parseRow: function(row) {
      _self.values.push({
        label: row.id,
        income: +row.income
      });
    },
    get: function() {
      return  [{
        key: 'Ranking',
        values: _self.values
      }];
    },
    reset: function() {
      this.values = [];
      this.load();
    }
  };
  for(var key in opts) _self[key] = opts[key];
  return _self;
};
