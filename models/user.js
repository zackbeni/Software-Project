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

const test = [
    {
        id: 1,
        title: 'W3Schools',
        JavaScript: {
            description: 'test',
            url: `https://www.w3schools.com/js/default.asp`
        }
    },
    {
        id: 2,
        title: 'W3Schools',
        Python: {
            description: 'test1',
            url: `https://www.w3schools.com/python/default.asp`
        }
    }]
console.log(test[0].JavaScript.url)