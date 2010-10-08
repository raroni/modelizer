Modelizer.Associations.BelongsTo = function(klass, association_name) {
  function childClass() {
    return window[association_name.camelize()];
  }
  
  klass.prototype[association_name] = function() {
    var foreign_key = association_name + '_id';
    return childClass().find(this.get(foreign_key));
  };
  
  this.name = function() {
    return association_name;
  }
  
  this.build = function(attributes) {
    var existing_instance;
    if(attributes.id) {
      existing_instance = childClass().find(attributes.id);
    }
    if(existing_instance) {
      delete attributes.id;
      existing_instance.update(attributes);
    } else {
      childClass().create(attributes);
    }
  }
};
