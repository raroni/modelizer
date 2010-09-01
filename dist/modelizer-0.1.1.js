var Observable = {
	subscribe: function(event, callback) {
		this.observers = this.observers || {};
		this.observers[event] = this.observers[event] || [];
		this.observers[event].push(callback);
	},
	unsubscribe: function(event, callback) {
		this.observers[event] = $.grep(this.observers[event], function(e) {
			return e != callback;
		});
	},
	notify: function() {
		if(this.observers) {
			var event = arguments[0];
			var observers = this.observers[event];
			if(observers) {
				var passing_arguments = this.argumentsToArray(arguments, 1);
				$.each(observers, function(i, observer) {
					observer.apply(null, passing_arguments);
				});
			}
		}
	},
	argumentsToArray: function(args, start_from) {
		var array = [];
		for(var i=(start_from || 0); args.length>i; i++) {
			array.push(args[i]);
		}
		return array;
	}
};
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
Model.Base = {
  initiate: function(attributes) {
    this.updateAttributes(attributes);
  },
  updateAttributes: function(hash) {
    var self = this;
		self.changed_attributes = [];
		$.each(hash, function(k, v) {
		  if(v != self.get(k)) {
			  self.changed_attributes.push(k);
			}
			self.set(k, v, { bulk_update: true });
		});
  },
	update: function(attributes) {
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
		return this.changed_attributes && $.inArray(attribute, this.changed_attributes) != -1;
	},
	set: function(key, value, options) {
	  options = options || {};
		this.attributes = this.attributes || {};
		this.attributes[key] = value;
		if(!options.bulk_update) {
			this.notifyUpdated();
		}
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
	}
};
Model.Collection = {
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
		if($.isArray(array_or_hash)) {
			this.createFromArray(array_or_hash);
		} else {
      new this(array_or_hash);
		}
	},
  clear: function() {
  		while(this.first()) {
        this.remove(this.first().get('id'));
  		}
		  this.notify('cleared');
  },
	createFromArray: function(array) {
		var self = this;
		$.each(array, function(i, v) {
			self.create(v);
		});
	},
	remove: function(id) {
		var instance = this.find(id);
		var index = this.all().indexOf(instance);
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
	where: function(conditions) {
		var self = this;
		return $.grep(this.all(), function(i) {
			return self.match(i, conditions);
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
$.extend(Model.Collection, Observable);
Model.Associations = (function() {
  var original_set = Model.Base.set;

  function initialize(klass) {
    klass.prototype.set = set;
  }
  
  function set() {
    var association = this.klass().findAssociation(arguments[0]);
    if(association) {
      if(arguments[1]) {
        association.build(arguments[1]);
      }
    } else {
      this.set = original_set;
      this.set.apply(this, arguments);
      this.set = set;
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
      this.addAssociation(new Model.Associations.BelongsTo(this, association_name));
      return this;
    },
    hasMany: function() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      var options = $.isPlainObject(args[args.length-1]) ? args.pop() : null;
      $.each(args, function(n, an) {
        self.addAssociation(new Model.Associations.HasMany(self, an, options));
      });
      return this;
    }
  }
})();
Model.Associations.BelongsTo = function(klass, association_name) {
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
    childClass().create(attributes);
  }
};
Model.Associations.HasMany = function(klass, association_name, options) {
  options = options || {};
  
  function childClass() {
    var klass_name = options.class_name || association_name.classify();
    return window[klass_name];
  }
  
  klass.prototype[association_name] = function() {
    var foreign_key = klass.klass_name.underscore() + '_id';
    var options = {}
    options[foreign_key] = this.get('id');
    return childClass().where(options);
  };
  
  this.name = function() {
    return association_name;
  }
  
  this.build = function(attributes) {
    childClass().create(attributes);
  }
};
