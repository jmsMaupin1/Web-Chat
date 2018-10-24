const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
	conversationId: {type: Schema.Types.ObjectId},
	created: {type: Date, default: Date.now},
	content: String,
	author : {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('message', messageSchema);