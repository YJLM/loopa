var daily_parser = function(opts) {
  var _self = {    
    buildSqkm: function(data) {
      var sqkm = {
        monday: this.getDayData(data, 'm', 'monday'),
        tuesday: this.getDayData(data, 't', 'tuesday')
      };
      return sqkm;
    },
    getDayData: function(data, day, scale_key) {
      var dayData = {
        income: +data[day + 'income'],
        clients: +data[day + 'clients'],
        orders: +data[day + 'orders'],
        top_clients: [
          data[day + 'client1'],
          data[day + 'client2'],
          data[day + 'client3']
        ]
      };
      return dayData;
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
}
