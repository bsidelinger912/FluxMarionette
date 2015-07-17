# FluxMarionette
A flux based framework that extends backbone and Marionette. 

## FluxMarionette.Application
This is an extension of Marionette.Application with our dispatcher added.  The dispatcher is used to route events in a uni-directional flow.  It is invoked by calling .dispatch, all the modules in the framework have this method to dispatch an event.


