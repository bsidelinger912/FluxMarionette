define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');

    return function () {
        this.mixin([dispatcher]);

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
                    throw new Error('In ' + this.name + ', waitFor() needs to be an array of actions (or a single action)');
                }

                this.dispatch('LOADING', this.name);

                _.each(actions, function(obj) {

                    // Accept an array full of actions as a string, or objects
                    if (typeof obj === 'string') {
                        obj = { action: obj, payload: null, cache: null } ;
                    }

                    var promise = $.Deferred();
                    promises.push(promise);

                    // Listen for ACTION_RECEIVED events - this is purely
                    // convention that comes out of the dispatch() method. Any
                    // REQUESTED event will return a RECEIVED event upon
                    // completion of the ajax call
                    dispatcher.once(obj.action.replace('_REQUESTED', '_RECEIVED'), function(payload) {
                        promise.resolve(payload);
                    });

                    dispatcher.once(obj.action.replace('_REQUESTED', '_FAILED'), function (payload) {
                        promise.reject(payload);
                    });

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

                    self.dispatch(obj.action, obj.payload, obj.cache);
                });

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
