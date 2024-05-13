const express = require("express");
const app = express();
const router= express.Router()
const flash = require('connect-flash');

const { isLoggedIn, isAdmin } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Resource = require("../models/resource");
const Bookmark = require("../models/bookmark");
const { resourceSchema } = require("../validationSchemas");

//validate a resource again the joi schema
const validateResource = (req, res, next) =>{
    const { error } = resourceSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
}


const subjects =  ['Programming Languages', 'Databases', 'Web Technologies']
const categories = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'React', 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL']
const sources = ['W3Schools', 'TutorialsPoint', 'GeeksForGeeks', 'MDN']

//*************************Resources routes***************************** */

//show all resources route
router.get('/',catchAsync(async(req, res) => {
    const resources = await Resource.find({})
    const count = await Resource.find({category: 'JavaScript'}).countDocuments()
    // console.log(count)

    res.render('../views/resources/index', { resources })
}))

//create a new resource route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('resources/new', { sources, subjects, categories });
})
router.post('/', isLoggedIn, validateResource, catchAsync(async (req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();

    req.flash('success', 'Successfully created a new resource!!')
    res.redirect(`/resources/${resource._id}`)
}))

//show a specific resource route
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id }= req.params
    const resource = await Resource.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate({path: 'bookmarks',
        populate: {
            path: 'bookmarker'
        }
    });
    bookmarksCount = resource.bookmarks.length
    console.log(resource.bookmarks.length)
    //find the bookmark
    const bkmk = await Bookmark.find({resource: id, bookmarker: req.user})
    // console.log(bkmk.length)
    if(req.user && bkmk.length != 0){
        // console.log(bkmk)
        console.log(' I have run')
        return res.render('../views/resources/show', { resource, bkmk, isBookmarked: true, bookmarksCount})
    }
    res.render('../views/resources/show', { resource, isBookmarked: false, bookmarksCount})
}))

//edit a specific resource route
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(async (req, res) =>{
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/edit', { resource, sources , subjects, categories})
}));


//update a specific resource
router.put('/:id', isLoggedIn, validateResource, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { ...req.body.resource });
    req.flash('success', `Successfully updated ${resource.source} Tutorial resource!!`)
    res.redirect(`/resources/${resource._id}`)
}));

//Delete a specific resource
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id, { ...req.body.resource });
    // req.flash('success', 'Successfully deleted the resource!!')
    // res.redirect(`/resources`)
}));
module.exports = router