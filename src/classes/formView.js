define(function (require) {
	var Views = require('classes/views');

	require('backbone.validation');

	//some vars
	var modelValidationError = "You need to specify a model with validation!",
		defaultSettings = {
			groupClass: "form-group",
			textClass: "",
			selectClass: "",
			textAreaClass: "",
			invalidClass: "invalid",
			requiredClass: "required",
			selectEmptyText: "Choose..."
		},
		formGroupTemplate = _.template('\
			<div class="<%= groupClass %>"> \
				<label>\
					<%= label %>\
					<% if(required){ %>\
						<span class="<%= requiredClass %>"></span>\
					<% } %>\
				</label> \
				<% if(type === "select"){ %>\
					<select name="<%= name %>" class="<%= selectClass %>">\
						<option value="" class="placeholder" style="display:none;"><%= selectEmptyText %></option>\
						<% for(i in options){ %>\
							<% var selected = (options[i].value == value) ? " selected" : ""; %>\
							<option value="<%= options[i].value %>"<%= selected %>><%= options[i].text %></option>\
						<% } %>\
					</select>\
				<% } else if(type === "textarea"){ %>\
					<textarea name="<%= name %>" class="<%= textAreaClass %>"><%= value %></textarea>\
				<% } else { %>\
					<input type="<%= type %>" name="<%= name %>" class="<%= textClass %>" value="<%= value %>" /> \
				<% } %>\
			</div> \
		');

	//our formView stuff
	var formView = function(options) {
		//we'll need this reference inside some things
		var self = this;

		//add the submit handler
		this.events = $.extend((this.events || {}), {
			'submit form': function(e){
				e.preventDefault();

				//get form data
				var data = $(e.currentTarget).serializeArray();

				//make it an object 
				var obj = data.reduce(function(current, item){
					current[item.name] = item.value;
					return current;
				}, {});
				
				//run validation
				var errors = this.model.preValidate(obj);

				//are there errors?
				if(errors){
					var self = this;
					$.each(errors, function(name, value){
						//show and clear error
						self.$('[name=' + name + ']').keyup(function(e){
							$(this).siblings('div.' + FluxMarionette.FormView.settings.invalidClass).remove();
						}).after('<div class="' + FluxMarionette.FormView.settings.invalidClass + '">' + value + '</div>');
					});
				} else {
					//send event
					this.dispatch('submit:' + (this.name || this.model.cid), obj);

					//if we have an onSubmit handler, call it
					this.onSubmit && this.onSubmit();
				}
			}
		});

		//to handle field errors...
		function validateField(fieldName){
			if(self.model && self.model.schema){
			  	if(self.model.schema[fieldName]){
			  		return self.model.schema[fieldName];
			  	} else {
			  		console.error(fieldName + " is not specified in your model");
			  	}
			} else {
				console.error(modelValidationError);
			}

			return false;
		}

		//template helpers allow us to create fields on the fly
		this.templateHelpers = $.extend((this.templateHelpers || {}), {
			showField: function(fieldName){
				//get the prop 
				var thisField = validateField(fieldName);

				if(thisField){
					//make sure they give options if it's a select
					if(thisField.inputType === "select" && !thisField.options){
						console.error(fieldName + ': must have "options" to define options for a select.');
						return "";
					}

					return formGroupTemplate($.extend(defaultSettings, (FluxMarionette.FormView.settings || {}), {
						name: fieldName, 
						label: thisField.label || fieldName,
						type: thisField.inputType || "text",
						options: thisField.options || [],
						required: thisField.required || false,
						value: self.model.get(fieldName) || ""  
					}));
				} 

				//cant find field
				return "";
			}
		});

		//validate that the model and everything is set up right
		setTimeout(function(){
			//make sure the model has a schema
			if(self.model && self.model.schema){
				//pass just the validation parts of the schema to the validation
				self.model.validation = _.mapObject(self.model.schema, function(val, key){
					return _.omit(val, 'label', 'options', 'inputType');
				});

				//bind validation now, if there's no model, it'll throw an error
				Backbone.Validation.bind(self);
			
			//we need to check if they specified a validation schema
			} else console.error(modelValidationError);

			//extend settings from defaults
			FluxMarionette.FormView.settings = $.extend(defaultSettings,(FluxMarionette.FormView.settings || {}));

		}, 0);
		
	    Views.ItemView.call(this, options);
	};

	_.extend(formView.prototype, Views.ItemView.prototype);

	formView.extend = Views.ItemView.extend;  

	return formView;
});
