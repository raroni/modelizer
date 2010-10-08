Modelizer.Base = {
  initiate: function(attributes) {
    this.updateAttributes(attributes);
  },
  updateAttributes: function(hash) {
    var self = this;
		$.each(hash, function(k, v) {
			self.setAttribute(k, v);
		});
  },
	update: function(attributes) {
    var self = this;
		self.changed_attributes = [];		
		$.each(attributes, function(k, v) {
  		if(v != self.get(k)) {
  		  self.changed_attributes.push(k);
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
		return this.changed_attributes && $.inArray(attribute, this.changed_attributes) != -1;
	},
	set: function(key, value) {
	  this.setAttribute(key, value);
    this.changed_attributes = [key];
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
