define(function (require) {
	var Marionette = require('backbone.marionette'),
		Views = require('classes/views');

	require('backbone.validation');

	//our formView stuff
	var formView = function(options) {
		//we'll need this reference inside some things
		var self = this,
			modelValidationError = "You need to specify a model with validation!";

		//add the submit handler
		this.events = $.extend((this.events || {}), {
			'submit form': function(e){
				e.preventDefault();

				//get form data
				var data = $(e.currentTarget).serializeArray();

				//make it an object /**************************************** improve *****************************
				var obj = data.reduce(function(current, item){
					current[item.name] = item.value;
					return current;
				}, {});
				
				console.log(obj);
				
				var errors = this.model.preValidate(obj);

				console.log(errors);
				
				/*
				//dispatch the form data
				this.dispatch('sync:newAddress', obj);

				//back home
				Backbone.history.navigate('', { trigger: true });*/
			}
		});

		//to handle field errors...
		function validateField(fieldName){
			if(self.model && self.model.validation){
			  	if(self.model.validation[fieldName]){
			  		return self.model.validation[fieldName];
			  	} else {
			  		console.error(fieldName + " is not specified in your model");
			  	}
			} else {
				console.error(modelValidationError);
			}

			return false;
		}

		//form class specs

		//template for form group
		var formGroupTemplate = _.template('\
				<div class="form-group"> \
					<label><%= label %></label> \
					<% if(type === "select"){ %>\
						<select name="<%= name %>">\
							<% for(i in options){ %>\
								<option value="<%= options[i].value %>"><%= options[i].text %></option>\
							<% } %>\
						</select>\
					<% } else if(type === "textarea"){ %>\
						<textarea name="<%= name %>"></textarea>\
					<% } else { %>\
						<input type="<%= type %>" name="<%= name %>" /> \
					<% } %>\
				</div> \
			');

		//template helpers allow us to create fields on the fly
		this.templateHelpers = $.extend((this.templateHelpers || {}), {
			showField: function(fieldName){
				//get the prop  ///********************************** add error handling
				var thisField = validateField(fieldName);

				if(thisField){
					//make sure they give options if it's a select
					if(thisField.inputType === "select" && !thisField.options){
						console.error(fieldName + ': must have "options" to define options for a select.');
						return "";
					}

					return formGroupTemplate({ 
						name: fieldName, 
						label: (thisField.label || fieldName),
						type: (thisField.inputType || "text"),
						options: (thisField.options || [])  
					});
				} 

				return "";
			}
		});

		//validate that the model and everything is set up right
		setTimeout(function(){
			//bind validation now, if there's no model, it'll throw an error
			Backbone.Validation.bind(self);
			
			//we need to check if they specified a validation schema
			if(!self.model.validation){
				console.error(modelValidationError);
			}

		}, 0);
		


	    Views.ItemView.call(this, options);
	};

	_.extend(formView.prototype, Views.ItemView.prototype);

	formView.extend = Views.ItemView.extend;  

	return formView;
});
