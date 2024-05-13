const express = require("express");
const router= express.Router()
const flash = require('connect-flash');

const { isLoggedIn} = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Bookmark = require("../models/bookmark");
const Resource = require("../models/resource");


//*************************Boomarks routes***************************** */
//view all bookmarks
router.get('/bookmarks', isLoggedIn, catchAsync(async (req, res)=> {
    console.log('*****************YOU HAVE HIT THE VIEW ALL BOOKMARKS ROUTE')
    // const arr = ['663d6811d3e91886db02df22', '663d6811d3e91886db02df26']
    const resIds = []
    const query = await Bookmark.find({bookmarker: req.user})
    query.map((e) => {
        resIds.push(e.resource)
    })
    const bookmarks = await Resource.find({_id: {$in: resIds }})
    console.log(bookmarks)
    res.render('../views/bookmarks/index', { bookmarks })
}))

//create a bookmark
router.post('/resources/:id/bookmarks', isLoggedIn, catchAsync(async(req, res) =>{
    console.log('I am receiving requests!')
    console.log(req.params)
    const { id, isBookmarked } = req.params;
    const resource = await Resource.findById(id)
    const bookmark = new Bookmark({isBookmarked: isBookmarked, resource: id})
    bookmark.bookmarker = req.user._id
    resource.bookmarks.push(bookmark)
    // console.log(bookmark)
    await bookmark.save();
    await resource.save();
    req.flash('success', `Successfully bookmarked ${resource.title}!!`)
    res.send({isBookmarked:  bookmark._id})
    // res.redirect(`/resources/${id}`);

}));

//remove a bookmark
router.delete('/resources/:id/bookmarks/:bookmarkId', isLoggedIn, catchAsync(async (req, res) => {
    console.log('Delete bookmark route is hit!')
    console.log(req.params)
    const { id, bookmarkId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {bookmarks: bookmarkId}})
    await Bookmark.findByIdAndDelete(bookmarkId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);

}));

//export the routes
module.exports = router