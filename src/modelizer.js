var Modelizer = function(name, constructor) {
  var klass = function(attributes) {
    if(attributes.id && klass.exists(attributes.id)) {
      throw('Cannot create two models with the same ID.');
    }
    
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
