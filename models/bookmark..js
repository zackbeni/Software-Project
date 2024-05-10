const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookmarkSchema = new Schema({

    //this map should include userID, resourceID, Category, Subject
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resource: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    },
    isBookmarked: Boolean

});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
