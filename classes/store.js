define(function (require) {
	var dispatcher = require('shared/dispatcher');

	//our stuf to run on initialization, won't collide with module initialize function
	var beforeInit = function(){
		//grab the dispatcher events
		console.log(this.dispatcherEvents);
		_.each(this.dispatcherEvents, function(method, action) {
            	
            if (typeof self[method] !== "function" && typeof method !== "function") {
                throw new Error('The ' + self.name + ' store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
            }

            var func = (typeof method === "function") ? method : self[method];
            
            this.listenTo(this.dispatcher, action, func);

        }, this);
	};

	//mix specific methods in with any shared props or methods
	var methods = $.extend({
		
	}, dispatcher);



	//put it all together here
	FluxMarionette.Store = function(options){
		beforeInit();
		Backbone.Model.apply(this, [options]);
	}

	_.extend(FluxMarionette.Store.prototype, Backbone.Model.prototype, methods);

	FluxMarionette.Store.extend = Backbone.Model.extend;

});
