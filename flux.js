FluxMarionette = {};//global namespace 

define(function (require) {
	//deps
	require('backbone.marionette');

	//a bunch of marionette stuff we want to inherit, but don't need flux functioanlity for
	FluxMarionette.Application = Marionette.Application.extend({});
	//add them all ***************************************************

	//our flux stuff
	require('classes/store');
	require('classes/views')


});
