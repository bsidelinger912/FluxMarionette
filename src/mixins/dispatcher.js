define(function (require) {
    var Radio = require('backbone.radio');

    function debugLogger(action, payload, dispatcher, response){
    	//need to do something for this***********************
    	if (!this.debug) { return; }

        var css1 = 'color:black; font-weight: bold;';
        var css2 = 'color:black;';
        var css3 = 'color:black;';
        
        if (this.type() === 'store') { css3 = "color: #0066FF; font-style: italic;"; }
        if (this.type() === 'view') { css3 = "color: #006600; font-style: italic;"; }
        if (this.type() === 'router') { css3 = "color: #CC3300; font-style: italic;"; }

        var name = this.name || "a";
        var type = this.type();

        if (dispatcher) { name = 'Dispatcher'; type = dispatcher; css3 = 'color: #CC00CC; font-style: italic;'; }

        var message = (dispatcher) ? ' data request in the ' : (response ? ' handled by ' : ' sent from ');

        console.debug((response ? ' ↪ ' : '') + ' %c' + action + '%c' + message + name + '%c ' + type, css1, css2, css3, payload);
    }
    
    return {
        //the main broadcast channel
        dispatcher: Radio.channel('dispatcher'),

        //should type be a private function?????
        type: function() {
            if (typeof this.attributes !== "undefined") { return "store"; }
            if (typeof this.routes !== "undefined") { return "router"; }
            if (typeof this.render !== "undefined") { return "view"; }
        },

        dispatch: function(action, payload){
        	debugLogger.call(this, action, payload);
            this.dispatcher.trigger(action, payload);
        }
    };
});
