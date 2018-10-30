const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define user schema
const UserSchema = new mongoose.Schema({
    local: {
        username: 'string',
        email   : 'string',
        password: 'string'
    }
})

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', UserSchema);