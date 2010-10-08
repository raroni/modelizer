var Modelizer = function(name, constructor) {
  var klass = function(attributes) {
    this.initiate(attributes);
    if(constructor) {
      constructor.call(this);
    }
    klass.insert(this);
  };
  klass.klass_name = name;
  $.extend(klass.prototype, Modelizer.Base);
  $.extend(klass, Modelizer.Collection);
  $.extend(klass, Modelizer.Associations);
  
  window[name] = klass;
  return klass;
}
