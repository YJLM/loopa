var daily_parser = function(opts) {
  var _self = {    
    buildSqkm: function(data) {
      var sqkm = {
        monday: this.getDayData(data, 'mo'),
        tuesday: this.getDayData(data, 'tu'),
        wednesday: this.getDayData(data, 'we'),
        thursday: this.getDayData(data, 'th'),
        friday: this.getDayData(data, 'fr'),
        saturday: this.getDayData(data, 'sa'),
        sunday: this.getDayData(data, 'su')
      };
      return sqkm;
    },
    getDayData: function(data, day) {
      var dayData = {
        income: +data[day + 'income'],
        clients: +data[day + 'clients']
      };
      return dayData;
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
}
