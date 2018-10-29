const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RoomSchema = new Schema({
	name: {type: String},
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

RoomSchema.statics.join = function(roomName, userId, cb) {
	return this.findOne({name: roomName}, (err, room) => {
		if(err) cb(err);
		if(room) {
			if(room.participants.filter((user) => {return user.toString() === userId}).length === 0)
				room.participants.push(userId);
			room.save((err, room) => {
				if(err) cb(err);
				else cb(null, room);
			});
			return;
		}
		

		const newRoom = new this();
		newRoom.name = roomName;
		newRoom.participants = [userId];

		newRoom.save((err) => {
			if(err) cb(err);
			else cb(null, err);
		});

	})
}

RoomSchema.statics.leave = function(roomName, userId) {
	this.findOne({name: roomName}, (err, room) => {
		if(err) throw err;
		if(room) {
			room.participants.forEach((user, index) => {
				if(user.toString() === userId){
					room.participants.splice(index, 1);
				}
			})

			room.save((err) => {
				if(err) throw err;
			})

			return;
		}
	})
}

module.exports = mongoose.model('Room', RoomSchema);