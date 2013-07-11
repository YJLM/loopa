var daily = function(opts) {
  var _self = {
    file: "data/per_day.csv",
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
        monday: this.getDayData(data, 'mo'),
        tuesday: this.getDayData(data, 'tu'),
        wednesday: this.getDayData(data, 'we'),
        thursday: this.getDayData(data, 'th'),
        friday: this.getDayData(data, 'fr'),
        saturday: this.getDayData(data, 'sa'),
        sunday: this.getDayData(data, 'su')
      };
    },
    getDayData: function(data, day) {
      var dayData = {
        income: +data[day + 'income'],
        clients: +data[day + 'clients']
      };
      return dayData;
    },
    get: function(id) {      
      return _self.data[id];
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
}
