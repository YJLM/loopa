loopa.content_managers.clients_map = function(opts) {
  var _self = {
    file: 'clients.csv',
    data: {},
    load: function() {
      d3.csv(loopa.data.getFilename(this.file), function(error, data){
        if(error){
        
        }
        else {
          data.forEach(function(row){
            _self.parseRow(row)          
          });
        }
      });
    },
    parseRow: function(row) {
      this.data[row.sqkm_id] = this.data[row.sqkm_id] || [];
      this.data[row.sqkm_id].push({
        latitude: row.latitude,
        longitude: row.longitude,
        name: row.client,
        income: +row.income
      });
    },
    get: function(id) {
      return _self.data[id];
    },
    reset: function() {
      this.data = {};
      this.load();
    }
  };
  for(var key in opts) _self[key] = opts[key];
  return _self;
};
