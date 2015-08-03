# FluxMarionette
####A flux based framework that extends [Backbone](http://backbonejs.org/) and [Marionette](http://marionettejs.com/). 
The intent of this project is to create a pattern for the [Flux](https://facebook.github.io/flux/) event cycle within a Backbone/Marionette application.  Each is built on a Backbone or Marionette class and retains all native functionality.  The framework exposes a handful of new methods and properties that can be used to create a [Flux](https://facebook.github.io/flux/) architecture.  You'll need to have a strong grasp on Flux before you'll be able to effictively use this framework.  We don't necessary enforce any adherence to Flux, and you can use as much of it as you want/need without having to give anything up that you'd get with a normal Backbone/Marionette application.

<br /><br />
## Installation

Install via [Bower](http://bower.io/)

```
bower install flux.marionette
```


<br /><br />
##The Methods
The heart of FluxMarionette is the methods exposed in it's classes.  For any given class, all of it's native Backbone and Marionette functionality is left intact.  I'll give an overview of the methods here with a list of the classes they can be used with.  Below, we'll go over the classes and each class's methods will be listed again in that context

###.dispatch()
The dispatch method is available in all of our classes.  It is used to send an event through the dispatch cycle.  It's used like this:

```javascript
this.dispatch('eventName'[, eventPayload ]);
```

##### Classes that expose this method: 
* All classes

###.ajax()
This makes a [jquery ajax](http://api.jquery.com/jquery.ajax/) call, but also dispatches the call and response actions.  This allows for multiple stores to respond to anything that happens in the request or response.  You pass a single object to the method which will take any of the parameters of $.ajax as well as a few special parameters.  The extra params are "method", "eventName", and "payload".  Payload is just like the data property of the ajax call (and gets passed to that), but it also dispatches an event with the payload.  The .ajax method returns a "data ID", this represents a hashed representation of the call parameters, this serves as a unique reference to any call to the given API with the given parameters.  If a call is made that matches the data ID used by another call and the "useCache" param is passed as true or not passed (true is the default), then we'll respond with a cached version of the api repsonse.  This allows for optimization when multiple stores need the same data. The "method" property on the call can either be a string that references a method in the calling to call with the response data, or an anonymous function that is called with the response data.  The "eventName" property defines a generic event name for the call regardless of the call parameters, this is usefull for .ajax calls that use the same payload and are dependancies for multiple stores.  Several events are dispatched through the lifecycle of a successful ajax call: "api:dataId:requested", "api:dataId:received", and the eventName property if specified, and for an unsuccessful ajax call: "api:dataId:requested", "api:dataId:failed", and "api:genericError" (this is usefull for a generic system error message).

```javascript
var dataId = this.ajax({
	//true is the default
	useCache: true,

	//a method that exists in your class
	method: 'someMethodInMyClass',

	//or an anonymous    function
	method: function(data){
		//do something with the data...
	},

	//for a global event
	eventName: 'an:event:here'
});
``` 

##### Classes that expose this method: 
* FluxMarionette.ModelStore
* FluxMarionette.CollectionStore
* FluxMarionette.Router

###.dataId()
This is what is used by the .ajax method to create a data ID.  The method is exposed so that one can set up listeners for future api calls ahead of time.  Data Id takes all the same call params as .ajax, as those are necessary to create a unique representation of the call.

##### Classes that expose this method: FluxMarionette.ModelStore, FluxMarionette.CollectionStore, FluxMarionette.Router

###.waitFor()
This is used to handle a multiple dependancy stack.  You must pass an array of objects that define .ajax calls, or strings that represent events that must be raised.  .waitFor returns a promise and will pass an array of responses to each dependancy passed to .waitFor.  

```javascript
this.waitFor([
	//a custom event name
	'customeEventName',

	//the params for an ajax call
	{
		url: "demoData/name.js", 
		type: "GET",
		eventName: "dispatch:name:in"
	},

	//.ajax params derived from an endpoint, we'll explain this a little later...
	this.getEndpoint('address') 

]).done(function(dataArray){
	//do something now...
});
```

##### Classes that expose this method: 
* FluxMarionette.ModelStore
* FluxMarionette.CollectionStore
* FluxMarionette.Router

###.getEndpoint()
This method will return an endpoint defined in the FluxMarionette.Endpoints class, it can be used to retrieve the params needed for both .ajax and .waitFor.  See the class below for explanation of how to define endpoints.  

##### Classes that expose this method: 
* FluxMarionette.ModelStore
* FluxMarionette.CollectionStore
* FluxMarionette.Router

###.setEndpoint()
This method will set one or more endpoints for use by any class.  See the class below for explanation of how to define endpoints.  

##### Classes that expose this method: 
* FluxMarionette.ModelStore
* FluxMarionette.CollectionStore
* FluxMarionette.Router

###.callEndpoint()
This method will set one or more endpoints for use by any class.  See the class below for explanation of how to define endpoints. 

##### Classes that expose this method: 
* FluxMarionette.ModelStore
* FluxMarionette.CollectionStore
* FluxMarionette.Router


<br /><br />
##The Properties
We've added a few properties to our classes that allow for a backbone-like syntax for listening to events and easy access to the dispatcher (useful for setting listeners).

### dispatcher
Each class has a dispatcher property that is a pointer to a [backbone radio](https://github.com/marionettejs/backbone.radio) channel used for flux events.  Sending events should be done with the .dispatch() method.  The dispatcher property can be used though for setting a one-time listener like this:

```javascript
this.dispatcher.once('eventName', function(eventData){
	//do something here...
});
```

### dispatcherEvents
This property is used like a Backbone view's events or a Marionette view's modelEvents property.  You can specify a method in your class or assign an anonymous function.  

```javascript
dispatcherEvents: {
	'some:event:here', 'someMethod',
	'another:event': function(data){
		//act on the event
	}
},

someMethod: function(data){
	//act on the event
}
```

<br /><br />
## The Classes
Below is a list of classes provided in the framework.  All these classes are used exactly like their bacbone/marionette counterparts, except that new methods are provided as well as event binding via dispatcherEvents in stores and routers

### FluxMarionette.Application
**Marionette counterpart**: Marionette.Application

####Methods: 
* .dispatch() 
* .ajax()
* .waitFor()
* .getEndpoint()
* .callEndpoint()
* .setEndpoint()

###FluxMarionette.Endpoints
This is a way to save information about api endpoints in a central location. This module is global, so you can set or adjust endpoints from anywhere to be used anywhere. You'll need to specify at least the properties needed to make a jQuery $.ajax call, additional parameters are: "payload", "method", "useCache", and "eventName".

```javascript
//to set some endpoints
FluxMarionette.Endpoints.set({
	name: {
		url: "demoData/name.js", 
		type: "GET",
		eventName: "dispatch:name:recieved"
	},

	addresses: {
		url: "demoData/addresses.js",
		type: "GET",
		eventName: "dispatch:addresses:recieved"
	}
});

//now we can get the endpoint date like this
FluxMarionette.Endpoints.get(endpointName[, payload][, callback]);

//or call it like this:
FluxMarionette.Endpoints.call(endpointName[, payload][, callback]);
```

The params are the params you need to send to a .waitFor or .api call. From a store or router, you can then get the endpoint for use in an api call or .waitFor list like this:

```javascript
//to get the endpoint for .waitFor
this.getEndpoint(endpointName[, payload][, callback]);

//directly call the endpoint
this.getEndpoint(endpointName[, payload][, callback]);

//set an endpoint on the fly
this.setEndpoint(endpointParams);
```

####Methods: 
* .get()
* .set()
* .call()


###FluxMarionette.CollectionStore
**Backbone counterpart**: Backbone.Collection

This class is a fluxified Backbone collection.  It has the dispatcherEvents listener object as does FluxMarionette.ModelStore and FluxMarionette.Router.  These listeners are set like this and work similar to Marionette's modelEvents:

####Methods:
* .dispatch() 
* .ajax()
* .waitFor()
* .getEndpoint()
* .callEndpoint()
* .setEndpoint()


###FluxMarionette.ModelStore
**Backbone counterpart**: Backbone.Model

This has all the same capabilities as FluxMarionette.CollectionStore but is built on Backbone.Model.

####Methods:
* .dispatch() 
* .ajax()
* .waitFor()
* .getEndpoint()
* .callEndpoint()
* .setEndpoint()

###FluxMarionette.Router
**Backbone counterpart**: Backbone.Router

This has all the same capabilities as FluxMarionette.CollectionStore and FluxMarionette.ModelStore but is built on Backbone.Router

####Methods:
* .dispatch() 
* .ajax()
* .waitFor()
* .getEndpoint()
* .callEndpoint()
* .setEndpoint()



###FluxMarionette.LayoutView
**Marionette counterpart**: Marionette.LayoutView
The view classes should use .dispatch() to send event data such as a form submission or navigation for use by any stores or routers that may be interested.

####Methods:
* .dispatch() 

###FluxMarionette.CompositeView
**Marionette counterpart**: Marionette.CompositeView
The view classes should use .dispatch() to send event data such as a form submission or navigation for use by any stores or routers that may be interested.

####Methods:
* .dispatch() 

###FluxMarionette.CollectionView
**Marionette counterpart**: Marionette.CollectionView
The view classes should use .dispatch() to send event data such as a form submission or navigation for use by any stores or routers that may be interested.

####Methods:
* .dispatch() 

###FluxMarionette.ItemView
**Marionette counterpart**: Marionette.ItemView
The view classes should use .dispatch() to send event data such as a form submission or navigation for use by any stores or routers that may be interested.

####Methods:
* .dispatch() 