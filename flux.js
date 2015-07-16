FluxMarionette = {};//global namespace 

define(function (require) {
	//deps
	require('lib/md5');
	require('backbone.marionette');
	var Advice = require('backbone.advice');
	var Radio = require('backbone.radio');

	var Cocktail = require('vendor/cocktail/Cocktail-0.5.10.min');

	//shim the mixin capability
	Advice.addMixin(Backbone.Router);
	Advice.addMixin(Backbone.Model);
    Advice.addMixin(Marionette.ItemView);
    Advice.addMixin(Marionette.CollectionView);
    Advice.addMixin(Marionette.CompositeView);
    Advice.addMixin(Marionette.LayoutView);
    Advice.addMixin(Marionette.Application);
    Advice.addMixin(Marionette.Object);

	//class mixins 
	var dispatcherMixin = require('mixins/dispatcher');
	var applicationMixin = require('mixins/application');
	var routerMixin = require('mixins/router');
	var storeMixin = require('mixins/store');
	var viewMixin = require('mixins/view');

	//here's our classes, to take advantage of defaults and beforeInit, we'll put all the functionality in the mixins
	//FluxMarionette.Application = Marionette.Application.extend({ }).mixin([applicationMixin]);
	FluxMarionette.Router = Backbone.Router.extend({}).mixin([routerMixin]);
	FluxMarionette.Store = Backbone.Model.extend({}).mixin([storeMixin]);
	FluxMarionette.ItemView = Marionette.ItemView.extend({}).mixin([viewMixin]);



	//new ******************************
	require('classes/application');
	//require('classes/store');
	/*
	var storeMixin = {
		initialize: function(){
			console.log('framework init');
		},

		testMethod: function(){
			console.log('test method');
		}
	};

	var FluxMarionette.test = Backbone.Model;

	Cocktail.mixin(Store, storeMixin);

	//*******************************************
	var Store = Backbone.Model.extend({
		initialize: function(){
			console.log('code init');
		}
	});

	var newStore = new Store();*/

	var FluxStore = function(options) {
	    Backbone.Model.call(this, options);
	}

	_.extend(FluxStore.prototype, Backbone.Model.prototype, {
		//the main broadcast channels
    	dispatcher: Radio.channel('dispatcher'),
		requests: Radio.channel('requests'),

		/*
        dispatch: function(action, payload){
        	this.dispatcher.trigger(action, payload);
        },*/

	    beforInit: function(ext) {
	      	_.each(ext.dispatcherEvents, function(method, action) {
            	
	            if (typeof self[method] !== "function" && typeof method !== "function") {
	                throw new Error('The ' + self.name + ' store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
	            }

	            var func = (typeof method === "function") ? method : self[method];
	            
	            this.listenTo(this.dispatcher, action, func);

	        }, this);
	    }
	});

	FluxStore.extend = function(options){
		FluxStore.prototype.beforInit(options);

		return Backbone.Model.extend(options);
	}

	var Store = FluxStore.extend({
		dispatcherEvents: {
			'testEvent': function(){
				console.log('heard test event');
			}
		}
	});

	var mmm = new Store();
});
