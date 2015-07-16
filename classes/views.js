define(function (require) {
	//things to add to all views
	var dispatcher = require('mixins/dispatcher');

	//extend all the views //////////////////////////
	//item view
	FluxMarionette.ItemView = function(options) {
	    Marionette.ItemView.call(this, options);
	};
	_.extend(FluxMarionette.ItemView.prototype, Marionette.ItemView.prototype, dispatcher);
	FluxMarionette.ItemView.extend = Marionette.ItemView.extend;


	//collectionView
	FluxMarionette.CollectionView = function(options) {
	    Marionette.CollectionView.call(this, options);
	};
	_.extend(FluxMarionette.CollectionView.prototype, Marionette.CollectionView.prototype, dispatcher);
	FluxMarionette.CollectionView.extend = Marionette.CollectionView.extend;


	//compositView
	FluxMarionette.CompositeView = function(options) {
	    Marionette.CompositeView.call(this, options);
	};
	_.extend(FluxMarionette.CompositeView.prototype, Marionette.CompositeView.prototype, dispatcher);
	FluxMarionette.CompositeView.extend = Marionette.CompositeView.extend;


	//layoutview
	FluxMarionette.LayoutView = function(options) {
	    Marionette.LayoutView.call(this, options);
	};
	_.extend(FluxMarionette.LayoutView.prototype, Marionette.LayoutView.prototype, dispatcher);
	FluxMarionette.LayoutView.extend = Marionette.LayoutView.extend;

});
