define(function(require){

	//this is our way of setting up listeners for dispatcher events, modeled after marionette's model events obj
	return function(){
		//loop through  dispatcher events
		if(this.dispatcherEvents){
			_.each(this.dispatcherEvents, function(method, action) {
	            if (typeof this[method] !== "function" && typeof method !== "function") {
	                throw new Error('The store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
	            }

	            var func = (typeof method === "function") ? method : this[method];
	          
	            this.listenTo(this.dispatcher, action, func);

	        }, this);
		}
	}
});