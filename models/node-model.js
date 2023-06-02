const {Schema, model} = require("mongoose");

const NodeSchema = new Schema({
	value: {type: String, unique: true},
	area: {type: Schema.Types.ObjectId, ref: 'Area'}
}, { timestamps: true })

module.exports = model('Node', NodeSchema);