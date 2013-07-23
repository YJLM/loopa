var loopa = {
  views: {},
  charts: {},
  content_managers: {},
  maps: {},
  widgets: {},
  company_id: null,
  utils: {
    isEmpty: function(obj) {
      for(var name in obj) return false;
      return true;
    }
  },
  data: {
    getFilename: function(filename) {
      return 'data/' + loopa.company_id + '/' + filename;
    }
  },
  config: {
    cloudmade: {
      endpoint: "http://{s}.tile.cloudmade.com",
      api_key: "82657b936bb44375b3e137120221986d",
      style_id: 86873,
      tile_size: 256,
      layer_url: function() {
        return this.endpoint + '/' + this.api_key + '/' + this.style_id + '/' + this.tile_size + "/{z}/{x}/{y}.png";
      }
    },
    colour_ranges: {
      clients: [
        'rgb(255, 255, 212)', 'rgb(254, 217, 142)', 
        'rgb(254, 153, 41)', 'rgb(217, 95, 14)', 
        'rgb(153, 52, 4)'
      ],
      income: [
        'rgb(237, 248, 233)', 'rgb(186, 228, 179)', 
        'rgb(116, 196, 118)', 'rgb(49, 163, 84)', 
        'rgb(0, 109, 44)'
      ],
      orders: [
        "rgb(239, 243, 255)", "rgb(189, 215, 231)", 
        "rgb(107, 174, 214)", "rgb(49, 130, 189)", 
        "rgb(8, 81, 156)"
      ]
    }
  }
};
