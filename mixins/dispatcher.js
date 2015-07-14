define(function (require) {
    "use strict";

    var Radio = require('backbone.radio');
    
    return function () {
        this.setDefaults({
        	//the main broadcast channels
        	dispatcher: Radio.channel('dispatcher'),
    		requests: Radio.channel('requests'),

            dispatch: function(action, payload){
            	this.dispatcher.trigger(action, payload);
            }
        });
    };
});
