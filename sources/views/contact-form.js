import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class ContactFormPopupView extends JetView {
	urlChange() {
		console.log(this.getParam("id", true));
		// if(this.getParam("id", true)) {
		//   this.show("./contacts/contact-info")
		// }
	}
	config() {
		const form = {
			view: "form",
			localId: "contact:form",
			rules: {
				Details: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				DueDate: webix.rules.isNotEmpty
			},
			elements: [
				{
					view: "textarea",
					label: "Details",
					name: "Details",
					invalidMessage: "Fill the details field!",
					required: true
				},
				{
					view: "richselect",
					label: "Contacts",
					options: contacts,
					name: "ContactID",
					invalidMessage: "Choose the contact, please!",
					required: true
				},
				{
					view: "richselect",
					label: "Activity",
					options: activityTypes,
					name: "TypeID",
					invalidMessage: "Choose the activity, please!",
					required: true
				},

				{
					view: "datepicker",
					label: "Date",
					name: "DueDate",
					timepicker: true,
					format: "%d-%m-%Y",
					invalidMessage: "Choose date, please!",
					required: true
				},
				{
					view: "checkbox",
					checkValue: "Close",
					uncheckValue: "Open",
					label: "Completed",
					name: "State"
				},
				{
					view: "button",
					localId: "addBtn",
					value: "Add(*save)",
					click() {
						if (!this.getFormView().validate()) return;
						const { id } = this.getFormView().getValues();
						if (activities.exists(id)) {
							activities.updateItem(id, this.getFormView().getValues());
						} else {
							activities.add(this.getFormView().getValues());
						}
						this.getFormView().clear();
						this.getFormView().clearValidation();
						this.$scope.getRoot().hide();
					}
				},
				{
					view: "button",
					value: "Close",
					click() {
						this.$scope.getRoot().hide();
						this.getFormView().clear();
						this.getFormView().clearValidation();
					}
				}
			]
		};
		return {
			rows: [
				{
					view: "label",
					localId: "form:label",
					align: "center",
					label: "Add"
				},
				form
			]
		};
	}
	showWindow(item) {
		if (item) {
			this.$$("form").setValues(item);
			this.$$("addBtn").setValue("Save");
			this.$$("form:label").setValue("Edit Activity");
		} else {
			this.$$("addBtn").setValue("Add");
			this.$$("form:label").setValue("Add Activity");
		}
		this.getRoot().show();
	}
}
