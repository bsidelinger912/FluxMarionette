define(function (require) {
	var dispatcher = require('shared/dispatcher');

	//our stuf to run on initialization, won't collide with module initialize function
	var beforeInit = function(){
		
	};

	//mix specific methods in with any shared props or methods
	var methods = $.extend({

	}, dispatcher);

	

	//put it all together here
	FluxMarionette.Application = function(options){
		beforeInit();
		Marionette.Application.apply(this, [options]);
	}

	_.extend(FluxMarionette.Application.prototype, Marionette.Application.prototype, methods);

	FluxMarionette.Application.extend = Marionette.Application.extend;

});