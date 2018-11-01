const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RoomSchema = new Schema({
    name: {type: String},
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

RoomSchema.statics.createRoom = function(roomName, cb) {
    if (roomName === 'General' || roomName === 'General 2') {
        this.find({name: roomName})
            .populate('participants', 'local.username')
            .limit(1)
            .exec( (err, room) => {
                if (err) cb(err);
                else if (room[0]) cb(err, room[0]);
                else {
                    let newRoom = new this();
                    newRoom.name = roomName;
                    newRoom.save(cb);
                }
            })
    } else {
        let newRoom = new this();
        newRoom.name = roomName;
        newRoom.save(cb);
    }
}

RoomSchema.statics.getRoom = function(roomId, cb) {
    this.find({_id: roomId})
        .populate('participants', 'local.username')
        .limit(1)
        .exec( (err, room) => cb(err, room[0]));
}

RoomSchema.statics.join = function(roomId, user, cb) {
    if (!user) {
        cb('user is null');
        return;
    }

    this.find({_id: roomId})
        .populate('participants', 'local.username')
        .limit(1)
        .exec( (err, rooms) => {
            if (err) cb(err);
            else if (rooms.length > 0) {
                let room = rooms[0];
                let me = room.participants.filter( p => p._id.toString() === user._id );

                if (me.length === 0) {
                    room.participants.push(user._id);
                    room.save( (err, room) => {
                        if (err) { 
                            cb(err);
                            return;
                        }

                        this.populate(room, {path: 'participants', model: 'User'}, (err, room) => {
                            room.participants.forEach( (p, index) => {
                                room.participants[index].local = {
                                    username: p.local.username
                                }
                            })

                            cb(err, room);
                        });
                    });
                } else {
                    cb(null, room);
                }
            } else {
                cb('No Room Found');
            }
        })
}

RoomSchema.statics.getByParticipants = function(participants, cb) {
    this.find({"participants" : {"$in" : participants}})
        .populate('participants', 'local.username')
        .exec(cb);
}

RoomSchema.statics.getParticipants = function(roomId, cb) {
    this.find({_id: roomId})
        .limit(1)
        .populate('user', 'local.username')
        .exec( (err, room) => {
            cb(err, room.participants);
        });
}

RoomSchema.statics.leave = function(roomId, userId) {
    this.findOne({_id: roomId}, (err, room) => {
        if (err) throw err;
        if (room) {
            room.participants.forEach((user, index) => {
                if (user.toString() === userId){
                    room.participants.splice(index, 1);
                }
            })

            room.save( err => {
                if (err) throw err;
            })

            return;
        }
    })
}

module.exports = mongoose.model('Room', RoomSchema);