define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents'),
		apiController = require('classes/apiController');

	//the class
	var collectionStore = function(options) {
		//set up listeners for dispatcher events
		dispatcherEvents.call(this);

	    Backbone.Collection.call(this, options);
	};

	_.extend(collectionStore.prototype, Backbone.Collection.prototype, dispatcher, api, waitFor, { getEndpoint: apiController.getEndpoint.bind(apiController) });

	collectionStore.extend = Backbone.Collection.extend;

	return collectionStore;
});
