require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    paths: {
    	"jquery": "vendor/jquery/dist/jquery.min",
    	"underscore": "vendor/underscore/underscore-min",
    	"backbone": "vendor/backbone/backbone-min",
        "backbone.radio": "vendor/backbone.radio/build/backbone.radio",
        "backbone.marionette": "vendor/marionette/lib/backbone.marionette",
        "backbone.sync.shim": "vendor/orca-lni-utils-backbone-sync-shim/backbone.sync.shim",
        "backbone.localstorage": "vendor/backbone.localStorage-min",
        'backbone.advice': "vendor/backbone.advice/advice",
        'backbone.mixin': "vendor/backbone.advice/mixin"
    }
});

define(function(require) {
	require('flux');

	//listener
	Backbone.Radio.tuneIn('dispatcher');

	//an app class
	var App = FluxMarionette.Application.extend({});
	var thisApp = new App();


	//a store class
	var Store = FluxMarionette.Store.extend({
		initialize: function(){
			var self = this;

			//demo a wait for with both a generic event and an api call
			this.waitFor([
				{
					url: "testData/name.json", 
					type: "GET",
					method: 'testDataIn'
				},
				"testEvent"
			]).done(function(){
				self.twoDepsIn();
			});
			/*
			this.ajax({
				url: "testData/name.json", 
				type: "GET",
				method: 'testDataIn'
			});
			*/
		},

		twoDepsIn: function(){
			console.log('two deps in');
			console.log(this.toJSON());
		},

		testDataIn: function(data){
			console.log('testDataIn');
			this.set({ testajaxData: data });
			console.log(this.toJSON());
		},

		dispatcherEvents: {
			'testEvent': function(data){
				this.set({ testEventData: data });
			}
		}
	});
	var testStore = new Store();

	//another test store...
	var Store2 = FluxMarionette.Store.extend({
		initialize: function(){
			console.log('this is a store 2');
		}
	});
	var anotherTestStoreInstance = new Store2();

	//a demo itemview
	var ItemView = FluxMarionette.ItemView.extend({
		initialize: function(){
			this.dispatch('testEvent', { testEventData: "test"});
		}
	});
	var testView = new ItemView();
});
