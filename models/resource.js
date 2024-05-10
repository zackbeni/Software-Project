const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const resourceSchema = new Schema({
    source: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    url: String,
    image: String,
    subject: String,
    category: String,
    reviews: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
});
module.exports = mongoose.model('Resource', resourceSchema);


// const mp = new Map([
//     ['W3Schools', 'description1'],
//     ['TutorialsPoint', 'Description2']])
// console.log(mp)

// const bookmark = {
//     bookmarks: {
//         user: {
//             userId: 1
//         },
//         resource:{
//             resourceId: id
//         }
//     }
// }
//  const t = {
//     categories: 

//  }