define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	//the class
	var collectionStore = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Model.call(this, options);
	};

	_.extend(collectionStore.prototype, Backbone.Model.prototype, dispatcher, api, waitFor);

	collectionStore.extend = Backbone.Model.extend;

	return collectionStore;
});
