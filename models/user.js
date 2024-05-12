const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: Boolean
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

// db.users.findOneAndUpdate({_id: ObjectId('66400033d7d77499beb7689d')}, {$set: {isAdmin: true}})
// db.users.updateMany({$ne: {isAdmin: true}}, {$set: {isAdmin: false}})