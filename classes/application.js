define(function (require) {
	//mixins here
	var dispatcher = require('mixins/dispatcher');

	//just adding the dispatcher for now
	FluxMarionette.Application = function(options) {
	    Marionette.Application.call(this, options);
	};
	_.extend(FluxMarionette.Application.prototype, Marionette.Application.prototype, dispatcher);
	FluxMarionette.Application.extend = Marionette.Application.extend;
});
