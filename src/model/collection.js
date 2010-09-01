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
