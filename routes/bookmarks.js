const express = require("express");
const router= express.Router()

const { isLoggedIn} = require("../middleware");
const { viewAllBookmarks, createBookmark, deleteBookmark } = require("../controllers/bookmarks");


//*************************Boomarks routes***************************** */
//view all bookmarks
router.get('/bookmarks', isLoggedIn, viewAllBookmarks)

//create a bookmark
router.post('/resources/:id/bookmarks', isLoggedIn, createBookmark);

//remove a bookmark
router.delete('/resources/:id/bookmarks/:bookmarkId', isLoggedIn, deleteBookmark);

//export the routes
module.exports = router