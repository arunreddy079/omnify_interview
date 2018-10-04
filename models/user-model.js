const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleID: String,
    events: [String]
});

const User = mongoose.model('user', userSchema);


module.exports = User;