var FluxMarionette = {};//global namespace 

define(function (require) {
	//deps
	require('backbone.marionette');
	var Advice = require('backbone.advice');
	var Radio = require('backbone.radio');

	//shim the mixin capability
	Advice.addMixin(Backbone.Router);
    Advice.addMixin(Marionette.ItemView);
    Advice.addMixin(Marionette.CollectionView);
    Advice.addMixin(Marionette.CompositeView);
    Advice.addMixin(Marionette.LayoutView);
    Advice.addMixin(Marionette.Application);
    Advice.addMixin(Marionette.Object);

	//class mixins 
	var dispatcherMixin = require('mixins/dispatcher');
	var applicationMixin = require('mixins/application');
	var storeMixin = require('mixins/store');
	var viewMixin = require('mixins/view');

	//here's our classes, to take advantage of defaults and beforeInit, we'll put all the functionality in the mixins
	FluxMarionette.Application = Marionette.Application.extend({ }).mixin([applicationMixin]);
	FluxMarionette.Store = Backbone.Model.extend({}).mixin([storeMixin]);
	FluxMarionette.ItemView = Marionette.ItemView.extend({}).mixin([viewMixin]);

});
