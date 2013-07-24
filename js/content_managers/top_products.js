loopa.content_managers.top_products = function(opts) {
  var _self = {
    file: "top_products.csv",
    data: {},
    get: function(id) {
      categories = _self.data[id];
      if(categories) {
        return [{
          key: "Top Products",
          values: this.getValues(categories)
        }];
      }
      else {
        return [];
      }      
    },
    getValues: function(categories) {
      values = [];
      for(var key in categories) {
        values.push({ 
          category: key, 
          product_count: categories[key].products.length, 
          products: categories[key].products 
        });
      }
      return values;
    },
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
      var categories = {};
      delete row.id;
      var product_id = null;
      for(var key in row) {                
        var new_product_id = +key.split("_")[1];
        if(product_id != new_product_id) {
          var product_id = new_product_id;
          var product_name = row['article_' + product_id];
          
          if(product_name !== "" && product_name !== null) {
            var category = row['category_' + product_id];
            categories[category] = categories[category] || { income: 0, percentage: 0, products: [] };
            categories[category].income += row['income_' + product_id];
            categories[category].percentage += row['percentage_' + product_id];
            categories[category].products.push({
              name: product_name,
              income: +row['income_' + product_id],
              percentage: +row['percentage_' + product_id]
            });
          }
        }
                
      }
      if(loopa.utils.isEmpty(categories)) {
        categories = null;
      }
      return categories;
    },
    reset: function() {
      this.data = {};
      this.load();
    }
  };
  for(var key in opts) _self[key] = opts[key];
  return _self;  
};
