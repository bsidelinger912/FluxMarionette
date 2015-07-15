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
        	
        });

    };
});
