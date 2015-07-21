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
	var FluxMarionette = require('flux.marionette');//../flux.marionette.min');

	console.log(FluxMarionette);

	
	//listener
	//Backbone.Radio.tuneIn('dispatcher');

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
		},
		ssrGetProfile: {
            url: "http://lnidpc003109d/multifactor2/Controller/Controller.aspx/getEntities",
            type: "POST",
            payload: {"Guid":"DV2FT4VQ9PD6Q-2WP0DW9TM-DD7WV4ZZ8D-6FL0FQ6WW"}
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
	var aStore = FluxMarionette.ModelStore.extend({
		debug: true,

		initialize: function(){
			//console.log('application mixin');

			//this.testMethod();
			var self = this;
/*
			var promise = $.ajax({
	            type: "POST",
	            url: "http://lnidpc003109d/multifactor2/Controller/Controller.aspx/getEntities",
	            data: JSON.stringify({"Guid":"DV2FT4VQ9PD6Q-2WP0DW9TM-DD7WV4ZZ8D-6FL0FQ6WW"}),
	            contentType: "application/json; charset=utf-8",
	            dataType: "json"
	        });

	        promise.done( function(){
	        	console.log('done');
	        });

*/

			//demo a wait for with both a generic event and an api call
			this.waitFor([
				/*{
					url: "demoData/name.js", 
					type: "GET",
					method: 'setName'//change to callbackMethod, and add an api method ie "ajax" or "websockets"
				},*/
				thisApiController.getEndpoint('ssrGetProfile'),
				"testEvent"
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

		depsIn: function(){
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
