define(function (require) {
	//mixins here
	var dispatcher = require('mixins/dispatcher');

	//just adding the dispatcher for now
	var application = function(options) {
	    Marionette.Application.call(this, options);
	};
	_.extend(application.prototype, Marionette.Application.prototype, dispatcher);
	application.extend = Marionette.Application.extend;  

	return application;
});
