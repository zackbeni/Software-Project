const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            unique: true,
            ref: 'Review'
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Bookmark'
        }
    ],
});

resourceSchema.post('findOneAndDelete', async function (doc) {
    console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

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