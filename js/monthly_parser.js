var monthly_parser = function(opts) {
  var _self = {    
    months: [
      'january','february','march','april','may',
      'june','july','august',
      'september','october','november','december'
    ],
    buildSqkm: function(data) {
      var sqkm = {};
      this.months.forEach(function(month){
        sqkm[month] = _self.getMonthData(data, month); 
      });
      return sqkm;
    },
    getMonthData: function(data, month) {
      var monthData = {
        income: +data['income-' + month],
        clients: +data['clients-' + month],
        orders: +data['orders-' + month]
      };
      return monthData;
    }
  };
  for(key in opts) _self[key] = opts[key];
  return _self;
};
