var FluxMarionette = {};

define(function (require) {
    'use strict';

    require('backbone.marionette')

    //our main container
    

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

    return FluxMarionette;
});
