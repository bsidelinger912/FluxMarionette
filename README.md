# FluxMarionette
A flux based framework that extends Backbone and Marionette. 

## Installation

Install via [Bower](http://bower.io/)

```
bower install flux.marionette
```


## The classes
Below is a list of classes provided in the framework.  All these classes are used exactly like their bacbone/marionette counterparts, except that new methods are provided as well as event binding via dispatcherEvents in stores and routers

### FluxMarionette.Application
Marionette counterpart: Marionette.Application

####Methods: 
#####.dispatch(eventName, eventPayload)
this is the core method that the whole flux event cycle is built on.  Every class has this method and it's the primary means that modules use to communicate via the flux event path.

###FluxMarionette.ApiController
This is a way to save information about api endpoints in a central module available via AMD. This will usually be set up as a singleton. You pass in your endpoints like this:

```javascript

var apiController = FluxMarionette.ApiController.extend({
		name: {
			url: "demoData/name.js", 
			type: "GET",
			apiMethod: "ajax"
		},

		addresses: {
			url: "demoData/addresses.js",
			type: "GET",
			apiMethod: "ajax"
		}
	});

```
The params are the params you need to send to a .waitFor or .api call. You can then get the endpoint for use in an api call or .waitFor list like this:

```javascript
thisApiController.getEndpoint("addresses", function(data){ //do something with data});
```

####Methods: 
#####.getEndpoint(endpointName, callbackFunction or eventName)
The second argument can be a function (usally this.something) or a string for a global event name that will be dispatched when the data is aquired from the endpoint.  This is usefull to pass to a .waitFor list.

#####.callEndpoint(endpointName, callbackFunction or eventName)
This method is built on .getEndpoint, but it makes the api immediately.  This is useful when you don't need to wait for multiple calls and want to make an api call from the common endpoint.

###FluxMarionette.CollectionStore
Backbone counterpart: Backbone.Collection

This class is a fluxified Backbone collection.  It has the dispatcherEvents listener object as does FluxMarionette.ModelStore and FluxMarionette.Router.  These listeners are set like this and work similar to Marionette's modelEvents:

```javascript
dispatcherEvents: {
	'testEvent': 'nameOfAMethodInThisClass',
	'anotherEvent': function(data){
		//here we just pass an actual function
	}
}
```
####Methods:
#####.dispatch(eventName, eventPayload) 
This is available on all classes execept FluxMarionette.ApiController

#####.ajax(api config)
This is currently our only api method.  We hope to add websockets soon.  This takes the usual params for a jquery ajax call except it has a method property which can be a function or the name of a method in your class.

#####.waitFor(array of dependancies)
The dependancies can be strings that identify an event name or an api config object.  WaitFor returns a promise with an array containing the data from all the events/api calls in the order they were declaired.  Here's an example with two methods of passing api call data and one custom event:

```javascript
this.waitFor([
	{
		url: "demoData/name.js", 
		type: "GET",
		method: 'setName'
	},
	thisApiController.getEndpoint("addresses", this.setAddresses),
	"testEvent"
]).done(function(dataArray){
	self.depsIn();
});
```

###FluxMarionette.ModelStore
Backbone counterpart: Backbone.Model

This has all the same capabilities as FluxMarionette.CollectionStore but is built on Backbone.Model

###FluxMarionette.Router
Backbone counterpart: Backbone.Router

This has all the same capabilities as FluxMarionette.CollectionStore and FluxMarionette.ModelStore but is built on Backbone.Router

###FluxMarionette.LayoutView
Marionette counterpart: Marionette.LayoutView
####Methods:
#####.dispatch(eventName, eventPayload) 
This is available on all classes execept FluxMarionette.ApiController.  Views shoud dispatch any event that happens instead of calling methods on models.  This way all stores that might be interested in the event can respond accordingly.

###FluxMarionette.CompositeView
Marionette counterpart: Marionette.CompositeView
####Methods:
#####.dispatch(eventName, eventPayload) 
This is available on all classes execept FluxMarionette.ApiController.  Views shoud dispatch any event that happens instead of calling methods on models.  This way all stores that might be interested in the event can respond accordingly.

###FluxMarionette.CollectionView
Marionette counterpart: Marionette.CollectionView
####Methods:
#####.dispatch(eventName, eventPayload) 
This is available on all classes execept FluxMarionette.ApiController.  Views shoud dispatch any event that happens instead of calling methods on models.  This way all stores that might be interested in the event can respond accordingly.

###FluxMarionette.ItemView
Marionette counterpart: Marionette.ItemView
####Methods:
#####.dispatch(eventName, eventPayload) 
This is available on all classes execept FluxMarionette.ApiController.  Views shoud dispatch any event that happens instead of calling methods on models.  This way all stores that might be interested in the event can respond accordingly.