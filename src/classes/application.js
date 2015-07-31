define(function (require) {
	var Marionette = require('backbone.marionette');
	
	//mixins here
	var dispatcher = require('mixins/dispatcher'),
		api = require('mixins/api'),
		waitFor = require('mixins/waitFor'),
		dispatcherEvents = require('mixins/dispatcherEvents');

	//just adding the dispatcher for now
	var application = function(options) {
	    Marionette.Application.call(this, options);
	};
	_.extend(application.prototype, Marionette.Application.prototype, dispatcher, api, waitFor);
	application.extend = Marionette.Application.extend;  

	return application;
});
