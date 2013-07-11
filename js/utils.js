Number.prototype.toMoney = function(c, d, t){
  var n = this, 
      c = isNaN(c = Math.abs(c)) ? 2 : c, 
      d = d == undefined ? "." : d, 
      t = t == undefined ? "," : t, 
      s = n < 0 ? "-" : "", 
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
      j = (j = i.length) > 3 ? j % 3 : 0;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Number.prototype.toShortString = function() {
  if(this >= 1000000000) {
    return this.toBillions();    
  }
  else if(this >= 1000000) {
    return this.toMillions();
  }
  else if(this >= 1000) {
    return this.toThousands();
  }
  else {
    return this.toFixed(1);
  }
};

Number.prototype.toMillions = function() {
  return (this / 1000000).toFixed(1) + 'M';
};

Number.prototype.toThousands = function() {
  return (this / 1000).toFixed(1) + 'K';
};

Number.prototype.toBillions = function() {
  return (this / 1000000000).toFixed(1) + 'B';
};
