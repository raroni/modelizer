Modelizer.Associations.Base = {
  createOrUpdate: function(attributes) {
    this.childClass().createOrUpdate(attributes);
  }
};
