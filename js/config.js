var config =  {
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
    ]
  }
}
