define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	
	FluxMarionette.Router = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Router.call(this, options);
	};

	//mixin api dispatcher and wait for
	_.extend(FluxMarionette.Router.prototype, Backbone.Router.prototype, dispatcher, api, waitFor);
	FluxMarionette.Router.extend = Backbone.Router.extend;

});
