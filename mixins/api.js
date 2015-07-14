define(function (require) {
    "use strict";

    var dispatcher = require('mixins/dispatcher');

    //this request method is how we get data from the API
    return function () {
        this.mixin([dispatcher]);

        this.setDefaults({
            ajax: function(url, action, payload, cache) {
                //create a promise
                var promise = $.ajax({
                    type: action,
                    url: url,
                    data: JSON.stringify(payload),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                });

                return promise;
            }
        });
    };
});
