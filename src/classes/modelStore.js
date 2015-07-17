define(function (require) {
	//mixins
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	//the class
	var modelStore = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Model.call(this, options);
	};

	_.extend(modelStore.prototype, Backbone.Model.prototype, dispatcher, api, waitFor);

	modelStore.extend = Backbone.Model.extend;

	return modelStore;
});
