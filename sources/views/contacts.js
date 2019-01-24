import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import ContactInfo from "views/contact-info";
import ContactForm from "views/contact-form";

export default class ContactsListView extends JetView {
	config() {
		const contactsList = {
			view: "list",
			localId: "list",
			select: true,
			type: {
				height: 70
			},
			on: {
				onAfterSelect: id => {
					this.setParam("id", id, true);
					console.log(id);
					console.log("changed");
					// this.show("contact-info");
				}
			},
			template: contact => {
				return `
        <div class="user-listitem">
        <img class="user-listitem__img" alt="Contact image" src=${contact.Photo ||
					"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="50" height="50">
          <div class="user-listitem__info">
          <div class="user-listitem__name">${contact.FirstName ||
						"Unknown"} ${contact.LastName || "Unknown"}</div>
          <sub class="user-listitem__email">${contact.Email}</sub>
          </div>
        </div>
        `;
			}
		};
		return {
			rows: [
				{
					view: "toolbar",
					localId: "contacts:toolbar",
					css: "webix_dark",
					cols: [{ view: "label", label: "Contacts" }]
				},
				{
					cols: [
						{
							rows: [
								contactsList,
								{
									view: "button",
									label: "Add",
									type: "icon",
									icon: "wxi-plus",
									click: () => {
										this.show("contact-form").then(() =>
											this.setParam("id", "", true)
										);
									}
								}
							]
						},
						{ $subview: true }
					]
				}
			]
		};
	}
	selectListItemOnInit() {
		const firstId = contacts.getFirstId();
		this.setParam("id", firstId, true);
		console.log(this.getParam("id"));
		this.$$("list").select(firstId);
	}
	init() {
		this.show("contact-info");
		console.log("contacts init");
		this.$$("list").parse(contacts);
		contacts.waitData.then(() => this.selectListItemOnInit());
	}
}
