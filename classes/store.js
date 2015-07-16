define(function (require) {
	//mixins
	var dispatcher = require('mixins/dispatcher');
	var api = require('mixins/api');
	var waitFor = require('mixins/waitFor');

	FluxMarionette.Store = function(options) {
		//listen to dispatcher events
		if(this.dispatcherEvents){
			_.each(this.dispatcherEvents, function(method, action) {
	            if (typeof this[method] !== "function" && typeof method !== "function") {
	                throw new Error('The store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
	            }

	            var func = (typeof method === "function") ? method : this[method];
	            
	            this.listenTo(this.dispatcher, action, func);

	        }, this);
		}

	    Backbone.Model.call(this, options);
	};

	_.extend(FluxMarionette.Store.prototype, Backbone.Model.prototype, dispatcher, api, waitFor);

	FluxMarionette.Store.extend = Backbone.Model.extend;

});
