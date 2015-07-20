define(function (require) {
	var Marionette = require('backbone.marionette');
	
	//things to add to all views
	var dispatcher = require('mixins/dispatcher');

	//we'll want to pass all the views here
	var views = {};

	//item view
	views.ItemView = function(options) {
	    Marionette.ItemView.call(this, options);
	};
	_.extend(views.ItemView.prototype, Marionette.ItemView.prototype, dispatcher);
	views.ItemView.extend = Marionette.ItemView.extend;


	//collectionView
	views.CollectionView = function(options) {
	    Marionette.CollectionView.call(this, options);
	};
	_.extend(views.CollectionView.prototype, Marionette.CollectionView.prototype, dispatcher);
	views.CollectionView.extend = Marionette.CollectionView.extend;


	//compositView
	views.CompositeView = function(options) {
	    Marionette.CompositeView.call(this, options);
	};
	_.extend(views.CompositeView.prototype, Marionette.CompositeView.prototype, dispatcher);
	views.CompositeView.extend = Marionette.CompositeView.extend;


	//layoutview
	views.LayoutView = function(options) {
	    Marionette.LayoutView.call(this, options);
	};
	_.extend(views.LayoutView.prototype, Marionette.LayoutView.prototype, dispatcher);
	views.LayoutView.extend = Marionette.LayoutView.extend;

	return views;
});
