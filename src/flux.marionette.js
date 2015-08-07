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

    //add debug support for FF
    console.debug = console.debug || console.log;

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

    //console.log(require.toUrl('backbone.validation'));
    FluxMarionette.FormView = require('classes/formView');  

    /*
    console.log(require.specified('backbone.validation'));
    //new form view, we'll make it optional as it means they need  new library at 10k
    if (require.specified('backbone.validation')) {
        require(['classes/formView'], function(FormView){
            FluxMarionette.FormView = FormView;
        });
    } else {
        FluxMarionette.FormView = {
            extend: function(){
                console.error('You need to create a require.config entry for "backbone.validation" in order to use FluxMarionette.FormView.');
            }
        };
    }*/

    return FluxMarionette;
});
