define(function (require) {
    'use strict';

    require('marionette.mixin.shim');
    var Radio = require('backbone.radio');
    var dispatcher = Radio.channel('dispatcher');
    var Config = require('config');
    var md5 = require('md5');

    return function() {
        this.setDefaults({
            cache: {},
            //debug: false,

            type: function() {
                if (typeof this.attributes !== "undefined") { return "store"; }
                if (typeof this.routes !== "undefined") { return "router"; }
                if (typeof this.render !== "undefined") { return "view"; }
            },

            debugLogger: function(action, payload, dispatcher, response) {
                if (this.debug === false) { return; }
                var css1 = 'color:black; font-weight: bold;';
                var css2 = 'color:black;';
                var css3 = 'color:black;';
                if (this.type() === 'store') { css3 = "color: #0066FF; font-style: italic;"; }
                if (this.type() === 'view') { css3 = "color: #006600; font-style: italic;"; }
                if (this.type() === 'router') { css3 = "color: #CC3300; font-style: italic;"; }
                var name = this.name;
                var type = this.type();

                if (dispatcher) { name = 'Dispatcher'; type = dispatcher; css3 = 'color: #CC00CC; font-style: italic;'; }

                var message = '';
                if (dispatcher) {
                    message = ' data request in the ';
                } else {
                    message = (response ? ' handled by ' : ' sent from ');
                }
                console.debug((response ? ' ↪ ' : '') + ' %c' + action + '%c' + message + name + '%c ' + type, css1, css2, css3, payload);
            },

            dispatch: function(action, payload, cache) {
                var self = this;
                this.debugLogger(action, payload);

                // Automatically trigger ACTION_RECEIVED events for a
                // ACTION_REQUESTED event
                if (action.indexOf('_REQUESTED') > -1) {

                    var name = action.replace('_REQUESTED', '');

                    if (typeof Config.api[name] === "undefined") {
                        throw new Error('The ' + name + ' api call doesn\'t exist in config.js, please add it.');
                    }

                    if (typeof Config.api[name].request === "undefined") {
                        throw new Error('The { ' + name + ': request: {}} object doesn\'t exist in config.js, please add it.');
                    }

                    if (typeof Config.api[name].dataSource === "undefined") {
                        throw new Error('Please specify a dataSource for ' + name + 'in config.js (either "live" or "fake").');
                    }

                    if (typeof Config.api[name].returnDataProp === "undefined") {
                        throw new Error('Please specify a returnDataProp (string) for ' + name + 'in config.js (eg. "ReturnValue").');
                    }

                    var request = Config.api[name].request;

                    // For a REQUESTED action, eg: 'ACTION_REQUESTED', { some: 'payload' }
                    // the payload is the params we send to the API.
                    var defaultParams = request.Params;

                    // If there is a payload, send it
                    if (payload) {
                        request.Params = [JSON.stringify(payload)];
                    }

                    var fake = Config.api[name].dataSource === "fake";

                    if (fake && _.size(payload) > 0 && this.debug !== false) {
                        console.debug('%cFake data Params simulated.', 'font-color: black; background-color: #E5F0FC;');
                        console.debug('%c ↪ What was sent:', 'font-color: black; background-color: #E5F0FC;', request.Params);
                    }

                    var RECEIVED = action.replace('_REQUESTED', '_RECEIVED');
                    var FAILED = action.replace('_REQUESTED', '_FAILED');



                    // Caching logic
                    if ((Config.api[name].cache || cache) && cache !== false && this.cache[md5(JSON.stringify(request))]) {
                        if (self.debug !== false) {
                            var cachingString = 'caching override is ' + cache +
                                ', caching settings is ' + Config.api[name].cache +
                                ', cached object was ' + (this.cache[md5(JSON.stringify(request))] ? 'found' : 'not found');
                            console.debug('%cRequest fetched from cache, ' + cachingString, 'font-color: black; background-color: yellow;');
                        }
                        var data = this.cache[md5(JSON.stringify(request))];
                        this.dispatch(RECEIVED, data[Config.api[name].returnDataProp]);

                    // Regular requests
                    } else {
                        if (self.debug !== false) {
                            console.debug('%cRequest not fetched from cache', 'font-color: black; background-color: yellow;');
                        }
                        (fake ? this.getFakeData(request) : this.getLiveData(request))
                            .done(function (data) {
                                if (Config.api[name].cache || cache) {
                                    // Cache the data
                                    self.cache[md5(JSON.stringify(request))] = data;
                                }

                                self.debugLogger(RECEIVED, data[Config.api[name].returnDataProp], fake ? 'fake data' : 'live data');

                                if (data[Config.api[name].successFlag] === false) {
                                    self.dispatch(FAILED, { data: data[Config.api[name].returnDataProp], messages: data.Messages });
                                    self.dispatch('ERROR_MESSAGE', { message: data.Messages.join(', ') });
                                } else {
                                    self.dispatch(RECEIVED, data[Config.api[name].returnDataProp]);
                                }
                            })
                            .fail(function(response) {
                                self.dispatch(FAILED, { data: null, messages: response.statusText });
                                self.dispatch('ERROR_MESSAGE', { message: response.statusText });
                            });
                    }
                }

                dispatcher.trigger(action, payload);
            },

            // To use waitFor, you can pass a string or an array of strings/objects.
            //
            // The simplest case, if you just need one action without a payload:
            //     waitFor('SOME_ACTION_REQUESTED');
            //
            // A more complex case with two actions, the second containing a payload:
            //     waitFor(['SOME_ACTION_REQUESTED', { action: 'ANOTHER_ACTION_REQUESTED', payload: {} } ]);
            waitFor: function(actions) {
                var self = this;
                var promise = $.Deferred();
                var promises = [];

                // Accept a single string as an action
                if (typeof actions === 'string') {
                    actions = [actions];
                }

                if (!$.isArray(actions)) {
                    throw new Error('In ' + this.name + ', waitFor() needs to be an array of actions (or a single action)');
                }

                this.dispatch('LOADING', this.name);

                _.each(actions, function(obj) {

                    // Accept an array full of actions as a string, or objects
                    if (typeof obj === 'string') {
                        obj = { action: obj, payload: null, cache: null } ;
                    }

                    var promise = $.Deferred();
                    promises.push(promise);

                    // Listen for ACTION_RECEIVED events - this is purely
                    // convention that comes out of the dispatch() method. Any
                    // REQUESTED event will return a RECEIVED event upon
                    // completion of the ajax call
                    dispatcher.once(obj.action.replace('_REQUESTED', '_RECEIVED'), function(payload) {
                        promise.resolve(payload);
                    });

                    dispatcher.once(obj.action.replace('_REQUESTED', '_FAILED'), function (payload) {
                        promise.reject(payload);
                    });

                    // If it takes longer than 5 seconds and we don't get the
                    // ACTION_RECEIVED event, reject the promise.
                    //
                    // TODO: This is for when the ajax call hangs... think of a
                    // better way to capture and handle this
                    setTimeout(function() {
                        if (promise.state() !== "resolved") {
                            promise.reject();
                        }
                    }, 5000);

                    self.dispatch(obj.action, obj.payload, obj.cache);
                });

                $.when.apply($, promises)
                    .done(function () {
                        promise.resolve(arguments);
                        self.dispatch('LOADED', self.name);
                    })
                    .fail(function () {
                        promise.reject(arguments);
                    });

                return promise;
            },

            getFakeData: function (request) {
                var path = 'Javascript/testData/' + request.MethodName + '.js';
                var json = $.getJSON(path)
                    .fail(function(data) {
                        if (data.status === 404) {
                            throw new Error('Test data for ' + request.MethodName + ' does not exist. Please create ' + path);
                        }
                    });

                return json;
            },


            getLiveData: function (request) {
                var result = $.ajax({
                    type: 'POST',
                    url: '/GatewayProxy/UiProxy.aspx?op=UiGatewayRestMethod',
                    data: JSON.stringify(request),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                });

                return result;
            }

        });

        this.before('initialize', function () {
            var self = this;

            if (typeof this.name === "undefined") {
                console.error(this);
                console.error('To use the dispatcher, you must have a name defined. This error is coming from a ' + this.type() + '.');
                //throw new Error('To use the dispatcher, you must have a name defined. This error is coming from a ' + this.type() + '.');
            }

            _.each(this.dispatcherEvents, function(method, action) {
                if (typeof self[method] !== "function" && typeof method !== "function") {
                    throw new Error('The ' + self.name + ' store has a ' + action + ' action defined, but no method to handle it. Please define ' + method + ' on your store.');
                }

                var func;
                if (typeof method === "function") {
                    func = method;
                } else {
                    func = self[method];
                }

                self.listenTo(dispatcher, action, func);
                self.listenTo(dispatcher, action, function() { self.debugLogger(action, null, false, true); });

            });

        });
    };
});
