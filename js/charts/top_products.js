loopa.charts.top_products = function(opts) {
  var _self = {
    content_manager: null,
    container: null,
    list_container: null,
    list_wrapper: null,
    list_title: null,
    view_stack: [],
    svg: null,
    product_chart: null,
    init: function() {
      this.initChart();      
      this.initSvg();
      this.initListContainer();
      this.initProductChartContainer();
    },
    initProductChartContainer: function() {
      this.chart_container = this.container.append('div')
                                           .attr('class','chart-view');
      var header = this.chart_container.append('div');
      header.append('div')
            .attr('class','right')                                           
            .append('a')
            .attr('href','#')
            .text('x')
            .on('click',function(){
              d3.event.preventDefault();
              _self.popView();
              d3.event.stopPropagation();              
            });
      var cm = loopa.content_managers.product_income();
      cm.load();
      this.product_chart = loopa.charts.product_income({
        content_manager: cm,
        container: this.chart_container
      });
    },
    initChart: function() {
      this.chart = nv.models.pieChart()
                              .x(function(d){ return d.category + ' products'; })
                              .y(function(d){ return d.product_count; })
                              .showLabels(false);
      this.chart.pie.dispatch.on('elementClick', function(data){
        _self.onCategoryClicked(data);
      });
      
    },
    onCategoryClicked: function(data) {
      this.list_title.text(data.label);
      this.updateProductsList(data.point.products);
      this.pushView(this.list_wrapper);      
    },    
    onProductClicked: function(trigger) {
      _self.pushView(_self.chart_container);
      _self.product_chart.draw(trigger.attr('data-product'));
    },
    updateProductsList: function(products) {
      var markup= '<table class="custom-table">';
        markup += '<thead>';
          markup += '<tr>';
            markup += '<th>Name</th><th>Income</th><th>Income Percentage</th>';
          markup += '</tr>';
        markup += '</thead>';
        markup += '<tbody>';
          products.forEach(function(product){
            markup += '<tr>';
              markup += '<td> <a href="#" class="blue product" data-product="' + product.name + '">' + product.name +'</a> </td>';
              markup += '<td> $' + product.income.toMoney() +'</td>';
              markup += '<td>' + d3.format('.2%')(product.percentage) +'</td>';
            markup += '</tr>';          
          });
        markup += '</tbody>';
      markup += '</table>';
      this.list_container.html(markup);
      this.list_container.selectAll('a.product')
                          .on('click', function(){
                            d3.event.stopPropagation();
                            _self.onProductClicked(d3.select(this));
                          });    
    },
    
    initSvg: function(){
      var svg_container = this.container.append('div')
                    .attr('class','chart-view');
      svg_container.append('svg');
      this.svg = svg_container.selectAll('svg');
      this.pushView(svg_container);      
    },
    initListContainer: function() {
      this.list_wrapper = this.container.append('div').attr('class','chart-view');      
      var header = this.list_wrapper.append('div');
      this.list_title = header.append('div').attr('class','left blue').append('h3');
      var right = header.append('div').attr('class', 'right');
      right.append('a').attr('href','#').text('x').on('click', function(){
        d3.event.stopPropagation();       
        _self.popView();
      });
      header.append('div').attr('class', 'clear');
      this.list_container = this.list_wrapper.append('div').attr('class','table-wrapper products-table scroll');
    },
    draw: function(id) {
      var data = _self.content_manager.get(id);          
      if(data.length == 0) {
        _self.svg.select('g.nv-pieChart').remove();
      }
      nv.addGraph(function(){                
        _self.svg.datum(data).transition().call(_self.chart);        
        _self.clearViewStack();
        return _self.chart;
      });
    },
    clearViewStack: function() {
      while(this.view_stack.length > 1) {  
        _self.popView();
      }
    },
    pushView: function(container) {
      var last = this.view_stack.slice(-1)[0];
      if(last) {
        last.classed('active',false);
      }
      container.classed('active',true);
      this.view_stack.push(container);
    },    
    popView: function() {
      var old_view = this.view_stack.pop();
      old_view.classed('active',false);
      this.view_stack.slice(-1)[0].classed('active',true);
    }
  };
  for(var key in opts) _self[key] = opts[key];
  _self.init();
  return _self;
};
