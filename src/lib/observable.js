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
				var passing_arguments = Array.prototype.slice.call(arguments, 1);
				$.each(observers, function(i, observer) {
					observer.apply(null, passing_arguments);
				});
			}
		}
	}
};
