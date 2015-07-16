define(function (require) {
	var Radio = require('backbone.radio');
	
	return {
		//the main broadcast channels
    	dispatcher: Radio.channel('dispatcher'),
		requests: Radio.channel('requests'),

        dispatch: function(action, payload){
        	this.dispatcher.trigger(action, payload);
        }
	};
});
