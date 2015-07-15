define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');

    //caching and queueing containers
    FluxMarionette.api = FluxMarionette.api || { cache: {}, queue: {}};

    //this request method is how we get data from the API
    return function () {
        //mixins
        this.mixin([dispatcher]);
        console.log('mixing in api');
        this.setDefaults({
            dataId: function(url, action, payload){
                //we need these two
                if(!url || !action) throw new Error('must pass url and action to the api functions');

                //might not be a payload
                payload = (typeof payload === "object") ? payload : {};

                return md5(url + action + JSON.stringify(payload));
            },

            ajax: function(url, action, payload, doCache) {
                //error handling
                if(!url || !action) throw new Error('must pass url and action to the api functions');

                //cache by default
                doCache = (typeof doCache === "undefined") ? true : doCache;

                //get the data Id
                var self = this,
                    dataId = this.dataId(url, action, payload);

                //is it in the queue alredy?
                if(!FluxMarionette.api.que[dataId]){
                    //add it to the queue
                    FluxMarionette.api.que[dataId] = true;

                    //this lets things know we've sent the request out
                    this.dispatch("api:" + dataId + ":requested");

                    //check the cache
                    var promise;
                    if(FluxMarionette.api.cache[dataId] && doCache){
                        promise = $.Deferred().resolve(FluxMarionette.api.cache[dataId]);
                    } else {
                        
                        promise = $.ajax({
                            type: action,
                            url: url,
                            data: JSON.stringify(payload),
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json'
                        });
                    }

                    promise
                    .done(function (data) {
                        //dispatch the message, this dispatch is identified by the request params
                        this.dispatch("api:" + dataId + ":received", data);
                        
                        //remove this call from the sync cue
                        delete FluxMarionette.api.que[dataId];

                        //cache the data
                        if (doCache) {
                            FluxMarionette.api.cache[dataId] = data;
                        }
                    })
                    .fail(function () {
                        //do some logging *********************************************

                        //remove this call from the sync cue
                        delete FluxMarionette.api.que[dataId];
                    });
                }
            
            }
        });
    };
});
