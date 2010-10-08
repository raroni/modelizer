Modelizer.Associations.Base = {
  apply: function(attributes) {
    var existing_instance;
    if(attributes.id) {
      existing_instance = this.childClass().find(attributes.id);
    }
    if(existing_instance) {
      delete attributes.id;
      existing_instance.update(attributes);
    } else {
      this.childClass().create(attributes);
    }
  }
};
