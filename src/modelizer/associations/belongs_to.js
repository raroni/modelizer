Modelizer.Associations.BelongsTo = function(klass, association_name) {
  var self = this;
  this.childClass = function() {
    return window[association_name.camelize()];
  };
  
  klass.prototype[association_name] = function() {
    var foreign_key = association_name + '_id';
    return self.childClass().find(this.get(foreign_key));
  };
  
  this.name = function() {
    return association_name;
  }
};
$.extend(Modelizer.Associations.BelongsTo.prototype, Modelizer.Associations.Base);
