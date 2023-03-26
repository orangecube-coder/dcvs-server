module.exports = class UserDto {
	firstName;
	lastName;
	email;
	id;
	isActivated;
	roles;

	constructor(model) {
		this.firstName = model.firstName;
		this.lastName = model.lastName;
		this.email = model.email;
		this.id = model._id;
		this.isActivated = model.isActivated; 
		this.roles = model.roles;
	}
}