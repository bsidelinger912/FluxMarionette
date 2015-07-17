FluxMarionette = {};//global namespace 

define(function (require) {
	//deps
	require('backbone.marionette');

	//load our flux classes
	require('classes/application');
	require('classes/modelStore');
	require('classes/views');
	require('classes/router');
	require('classes/apiController');

});
