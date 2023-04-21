const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	isActivated: {type: Boolean, default: false},
	activationLink: {type: String},
	lastLogin: {type: Date, default: Date.now},
	roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
}, { timestamps: true })

module.exports = model('User', UserSchema);