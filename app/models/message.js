const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
	created: {type: Date, default: Date.now},
	message: {type: String},
	user   : {
		username: {type: String},
		_id     : {type: Schema.Types.ObjectId, ref: 'User'}
	}, 
	room   : {type: Schema.Types.ObjectId, ref: 'Room'}
})

module.exports = mongoose.model('message', messageSchema);