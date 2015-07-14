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
			console.log(this.api);
		},

		dispatcherEvents: {
			'testEvent': function(data){
				//console.log('heard test event');
				//console.log(data);
			}
		}
	});
	var testStore = new Store();

	//a demo itemview
	var ItemView = FluxMarionette.ItemView.extend({
		initialize: function(){
			this.dispatch('testEvent', { test: "test"});
		}
	});
	var testView = new ItemView();
});
