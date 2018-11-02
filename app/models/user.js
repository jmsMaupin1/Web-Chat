const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define user schema
const UserSchema = new mongoose.Schema({
    username  : {type: String},
    email     : {type: String},
    password  : {type: String},
    socket_id : {type: String},
    online    : {type: Boolean}
})

// Instance Methodss 
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// Static Methods
// TODO: when user connects update online to true and socket_id to connected socket.id
//       When user disconnects update online to false and socket_id to empty
UserSchema.statics.updateUser = function(userId, update, cb) {
	this.findOneAndUpdate({_id: userId}, update, {new: true}, (err, user) => {
        cb(err, {
            _id       : user._id,
            username  : user.username,
            online    : user.online,
            socket_id : user.socket_id
        });
    });
}

module.exports = mongoose.model('User', UserSchema);