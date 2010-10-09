var Modelizer = function(name, constructor) {
  var klass = function(attributes) {
    if(attributes.id && klass.exists(attributes.id)) {
      throw('Cannot create two models with the same ID. (' + name + ', ' + attributes.id + ')');
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
Modelizer.Base = {
  initiate: function(attributes) {
    this.updateAttributes(attributes);
    
    var self = this;
    this.resetChangedAttributes();
    $.each(attributes, function(k) {
      self.addChangedAttribute(k);
    });
  },
  resetChangedAttributes: function() {
    this.changed_attributes = [];
  },
  addChangedAttribute: function(key) {
    this.changed_attributes.push(key);
  },
  updateAttributes: function(hash) {
    var self = this;
		$.each(hash, function(k, v) {
			self.setAttribute(k, v);
		});
  },
	update: function(attributes) {
    this.resetChangedAttributes();
    
    var self = this;
		$.each(attributes, function(k, v) {
  		if(v != self.get(k)) {
  		  self.addChangedAttribute(k);
  		}
  	});
  	
		this.updateAttributes(attributes);
		
		this.notifyUpdated();
	},
	notifyUpdated: function() {
	  this.constructor.notify('update', this);
		if(this.notify) {
			this.notify('updated');
		}
	},
	changed: function(attribute) {
		if(this.changed_attributes && $.inArray(attribute, this.changed_attributes) != -1) {
		  return true;
		} else {
		  return false;
		}
	},
	set: function(key, value) {
	  this.setAttribute(key, value);
	  
    this.resetChangedAttributes();
    this.addChangedAttribute(key);
    
		this.notifyUpdated();
	},
	setAttribute: function(key, value) {
		this.attributes = this.attributes || {};
		this.attributes[key] = value;
	},
	get: function(key) {
		if(this.attributes) {
			return this.attributes[key];
		}
	},
	decrement: function(key) {
	  this.set(key, this.get(key)-1);
	},
	increment: function(key) {
	  this.set(key, this.get(key)+1);	  
	},
	isA: function(klass) {
		return this instanceof klass;
	},
	klass: function() {
		return this.constructor;
	},
	remove: function() {
	  this.klass().remove(this);
	}
};
Modelizer.Collection = {
	insert: function(instance) {
	  if(instance.get('id') && this.exists(instance.get('id'))) {
	    var existing_instance = this.find(instance.get('id'));
	    existing_instance.update(instance.attributes);
	  } else {
      this.all().push(instance);
      this.notify('insert', instance);
		}
	},
	create: function(array_or_hash) {
	  var method_ext = $.isArray(array_or_hash) ? 'Many' : 'One';
	  this['create' + method_ext](array_or_hash);
	},
	createOne: function(hash) {
	  new this(hash);
	},
	createMany: function(array) {
		var self = this;
		$.each(array, function(i, v) {
			self.create(v);
		});
	},
  clear: function() {
  		while(this.first()) {
        this.remove(this.first().get('id'));
  		}
		  this.notify('cleared');
  },
	remove: function(instance) {
		var index = $.inArray(instance, this.all());
		this.all().splice(index, 1);
		this.notify('remove', instance);
	},
	find: function(id) {
		return this.first({ 'id': id });
	},
	all: function() {
		this.instances = this.instances || [];
		return this.instances;
	},
	exists: function(id) {
	  return !!this.find(id);
	},
	count: function() {
	  return this.all().length;
	},
	first: function(conditions) {
		var self = this;
		var instance;
		$.each(this.all(), function(n, i) {
		  if(!conditions) {
		    instance = self.all()[0];
		    return false;
		  }
		  
			if(self.match(i, conditions)) {
				instance = i;
				return false;
			};
		});
		return instance;
	},
	last: function(conditions) {
		var elms;
		if(conditions == null) {
			elms = this.all();
		} else {
			elms = this.where(conditions);
		}
		return elms[elms.length - 1];
	},
	where: function(conditions) {
		var self = this;
		return $.grep(this.all(), function(i) {
			return self.match(i, conditions);
		});
	},
	createOrUpdate: function(array_or_hash) {
	  var method_ext = $.isArray(array_or_hash) ? 'Many' : 'One';
	  this['createOrUpdate' + method_ext](array_or_hash);
	},
	createOrUpdateOne: function(attributes) {
    var existing_instance;
    if(attributes.id) {
      existing_instance = this.find(attributes.id);
    }
    if(existing_instance) {
      delete attributes.id;
      existing_instance.update(attributes);
    } else {
      // new this(attributes);
      this.create(attributes);
    }
	},
	createOrUpdateMany: function(array) {
		var self = this;
		$.each(array, function(i, v) {
			self.createOrUpdate(v);
		});
	},
	match: function(instance, conditions) {
		var match = true;
		$.each(conditions, function(key, value) {
			if(instance.get(key) != value) {
				match = false;
				return false;
			}
		});
		return match;
	}
};
$.extend(Modelizer.Collection, Observable);
Modelizer.Associations = (function() {
  var original_set = Modelizer.Base.setAttribute;

  function initialize(klass) {
    klass.prototype.setAttribute = setAttribute;
  }
  
  function setAttribute() {
    var association = this.klass().findAssociation(arguments[0]);
    if(association) {
      if(arguments[1]) {
        association.createOrUpdate(arguments[1]);
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
Modelizer.Associations.Base = {
  createOrUpdate: function(attributes) {
    this.childClass().createOrUpdate(attributes);
  }
};
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
Modelizer.Associations.HasMany = function(klass, association_name, options) {
  var self = this;
  options = options || {};
  
  this.childClass = function() {
    var klass_name = options.class_name || association_name.classify();
    return window[klass_name];
  };
  
  klass.prototype[association_name] = function() {
    var foreign_key = klass.klass_name.underscore() + '_id';
    var options = {}
    options[foreign_key] = this.get('id');
    return self.childClass().where(options);
  };
  
  this.name = function() {
    return association_name;
  };
};
$.extend(Modelizer.Associations.HasMany.prototype, Modelizer.Associations.Base);
