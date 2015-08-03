define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents'),
		endpointMethods = require('mixins/endpointMethods');

	
	var router = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Router.call(this, options);
	};

	//mixin api dispatcher and wait for
	_.extend(router.prototype, Backbone.Router.prototype, dispatcher, api, waitFor, endpointMethods);
	router.extend = Backbone.Router.extend;

	return router;
});
