const {Schema, model} = require("mongoose");

const JournalSchema = new Schema({
	node: {type: Schema.Types.ObjectId, ref: 'Node'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	timestamp: {type: Date},
	description: {type: String}
}, { timestamps: true })

module.exports = model('Journal', JournalSchema);