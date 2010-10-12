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
				var passing_arguments = Array.prototype.slice.call(arguments, 1)
				jQuery.each(observers, function(i, observer) {
					observer.apply(null, passing_arguments);
				});
			}
		}
	},
	bubble: function() {
		var self = this;
		var observable = arguments[0];
		jQuery.each(Array.prototype.slice.call(arguments, 1), function(index, event) {
			observable.subscribe(event, function() {
				var args_array = Array.prototype.slice.call(arguments);
				args_array.unshift(event);
				self.notify.apply(self, args_array);
			});
		});
	}
};
