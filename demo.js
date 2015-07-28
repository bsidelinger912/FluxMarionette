require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: "src",
    paths: {
    	"jquery": "../vendor/jquery/dist/jquery.min",
    	"underscore": "../vendor/underscore/underscore-min",
    	"backbone": "../vendor/backbone/backbone",
        "backbone.radio": "../vendor/backbone.radio/build/backbone.radio",
        "backbone.marionette": "../vendor/marionette/lib/backbone.marionette"
    }
});

define(function(require) {
	var FluxMarionette = require('../flux.marionette.min');//'flux.marionette');/

	var apiController = FluxMarionette.ApiController.extend({
		name: {
			url: "demoData/name.js", 
			type: "GET",
			apiMethod: "ajax"
		},

		addresses: {
			url: "demoData/addresses.js",
			type: "GET",
			apiMethod: "ajax"
		}
	});

	var thisApiController = new apiController();//this should be a singleton

	//an app class
	var App = FluxMarionette.Application.extend({
		initialize: function(){
			//
		}
	});
	var app = new App();

	
	//a store class
	var addressStore = FluxMarionette.ModelStore.extend({
		debug: true,

		initialize: function(){
			var self = this;

			//demo a wait for with both a generic event and an api call
			this.waitFor([
				thisApiController.getEndpoint('name'),
				thisApiController.getEndpoint('addresses')
			]).done(function(dataArray){
				self.depsIn();
			});

			/*
			var dataId = this.ajax({
				url: "testData/name.json", 
				type: "GET",
				method: 'testDataIn'
			});

			console.log(dataId);*/
		},

		depsIn: function(dataArray){
			console.log('deps in');
			console.log(this.toJSON());
		},

		setAddresses: function(data){
			this.set({ addresses: data });
		},

		setName: function(data){
			this.set({ name: data });
		},

		dispatcherEvents: {
			'testEvent': 'setTestEventData'
		}, 

		setTestEventData: function(data){
			this.set({ testEventData: data });
		}
	});
	var testStore = new aStore();



	//a demo itemview
	var ItemView = FluxMarionette.ItemView.extend({
		initialize: function(){
			this.dispatch('testEvent', { testEventData: "test"});
		}
	});
	var testView = new ItemView();
});
