define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');

    //maybe??? ********
    FluxMarionette.api = { cache: {}, queue: {}};

    //this request method is how we get data from the API
    return function () {
        //mixins
        this.mixin([dispatcher]);
      
        this.setDefaults({
            dataId: function(url, action, payload){
                //we need these two
                if(!url || !action) throw new Error('must pass url and action to the api functions');

                //might not be a payload
                payload = (typeof payload === "object") ? payload : {};

                return md5(url + action + JSON.stringify(payload));
            },

            ajax: function(url, action, payload, cache) {
                //error handling
                if(!url || !action) throw new Error('must pass url and action to the api functions');

                //cache by default
                cache = (typeof cache === "undefined") ? true : cache;

                //get the data Id
                var dataId = this.dataId(url, action, payload);

                //are we already waiting for this same data
                if(!FluxMarionette.api.queue[dataId]){
                    //add to queue
                    FluxMarionette.api.queue[dataId]) = true;
        
                    //this lets things know we've sent the request out
                    this.dispatch("api:" + dataId + ":requested");

                    //check the cache
                    if(FluxMarionette.cache.dataId && cache){
                        
                    } else {
                        
                    }
                }

                //add to que

                //get the data

                //add data to cache


                /*
                //create a promise
                var promise = $.ajax({
                    type: action,
                    url: url,
                    data: JSON.stringify(payload),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                });

                return promise;*/
            }
        });
    };
});
