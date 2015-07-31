define(function (require) {
	var Marionette = require('backbone.marionette');

	//mixins
	var dispatcher = require('mixins/dispatcher');
	var api = require('mixins/api');

	apiController = function(options) {
	    Marionette.Object.call(this, options);
	};

	_.extend(apiController.prototype, Marionette.Object.prototype, dispatcher, api, {
		//gets the object that we send to the api methods
		getEndpoint: function(endpointName, payload, callback){
			//grab the config
			var self = this,
				endpoint = this[endpointName];

			if(!endpoint) throw new Error('The endpoint specified does not exist in this API Controller.');

			//two types of callbacks, a function, and an event
			if(typeof callback === "function"){
				//just passing a function in
				endpoint.method = callback;
			} else if(typeof callback === "string"){
				//for passing event names for the callback
				endpoint.method = function(data){
					self.dispatch(callback, data);
				};
			}

			if(payload) endpoint.payload = payload;

			return endpoint;
		},

		//calls the api methods with the endpoint logic
		callEndpoint: function(endpointName, payload, callback){
			return this.ajax(this.getEndpoint(endpointName, payload, callback));
		}
	});

	apiController.extend = Marionette.Object.extend;

	return new apiController();
});