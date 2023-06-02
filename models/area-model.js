const {Schema, model} = require("mongoose");

const AreaSchema = new Schema({
	value: {type: String, unique: true},
	description: {type: String}
}, { timestamps: true })

module.exports = model('Area', AreaSchema);