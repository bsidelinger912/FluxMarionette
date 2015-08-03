define(function (require) {
    "use strict";

    var endpoints = require('classes/endpoints');

    return {
    	getEndpoint: endpoints.get.bind(endpoints),
    	setEndpoint: endpoints.set.bind(endpoints),
    	callEndpoint: endpoints.call.bind(endpoints)  
    };
});