define(function (require) {
    "use strict";

    //this needs api and dispatcher
    return {
        waitFor: function(actions) {
            
            var self = this;
            var promise = $.Deferred();
            var promises = [];

            // Accept a single string, or single object as an action
            if (typeof actions === 'string' || (typeof actions ==="object" && !$.isArray(actions)) {
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
                    //save the orig callback
                    if(obj.method){
                        var callback = (typeof obj.method === "function") ? obj.method : self[obj.method];

                        //error handling
                        if(typeof callback !== "function") throw new Error('method ' + obj.method + ' is not defined');
                    } 

                    //make and api call ********
                    var dataId = this.ajax($.extend(obj, { method: function(data){ 
                        //call the original method and resolve the promise
                        callback && callback.call(self, data);
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

            }, this);

            $.when.apply($, promises)
                .done(function () {
                    //defer, so all necessary setting can be done
                    var args = arguments;
                    setTimeout(function(){
                        promise.resolve(args);
                        self.dispatch('LOADED', self.name);
                    }, 0);
                })
                .fail(function () {
                    promise.reject(arguments);
                });

            return promise;
        }
    };
});
