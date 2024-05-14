const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const Bookmark = require('./bookmark')
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

//delete related reviews
resourceSchema.post('findOneAndDelete', async function (doc) {
    console.log("DELETED!!!!")
    console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
// delete related bookmarks
resourceSchema.post('findOneAndDelete', async function (doc) {
    console.log('ALL BOOKMARKS HAVE BEEN DELETED')
    console.log(doc)
    if (doc) {
        await Bookmark.deleteMany({
            _id: {
                $in: doc.bookmarks
            }
        })
    }
})

module.exports = mongoose.model('Resource', resourceSchema);
module.exports.subjects = [
    'Programming Languages', 'Databases', 'Web Technologies']
module.exports.categories = [
    'JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'React'
    , 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL'
]
module.exports.sources = [
    'W3Schools', 'TutorialsPoint', 'GeeksForGeeks', 'MDN'
]