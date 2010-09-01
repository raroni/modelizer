var Model = function(name, constructor) {
  var klass = function(attributes) {
    this.initiate(attributes);
    if(constructor) {
      constructor.call(this);
    }
    klass.insert(this);
  };
  klass.klass_name = name;
  $.extend(klass.prototype, Model.Base);
  $.extend(klass, Model.Collection);
  $.extend(klass, Model.Associations);
  
  window[name] = klass;
  return klass;
}
