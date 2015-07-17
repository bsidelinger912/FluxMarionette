require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    paths: {
    	"jquery": "vendor/jquery/dist/jquery.min",
    	"underscore": "vendor/underscore/underscore-min",
    	"backbone": "vendor/backbone/backbone",
        "backbone.radio": "vendor/backbone.radio/build/backbone.radio",
        "backbone.marionette": "vendor/marionette/lib/backbone.marionette"
    }
});

define(function(require) {
	require('flux');

	//listener
	Backbone.Radio.tuneIn('dispatcher');

	//an app class
	var App = FluxMarionette.Application.extend({
		initialize: function(){
			//console.log('application inited');
		}
	});
	var thisApp = new App();

	//a store class
	var aStore = FluxMarionette.ModelStore.extend({
		initialize: function(){
			//console.log('application mixin');

			//this.testMethod();
			var self = this;

			//demo a wait for with both a generic event and an api call
			this.waitFor([
				{
					url: "testData/name.js", 
					type: "GET",
					method: 'testDataIn'
				},
				"testEvent"
			]).done(function(){
				self.twoDepsIn();
			});

			/*
			var dataId = this.ajax({
				url: "testData/name.json", 
				type: "GET",
				method: 'testDataIn'
			});

			console.log(dataId);*/
		},

		twoDepsIn: function(){
			console.log('two deps in');
			console.log(this.toJSON());
		},

		testDataIn: function(data){
			console.log('test ajax data in');
			this.set({ testajaxData: data });
		},

		dispatcherEvents: {
			'testEvent': 'setTestEventData'
		}, 

		setTestEventData: function(data){
			console.log('heard test event via dispatcherEvents');
			this.set({ testEventData: data });
		}
	});
	var testStore = new aStore();

	//var storeMixin = require('mixins/store');
	//var model = Backbone.Model.extend({}).mixin([storeMixin]);
	//var thisModel = new model();


	//another test store...
	/*var Store2 = FluxMarionette.Store.extend({
		initialize: function(){
			//console.log('this is a store 2');
		}
	});
	var anotherTestStoreInstance = new Store2();*/

	//a demo itemview
	var ItemView = FluxMarionette.ItemView.extend({
		initialize: function(){
			this.dispatch('testEvent', { testEventData: "test"});
		}
	});
	var testView = new ItemView();
});
