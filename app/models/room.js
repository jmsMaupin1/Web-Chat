const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// Helper functions
let containsDoc = function(obj, list) {
    for(let i = 0; i < list.length; ++i) 
        if (list[i]._id.toString() === obj._id.toString())
            return i;

    return false;
}

const RoomSchema = new Schema({
    name         : {type: String},
    public       : {type: Boolean},
    participants : [{type: Schema.Types.ObjectId, ref: 'User'}],
    admins       : [{type: Schema.Types.ObjectId, ref: 'User'}],
})

RoomSchema.statics.createRoom = function(roomName, isPublic, cb, user) {
    if (roomName === 'General' || roomName === 'General 2') {
        this.find({name: roomName})
            .populate('participants', 'username')
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
        newRoom.public = isPublic;
        newRoom.participants = [user];
        newRoom.admins = [user];
        newRoom.save(cb);
    }
}

RoomSchema.statics.getRoom = function(roomId, cb) {
    this.find({_id: roomId})
        .populate('participants', 'username')
        .limit(1)
        .exec( (err, room) => cb(err, room[0]));
}

RoomSchema.statics.join = function(roomId, user, cb) {
    if (!user) {
        cb('user is null');
        return;
    }

    this.find({_id: roomId})
        .limit(1)
        .populate('participants', 'username online socket_id')
        .exec( (err, rooms) => {
            if (err) cb(err);
            else if (rooms.length > 0) {
                let room = rooms[0];

                if (room.participants.length === 0)
                    room.participants.push(user._id);
                else {
                    if(containsDoc(user, room.participants) === false)
                        room.participants.push(user._id);
                } 

                room.save( (err, room) => {
                    if (err) cb(err);
                    else {
                        this.populate(room, {path: 'participants', model: 'User', select: 'username online socket_id'}, ( err, room) => {
                            cb(err, room);
                        })
                    }
                });
            } else {
                cb('No Room Found');
            }
        })
}

RoomSchema.statics.kick = function(roomId, admin, user, cb) {
    this.findOne({"_id" : roomId})
        .populate('participants', 'username socket_id online')
        .populate('admin')
        .exec( (err, room) => {
            if (err) throw err;
            else if (!room) cb('room not found');
            else {
                console.log(JSON.stringify(room.admins, null, 2));
                if(containsDoc(admin, room.admins) === false)
                    return;

                let userIndex = containsDoc(user, room.participants);

                if(userIndex !== false)
                    room.participants.splice(userIndex, 1);

                room.save(cb);
            }
        })
}

RoomSchema.statics.getJoinableRooms = function(user, cb) {
    this.find({"$and" : [
            {participants : {"$ne" : user}}, 
            {public: true}
        ]})
        .populate('participants', 'username')
        .exec(cb);
}

RoomSchema.statics.getPublicRooms = function(cb) {
    this.find({public: true})
        .populate('participants', 'username')
        .exec(cb);
}

RoomSchema.statics.getByParticipants = function(participants, cb) {
    this.find({"participants" : {"$all" : participants}})
        .populate('participants', 'username')
        .exec(cb);
}

RoomSchema.statics.getParticipants = function(roomId, cb) {
    this.find({_id: roomId})
        .limit(1)
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