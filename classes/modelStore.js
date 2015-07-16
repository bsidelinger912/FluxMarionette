define(function (require) {
	//mixins
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	FluxMarionette.ModelStore = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Model.call(this, options);
	};

	_.extend(FluxMarionette.ModelStore.prototype, Backbone.Model.prototype, dispatcher, api, waitFor);

	FluxMarionette.ModelStore.extend = Backbone.Model.extend;

});
