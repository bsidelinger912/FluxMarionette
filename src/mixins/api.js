define(function (require) {
    "use strict";

    //deps
    require('lib/md5');

    //this request method is how we get data from the API, it needs the dispatcher to be mixed in already
    return {
        dataId: function(url, type, payload){
            //we need these two
            if(!url || !type) throw new Error('must pass url and verb to the api functions');

            //might not be a payload
            payload = (typeof payload === "object") ? payload : {};

            return md5(url + type + JSON.stringify(payload));
        },

        ajax: function(options){ //url, type, payload, useCache, method, eventName) {
            //error handling
            if(!options.url || !options.type) throw new Error('must pass url and type to the api functions');

            //cache by default
            var useCache = (typeof options.useCache === "undefined") ? true : options.useCache;

            //get the data Id
            var self = this,
                dataId = this.dataId(options.url, options.type, options.payload);

            //set a one time listener for the response if we have a callback methods
            if(options.method){
                var func = (typeof options.method === "function") ? options.method : this[options.method];
                this.dispatcher.once("api:" + dataId + ":received", function (data) {
                    if(typeof console !== "undefined") console.log('heard once listener in api mixin' - dataId);
                    //make sure to pass the "this" context
                    func.call(self, data);
                });
            }

            //is it in the queue alredy?
            if(!FluxMarionette.api.queue[dataId]){
                //add it to the queue
                FluxMarionette.api.queue[dataId] = true;

                //this lets things know we've sent the request out
                this.dispatch("api:" + dataId + ":requested");

                //check the cache
                var promise;
                if(FluxMarionette.api.cache[dataId] && useCache){
                    promise = $.Deferred().resolve(FluxMarionette.api.cache[dataId]);
                } else {
                    //prep the ajax options
                     var defaults = {
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: (options.payload) ? JSON.stringify(options.payload) : ""
                        }, 
                        ajaxOptions = $.extend(defaults, options);
                        delete ajaxOptions.method;
                        delete ajaxOptions.payload;

                     //now we've got the options so set the promise   
                     promise = $.ajax(ajaxOptions);
                }
                
                promise.done(function (data) {
                    //cache the data
                    if (useCache) {
                        FluxMarionette.api.cache[dataId] = data;
                    }

                    //remove this call from the sync cue
                    delete FluxMarionette.api.queue[dataId];

                    //dispatch the message, this dispatch is identified by the request params
                    self.dispatch("api:" + dataId + ":received", data);

                    //for a generic event name to broadcast
                    if(options.eventName) self.dispatch(options.eventName, data);
                }).fail(function (xhr, error) {
                    //remove this call from the sync cue
                    delete FluxMarionette.api.queue[dataId];

                    //error events, both specific and general
                    self.dispatch("api:" + dataId + ":failed", error);
                    self.dispatch("api:genericError", error);

                });
            }

            //this is returned as a reference for special error handlers in stores
            return dataId;
        }
    };
});
