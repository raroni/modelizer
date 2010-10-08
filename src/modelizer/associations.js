Modelizer.Associations = (function() {
  var original_set = Modelizer.Base.setAttribute;

  function initialize(klass) {
    klass.prototype.setAttribute = setAttribute;
  }
  
  function setAttribute() {
    var association = this.klass().findAssociation(arguments[0]);
    if(association) {
      if(arguments[1]) {
        association.apply(arguments[1]);
      }
    } else {
      this.setAttribute = original_set;
      this.setAttribute.apply(this, arguments);
      this.setAttribute = setAttribute;
    }
  }
  
  function findAssociation(model, key) {
    return $.grep(model.klass().associations(), function(a) {
      return a.name() == key;
    })[0];
  }
  
  return {
    findAssociation: function(name) {
      return this.associations()[name];
    },
    addAssociation: function(association) {
      this.associations()[association.name()] = association;
    },
    associations: function() {
      if(!this._associations) {
        initialize(this);
        this._associations = {};
      }
      return this._associations;
    },
    belongsTo: function(association_name) {
      this.addAssociation(new Modelizer.Associations.BelongsTo(this, association_name));
      return this;
    },
    hasMany: function() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      var options = $.isPlainObject(args[args.length-1]) ? args.pop() : null;
      $.each(args, function(n, an) {
        self.addAssociation(new Modelizer.Associations.HasMany(self, an, options));
      });
      return this;
    }
  }
})();
