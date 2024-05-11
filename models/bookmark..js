const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookmarkSchema = new Schema({

    //this will just tick to true or false once bookmarked button is clicked. Once a bookmark record is saved, it shouldn'tbe deleted. Ony the boolean field should be changed.
    bookmarked: Boolean,
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
