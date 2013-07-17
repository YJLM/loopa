loopa.content_managers.sqkm_ranking = function(opts) {
  var _self = {   
    values: [],
    load: function(data) {
      for(var key in data) {
        _self.values.push({
          label: key,
          income: +data[key].income
        });
      }
      _self.values.sort(function(a,b){
          if(a.income > b.income){ return -1; }
          else if(a.income < b.income) { return 1; }
          return 0;
      });
    },
    get: function() {
      return  [{
        key: 'Ranking',
        values: _self.values
      }];
    }
  };
  for(var key in opts) _self[key] = opts[key];
  return _self;
};
