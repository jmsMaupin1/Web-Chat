const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
	// conversationId: {type: Schema.Types.ObjectId}, // for when I implement chat rooms / private messaging
	created: {type: Date, default: Date.now},
	content: {type: String},
	author : {type: String}
})

module.exports = mongoose.model('message', messageSchema);