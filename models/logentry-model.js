const {Schema, model} = require("mongoose");

const LogEntrySchema = new Schema({
	value: {type: String, unique: true, default: 'USER'},
	node: {type: Schema.Types.ObjectId, ref: 'Node'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	description: {type: String}
}, { timestamps: true })

module.exports = model('LogEntry', LogEntrySchema);