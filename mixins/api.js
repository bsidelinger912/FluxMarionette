define(function (require) {
    "use strict";

    //deps
    require('lib/md5');

    //caching and queueing containers
    FluxMarionette.api = FluxMarionette.api || { cache: {}, queue: {}};

    //this request method is how we get data from the API, it needs the dispatcher to be mixed in already
    return {
        dataId: function(url, type, payload){
            //we need these two
            if(!url || !type) throw new Error('must pass url and verb to the api functions');

            //might not be a payload
            payload = (typeof payload === "object") ? payload : {};

            return md5(url + type + JSON.stringify(payload));
        },

        ajax: function(options){ //url, type, payload, useCache, method) {
            //error handling
            if(!options.url || !options.type) throw new Error('must pass url and action to the api functions');

            //cache by default
            var useCache = (typeof options.useCache === "undefined") ? true : options.useCache;

            //get the data Id
            var self = this,
                dataId = this.dataId(options.url, options.type, options.payload);

            //set a one time listener for the response if we have a callback methods
            if(options.method){
                var func = (typeof options.method === "function") ? options.method : this[options.method];
                this.dispatcher.once("api:" + dataId + ":received", function (data) {
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
                    promise = $.ajax({
                        type: options.type,
                        url: options.url,
                        data: (options.payload) ? JSON.stringify(options.payload) : "",
                        contentType: 'application/json charset=utf-8',
                        dataType: 'json'
                    });
                }

                promise.done(function (data) {
                    //dispatch the message, this dispatch is identified by the request params
                    self.dispatch("api:" + dataId + ":received", data);
                    
                    //cache the data
                    if (useCache) {
                        FluxMarionette.api.cache[dataId] = data;
                    }
                }).fail(function (xhr, error) {
                    //error events, both specific and general
                    self.dispatch("api:" + dataId + ":failed", error);
                    self.dispatch("api:genericError", error);

                })
                .always(function(xhr, error, message){
                    //remove this call from the sync cue
                    delete FluxMarionette.api.queue[dataId];
                });
            }

            //this is returned as a reference for special error handlers in stores
            return dataId;
        }
    };
});
