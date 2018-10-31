const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
    created: {type: Date, default: Date.now},
    message: {type: String},
    user   : {type: Schema.Types.ObjectId, ref: 'User'}, 
    room   : {type: Schema.Types.ObjectId, ref: 'Room'}
})

messageSchema.statics.getMessagesInRoom = function(roomId, cb) {
    this.find({room: roomId})
        .populate('user', 'local.username')
        .exec(cb);
}

module.exports = mongoose.model('message', messageSchema);