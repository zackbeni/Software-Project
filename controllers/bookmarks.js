const express = require("express");
const router= express.Router()
const flash = require('connect-flash');

const { isLoggedIn} = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Bookmark = require("../models/bookmark");
const Resource = require("../models/resource");


module.exports.viewAllBookmarks = catchAsync(async (req, res)=> {
    const resIds = []
    const query = await Bookmark.find({bookmarker: req.user})
    query.map((e) => {
        resIds.push(e.resource)
    })
    const bookmarks = await Resource.find({_id: {$in: resIds }})
    res.render('../views/bookmarks/index', { bookmarks })
});

module.exports.createBookmark = catchAsync(async(req, res) =>{
    const { id, isBookmarked } = req.params;
    const resource = await Resource.findById(id)
    const bookmark = new Bookmark({isBookmarked: isBookmarked, resource: id})
    bookmark.bookmarker = req.user._id
    resource.bookmarks.push(bookmark)
    await bookmark.save();
    await resource.save();
    res.send({isBookmarked:  bookmark._id})
});

module.exports.deleteBookmark = catchAsync(async (req, res) => {
    console.log('Delete bookmark route is hit!')
    console.log(req.params)
    const { id, bookmarkId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {bookmarks: bookmarkId}})
    await Bookmark.findByIdAndDelete(bookmarkId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);
});