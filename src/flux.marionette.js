//our main container
var FluxMarionette = {};

define(function (require) {
    'use strict';

    //need marionette
    require('backbone.marionette')

    //caching and queueing containers used by the api mixin
    FluxMarionette.api = { cache: {}, queue: {}};

    //load up the classes ///////////////////////////////////////////////
    FluxMarionette.ApiController = require('classes/apiController');
    FluxMarionette.Application = require('classes/application');
    FluxMarionette.CollectionStore = require('classes/collectionStore');
    FluxMarionette.ModelStore = require('classes/modelStore');
    FluxMarionette.Router = require('classes/router');

	//we've got all the views in the same class file, this way changes can easily be made to all views
	var views = require('classes/views');
	FluxMarionette = $.extend(FluxMarionette, views);

    //we do some logging, so create a safe console
    if (typeof console === "undefined") {
        console = {
            log: function () { },
            error: function () {}
        };
    }

    //add debug support for FF
    console.debug = console.debug || console.log;

    return FluxMarionette;
});
