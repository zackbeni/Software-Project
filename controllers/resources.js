const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Resource = require("../models/resource");
const {subjects, categories, sources} = require("../models/resource");
const Bookmark = require("../models/bookmark");
const { resourceSchema } = require("../validationSchemas");

//validate a resource again the joi schema
module.exports.validateResource = (req, res, next) =>{
    const { error } = resourceSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
};
module.exports.resourceIndex = catchAsync(async(req, res) => {
    const resources = await Resource.find({})
    const count = await Resource.find({category: 'JavaScript'}).countDocuments()

    res.render('../views/resources/index', { resources })
});

module.exports.newResourceForm = (req, res) => {
    res.render('resources/new', { sources, subjects, categories });
};

module.exports.createResource = catchAsync(async (req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();

    req.flash('success', 'Successfully created a new resource!!')
    res.redirect(`/resources/${resource._id}`)
});

module.exports.showResource = catchAsync(async (req, res, next) => {
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
});
module.exports.editResourceForm = catchAsync(async (req, res) =>{
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/edit', { resource, sources , subjects, categories})
});
module.exports.updateResource = catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { ...req.body.resource });
    req.flash('success', `Successfully updated ${resource.source} Tutorial resource!!`)
    res.redirect(`/resources/${resource._id}`)
});


module.exports.deleteResource = catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id, { ...req.body.resource });
    req.flash('success', 'Successfully deleted the resource!!')
    res.redirect(`/resources`)
});