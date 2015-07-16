define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');
    var api = require('mixins/api');

    return function () {
        this.mixin([dispatcher, api]);

        this.setDefaults({
            waitFor: function(actions) {
                
                var self = this;
                var promise = $.Deferred();
                var promises = [];

                // Accept a single string as an action
                if (typeof actions === 'string') {
                    actions = [actions];
                }

                if (!$.isArray(actions)) {
                    throw new Error('WaitFor(actions) needs  an array of actions (or a single action)');
                }

                this.dispatch('waitFor:loading');

                _.each(actions, function(obj) {
                    //create a promise
                    var promise = $.Deferred();
                    promises.push(promise);

                    // a string will just listen for an event, an array will make an ajax request
                    if (typeof obj === 'string') {
                        //just an event
                        this.dispatcher.once(obj, function (payload) {
                            promise.resolve(payload);
                        });
                    } else {
                        //make and api call ********
                        var dataId = this.ajax($.extend(obj, { method: function(data){ 
                            console.log('ajax resolved');
                            promise.resolve(data); 
                        }}));

                        //or fails
                        this.dispatcher.once("api:" + dataId + ":failed", function (payload) {
                            promise.reject(payload);
                        });
                    }

                    // If it takes longer than 5 seconds and we don't get the
                    // ACTION_RECEIVED event, reject the promise.
                    //
                    // TODO: This is for when the ajax call hangs... think of a
                    // better way to capture and handle this
                    setTimeout(function() {
                        if (promise.state() !== "resolved") {
                            promise.reject();
                        }
                    }, 5000);

                    //??this.dispatch(obj.action, obj.payload, obj.cache);
                }, this);

                $.when.apply($, promises)
                    .done(function () {
                        promise.resolve(arguments);
                        self.dispatch('LOADED', self.name);
                    })
                    .fail(function () {
                        promise.reject(arguments);
                    });

                return promise;
            }
        });
    };
});
