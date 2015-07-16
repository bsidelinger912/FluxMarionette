define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	FluxMarionette.CollectionStore = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Model.call(this, options);
	};

	_.extend(FluxMarionette.CollectionStore.prototype, Backbone.Model.prototype, dispatcher, api, waitFor);

	FluxMarionette.CollectionStore.extend = Backbone.Model.extend;

});
