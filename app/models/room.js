const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RoomSchema = new Schema({
    name: {type: String},
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

RoomSchema.statics.join = function(roomName, userId, cb) {
    if (!userId) {
        cb('userId is null');
        return;
    }

    this.find({name: roomName})
        .populate('participants', 'local.username')
        .limit(1)
        .exec( (err, rooms) => {
            if (err) cb(err);
            if (rooms.length > 0) {
                let room = rooms[0]
                let notMe = room.participants.filter( user => user._id.toString() === userId );

                if (notMe.length === 0) {
                    room.participants.push(userId);
                    room.save(cb);
                } else {
                    cb(null, room);
                }
            } else {
                const newRoom = new this();
                newRoom.name = roomName;
                newRoom.participants = [userId];

                newRoom.save(cb);
            }
        })
}

// RoomSchema.statics.join = function(roomName, userId, cb) {
//     this.findOne({name: roomName}, (err, room) => {
//         if (err) cb(err);
//         if (!userId) {
//             cb('userId is null');
//             return;
//         }
//         if (room) {
//             let participantsNotMe = room.participants.filter( user => {
//                 return user.toString() === userId;
//             })

//             if (participantsNotMe.length === 0)
//                 room.participants.push(userId);

//             room.save((err, room) => {
//                 if (err) cb(err);
//                 else cb(null, room);
//             });

//             return;
//         }
        

//         const newRoom = new this();
//         newRoom.name = roomName;
//         newRoom.participants = [userId];

//         newRoom.save((err, room) => {
//             if (err) cb(err);
//             else cb(null, room);
//         });

//     })
// }

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

RoomSchema.statics.leave = function(roomName, userId) {
    this.findOne({name: roomName}, (err, room) => {
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