require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: "src",
    paths: {
    	"jquery": "../vendor/jquery/dist/jquery.min",
    	"underscore": "../vendor/underscore/underscore-min",
    	"backbone": "../vendor/backbone/backbone",
        "backbone.radio": "../vendor/backbone.radio/build/backbone.radio",
        "backbone.marionette": "../vendor/marionette/lib/backbone.marionette"
    }
});

define(function(require) {
	var FluxMarionette = require('flux.marionette');// '../flux.marionette.min');

	////////////////////////////////////////////////// app classes ///////////////////////////////////////
	//an app class
	var App = FluxMarionette.Application.extend({
		initialize: function(){
			//
		}
	});
	var app = new App();

	//our api controller class//****** legacy
	var apiController = FluxMarionette.ApiController.extend({
		name: {
			url: "demoData/name.js", 
			type: "GET",
			apiMethod: "ajax",
			eventName: "dispatch:name:in"
		},

		addresses: {
			url: "demoData/addresses.js",
			type: "GET",
			apiMethod: "ajax",
			eventName: "dispatch:addresses:in"
		}
	});
	app.apiController = new apiController();//this should be a singleton

	//set some endpoints
	FluxMarionette.Endpoints.set({
		name: {
			url: "demoData/name.js",
			type: "GET",
			apiMethod: "ajax",
			eventName: "dispatch:name:in"
		},
		addresses: {
			url: "demoData/addresses.js",
			type: "GET",
			apiMethod: "ajax",
			eventName: "dispatch:addresses:in"
		}
	});

	var Router = FluxMarionette.Router.extend({
		routes: {
			'': function(){
				this.dispatch('route:home');
			},

			'addAddress': function(){
				this.dispatch('route:addAddress');
			},

			'editAddress/:id': function(id){
				this.dispatch('route:editAddress', id);
			}
		}
	});
	app.router = new Router;

	////////////////////////////////////////////////// stores ///////////////////////////////////////
	//the addresses collection
	var addressCollection = FluxMarionette.CollectionStore.extend({
		initialize: function(){
			var self = this;

			//this will make the api calls that the others listen for
			this.waitFor([
				this.getEndpoint('addresses'),
				//this.getEndpoint('name') 
				app.apiController.getEndpoint('name')//just to make sure it still works //*** legacy
			]).done(function(dataArray){
				self.depsIn(dataArray);
			});
		},

		depsIn: function(dataArray){
			//map the data
			var addresses = dataArray[0].map(function(address){
				return $.extend(address, { name: dataArray[1]});
			});

			this.set(addresses);

			//dispatch the addresses in event
			this.dispatch('dispatch:addresses:mapped', addresses);

		},

		dispatcherEvents: {
			'sync:newAddress': function(data){
				this.add(data);
			}
		}
	});
	app.addressStore = new addressCollection;

	//the name store
	var nameModel = FluxMarionette.ModelStore.extend({
		dispatcherEvents: {
			"dispatch:name:in": function(data){
				this.set(data);
			}
		}
	});
	app.nameStore = new nameModel;


	//the layout store
	var layoutStore = FluxMarionette.ModelStore.extend({
		//debug: true,

		initialize: function(){
			var self = this;

			//this will make the api calls that the others listen for
			this.waitFor([
				'dispatch:addresses:mapped'
			]).done(function(dataArray){
				self.depsIn();
			});
		},

		depsIn: function(){
			this.set({ ready: true });
		},

		dispatcherEvents: {
			'route:home': function(){
				this.set({ current: 'home' });
			},

			'route:addAddress': function(){
				this.set({ current: 'addressForm' });
			}
		}
	});
	app.layoutStore = new layoutStore();


	////////////////////////////////////////////////// views ///////////////////////////////////////

	//the name view
	var NameTemplate = ' \
		<h3>Name</h3> \
		First: <%= First %> <br />\
		Last: <%= Last %> \
	';
	var NameView = FluxMarionette.ItemView.extend({
		template: _.template(NameTemplate),

		initialize: function(){
			this.model = app.nameStore;
		},

		onBeforeRender: function(){
			//console.log(this.model.toJSON());
		}
	});

	//address view, this needs both name and address
	var AddressTemplate = '\
		<div class="address"> \
			<table> \
				<tr> \
					<td>Name:</td> \
					<td><%= name.First %> <%= name.Last %></td> \
				</tr> \
				<tr> \
					<td>Line one:</td> \
					<td><%= LineOne %></td> \
				</tr> \
				<tr> \
					<td>Line two:</td> \
					<td><%= LineTwo %></td> \
				</tr> \
				<tr> \
					<td>City:</td> \
					<td><%= City %></td> \
				</tr> \
				<tr> \
					<td>State:</td> \
					<td><%= State %></td> \
				</tr> \
				<tr> \
					<td>Zip:</td> \
					<td><%= Zip %></td> \
				</tr> \
			</table> \
		</div> \
	';
	var AddressView = FluxMarionette.ItemView.extend({
		template: _.template(AddressTemplate)
	});

	var AddressesTemplate = '<h3>Addresses <a href="#addAddress">+ add one</a></h3><div id="addressList"></div>';
	var AddressesView = FluxMarionette.CompositeView.extend({
		childView: AddressView,
		childViewContainer: "#addressList",
		template: _.template(AddressesTemplate),

		initialize: function(){
			this.collection = app.addressStore;
		}
	});

	//address form
	var AddressFormTemplate = '\
		<h3>Add an address</h3> \
		<form> \
			<div> \
				<label>Line One</label> \
				<input type="text" name="LineOne" /> \
			</div> \
			<div> \
				<label>Line Two</label> \
				<input type="text" name="LineTwo" /> \
			</div> \
			<div> \
				<label>City</label> \
				<input type="text" name="City" /> \
			</div> \
			<div> \
				<label>State</label> \
				<input type="text" name="State" /> \
			</div> \
			<div> \
				<label>Zip</label> \
				<input type="text" name="Zip" /> \
			</div> \
			<div> \
				<a href="#">cancel</a> &nbsp; \
				<input type="submit" value="submit"> \
			</div> \
		</form> \
	';
	var AddressFormView = FluxMarionette.ItemView.extend({
		template: _.template(AddressFormTemplate),

		events: {
			'submit form': function(e){
				e.preventDefault();

				//get form data
				var data = $(e.currentTarget).serializeArray();

				//make it an object
				var obj = data.reduce(function(current, item){
					current[item.name] = item.value;
					return current;
				}, {});

				//dispatch the form data
				this.dispatch('sync:newAddress', obj);

				//back home
				Backbone.history.navigate('', { trigger: true });
			}
		}
	});

	//layout view
	var LayoutTemplate = '\
		<div id="homeWrapper"> \
			<div id="addressWrapper"></div> \
			<div id="nameWrapper"></div> \
		</div> \
		\
		<div id="addressFormWrapper" style="display:none;"> \
			<div id="addressForm"></div> \
		</div> \
	';
	var LayoutView = FluxMarionette.LayoutView.extend({
		el: "#app",
		template: _.template(LayoutTemplate),

		regions: {
			'name': '#nameWrapper',
			'addresses': '#addressWrapper',
			'addressForm': '#addressForm'
		},

		initialize: function(){
			this.render();
		},

		modelEvents: {
			'change:ready': function(){
				this.getRegion('name').show(new NameView);
				this.getRegion('addresses').show(new AddressesView);
				this.getRegion('addressForm').show(new AddressFormView);
			},

			'change:current': function(){
				$('#' + this.model.get('current') + "Wrapper").show().siblings().hide();
			}
		}
	});
	app.layoutView = new LayoutView({ model: app.layoutStore });

	//start the router
	Backbone.history.start();

});
