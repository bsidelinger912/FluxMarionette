//our main container
var FluxMarionette = {};

define(function (require) {
    'use strict';

    //need marionette
    require('backbone.marionette');

    //we do some logging, so create a safe console
    if (typeof console === "undefined") {
        console = {
            log: function () {},
            error: function () {}
        };
    }

    //caching and queueing containers used by the api mixin
    FluxMarionette.api = { cache: {}, queue: {}};

    //load up the classes ///////////////////////////////////////////////
    FluxMarionette.Endpoints = require('classes/endpoints');
    FluxMarionette.ApiController = require('classes/apiController');
    FluxMarionette.Application = require('classes/application');
    FluxMarionette.CollectionStore = require('classes/collectionStore');
    FluxMarionette.ModelStore = require('classes/modelStore');
    FluxMarionette.Router = require('classes/router');

	//we've got all the views in the same class file, this way changes can easily be made to all views
	var views = require('classes/views');
	FluxMarionette = $.extend(FluxMarionette, views);

    //add debug support for FF
    console.debug = console.debug || console.log;

    return FluxMarionette;
});
