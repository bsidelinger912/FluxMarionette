require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: "src",
    paths: {
    	"jquery": "../vendor/jquery/dist/jquery.min",
    	"underscore": "../vendor/underscore/underscore-min",
    	"backbone": "../vendor/backbone/backbone",
        "backbone.radio": "../vendor/backbone.radio/build/backbone.radio",
        "backbone.marionette": "../vendor/marionette/lib/backbone.marionette",
        "backbone.validation": "../vendor/backbone-validation/dist/backbone-validation-amd"
    }
});

var app;

define(function(require) {
	var FluxMarionette = require('flux.marionette');// '../flux.marionette.min');

	//some settings
	FluxMarionette.FormView.settings = {
		textClass: "InputBox",
		requiredClass: "requiredField"
	};

	////////////////////////////////////////////////// app classes ///////////////////////////////////////
	//an app class
	var App = FluxMarionette.Application.extend({
		initialize: function(){
			//
		}
	});
	app = new App();

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
	var addressModel = FluxMarionette.ModelStore.extend({
		schema: {
			LineOneTest: {
				required: true,
				label: "Address Line One"
			},

			LineTwo: {
				required: false,
				label: "Address Line Two"
			},

			City: {
				required: true
			},

			State: {
				required: true,
				inputType: "select",
				options: [
				    {
				        "text": "Alabama",
				        "value": "AL"
				    },
				    {
				        "text": "Alaska",
				        "value": "AK"
				    },
				    {
				        "text": "American Samoa",
				        "value": "AS"
				    },
				    {
				        "text": "Arizona",
				        "value": "AZ"
				    },
				    {
				        "text": "Arkansas",
				        "value": "AR"
				    },
				    {
				        "text": "California",
				        "value": "CA"
				    },
				    {
				        "text": "Colorado",
				        "value": "CO"
				    },
				    {
				        "text": "Connecticut",
				        "value": "CT"
				    },
				    {
				        "text": "Delaware",
				        "value": "DE"
				    },
				    {
				        "text": "District Of Columbia",
				        "value": "DC"
				    },
				    {
				        "text": "Federated States Of Micronesia",
				        "value": "FM"
				    },
				    {
				        "text": "Florida",
				        "value": "FL"
				    },
				    {
				        "text": "Georgia",
				        "value": "GA"
				    },
				    {
				        "text": "Guam",
				        "value": "GU"
				    },
				    {
				        "text": "Hawaii",
				        "value": "HI"
				    },
				    {
				        "text": "Idaho",
				        "value": "ID"
				    },
				    {
				        "text": "Illinois",
				        "value": "IL"
				    },
				    {
				        "text": "Indiana",
				        "value": "IN"
				    },
				    {
				        "text": "Iowa",
				        "value": "IA"
				    },
				    {
				        "text": "Kansas",
				        "value": "KS"
				    },
				    {
				        "text": "Kentucky",
				        "value": "KY"
				    },
				    {
				        "text": "Louisiana",
				        "value": "LA"
				    },
				    {
				        "text": "Maine",
				        "value": "ME"
				    },
				    {
				        "text": "Marshall Islands",
				        "value": "MH"
				    },
				    {
				        "text": "Maryland",
				        "value": "MD"
				    },
				    {
				        "text": "Massachusetts",
				        "value": "MA"
				    },
				    {
				        "text": "Michigan",
				        "value": "MI"
				    },
				    {
				        "text": "Minnesota",
				        "value": "MN"
				    },
				    {
				        "text": "Mississippi",
				        "value": "MS"
				    },
				    {
				        "text": "Missouri",
				        "value": "MO"
				    },
				    {
				        "text": "Montana",
				        "value": "MT"
				    },
				    {
				        "text": "Nebraska",
				        "value": "NE"
				    },
				    {
				        "text": "Nevada",
				        "value": "NV"
				    },
				    {
				        "text": "New Hampshire",
				        "value": "NH"
				    },
				    {
				        "text": "New Jersey",
				        "value": "NJ"
				    },
				    {
				        "text": "New Mexico",
				        "value": "NM"
				    },
				    {
				        "text": "New York",
				        "value": "NY"
				    },
				    {
				        "text": "North Carolina",
				        "value": "NC"
				    },
				    {
				        "text": "North Dakota",
				        "value": "ND"
				    },
				    {
				        "text": "Northern Mariana Islands",
				        "value": "MP"
				    },
				    {
				        "text": "Ohio",
				        "value": "OH"
				    },
				    {
				        "text": "Oklahoma",
				        "value": "OK"
				    },
				    {
				        "text": "Oregon",
				        "value": "OR"
				    },
				    {
				        "text": "Palau",
				        "value": "PW"
				    },
				    {
				        "text": "Pennsylvania",
				        "value": "PA"
				    },
				    {
				        "text": "Puerto Rico",
				        "value": "PR"
				    },
				    {
				        "text": "Rhode Island",
				        "value": "RI"
				    },
				    {
				        "text": "South Carolina",
				        "value": "SC"
				    },
				    {
				        "text": "South Dakota",
				        "value": "SD"
				    },
				    {
				        "text": "Tennessee",
				        "value": "TN"
				    },
				    {
				        "text": "Texas",
				        "value": "TX"
				    },
				    {
				        "text": "Utah",
				        "value": "UT"
				    },
				    {
				        "text": "Vermont",
				        "value": "VT"
				    },
				    {
				        "text": "Virgin Islands",
				        "value": "VI"
				    },
				    {
				        "text": "Virginia",
				        "value": "VA"
				    },
				    {
				        "text": "Washington",
				        "value": "WA"
				    },
				    {
				        "text": "West Virginia",
				        "value": "WV"
				    },
				    {
				        "text": "Wisconsin",
				        "value": "WI"
				    },
				    {
				        "text": "Wyoming",
				        "value": "WY"
				    }
				]
			},

			Zip: {
				required: true
			}
		}
	});

	//the addresses collection
	var addressCollection = FluxMarionette.CollectionStore.extend({
		model: addressModel,

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
			'submit:addressForm': function(data){
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

	// https://github.com/hongymagic/jQuery.serializeObject
	$.fn.serializeObject = function () {
	    "use strict";
	    var a = {}, b = function (b, c) {
	        var d = a[c.name];
	        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
	    };
	    return $.each(this.serializeArray(), b), a
	};

	//address form
	var AddressFormTemplate = '\
		<h3>Add an address</h3> \
		<form> \
			<%= showField("LineOneTest") %> \
			<%= showField("LineTwo") %> \
			<%= showField("City") %> \
			<%= showField("State") %> \
			<%= showField("Zip") %> \
			<div> \
				<a href="#">cancel</a> &nbsp; \
				<input type="submit" value="submit"> \
			</div> \
		</form> \
	';
	var AddressFormView = FluxMarionette.FormView.extend({
		template: _.template(AddressFormTemplate),
		name: "addressForm",

		initialize: function(){
			this.model = new addressModel();
		},

		onSubmit: function(){
			Backbone.history.navigate('', { trigger: true });
		}//,

		// onBeforeDestroy: function(){
		// 	console.log('destroyed the form view');
		// }
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
