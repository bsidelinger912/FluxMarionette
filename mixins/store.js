define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');
    var waitFor = require('mixins/waitFor');
    var api = require('mixins/api');

    return function () {
        this.mixin([dispatcher, api, waitFor]);

        this.setDefaults({
        	
        });

        this.before('initialize', function () {
        	//grab the dispatcher events
            _.each(this.dispatcherEvents, function(method, action) {
            	
                if (typeof self[method] !== "function" && typeof method !== "function") {
                    throw new Error('The ' + self.name + ' store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
                }

                var func = (typeof method === "function") ? method : self[method];
                
                this.listenTo(this.dispatcher, action, func);

            }, this);
        });

    };
});
