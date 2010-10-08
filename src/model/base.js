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
