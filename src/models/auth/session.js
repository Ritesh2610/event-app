const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    email:{type:String},
    token:{type:String},
    from:{type:Date},
    to:{type:Date},
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;