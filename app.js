const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const { resourceSchema, reviewSchema } = require('./validationSchemas.js')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash')
const Resource = require('./models/resource');
const Review = require('./models/review')
const Bookmark = require('./models/bookmark');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn, storeReturnTo, isAdmin, isReviewAuthor } = require('./middleware')



//routes
const userRoutes = require('./routes/users');
const { match } = require('assert');
const { type } = require('os');



const subjects =  ['Programming Languages', 'Databases', 'Web Technologies']
const categories = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'React', 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL']
const sources = ['W3Schools', 'TutorialsPoint', 'GeeksForGeeks', 'MDN']

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'))


//session configuration
const sessionConfig = {
    secret: 'configure later',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 1000 * 60 * 60 * 24 * 7,
        maxAage: 1000 * 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// user authentication and authorisation
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//user routes
app.use('/', userRoutes);



mongoose.connect('mongodb://127.0.0.1:27017/project-test')

const validateResource = (req, res, next) =>{
    const { error } = resourceSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
}
const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
}
app.get('/', async(req, res) => {
    // res.send('Welcome to the home page!')
    const resources = await Resource.find({})
    res.render('../views/resources/index', { resources })
})
//show all resources
app.get('/resources',async(req, res) => {
    const resources = await Resource.find({})
    const count = await Resource.find({category: 'JavaScript'}).countDocuments()
    // console.log(count)

    res.render('../views/resources/index', { resources })
})
//create a new resource
app.get('/resources/new', isLoggedIn, (req, res) => {
    res.render('resources/new', { sources, subjects, categories });
})
app.post('/resources', isLoggedIn, validateResource, catchAsync(async (req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();

    req.flash('success', 'Successfully created a new resource!!')
    res.redirect(`/resources/${resource._id}`)
}))

//show a specific resource
app.get('/resources/:id', catchAsync(async (req, res, next) => {
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


    //find the bookmark
    const bkmk = await Bookmark.find({resource: id, bookmarker: req.user})
    console.log(bkmk.length)
    if(req.user && bkmk.length != 0){
        // console.log(bkmk)
        console.log(' I have run')
        return res.render('../views/resources/show', { resource, bkmk, isBookmarked: true})
    }
    res.render('../views/resources/show', { resource, isBookmarked: false})
}))

//edit a specific resource
app.get('/resources/:id/edit', isLoggedIn, isAdmin, catchAsync(async (req, res) =>{
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/edit', { resource, sources , subjects, categories})
}));

//update a specific resource
app.put('/resources/:id', isLoggedIn, validateResource, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { ...req.body.resource });
    req.flash('success', `Successfully updated ${resource.source} Tutorial resource!!`)
    res.redirect(`/resources/${resource._id}`)
}));

//Delete a specific resource
app.delete('/resources/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id, { ...req.body.resource });
    req.flash('success', 'Successfully deleted the resource!!')
    res.redirect(`/resources`)
}));

//create a resource review
app.post('/resources/:id/reviews', isLoggedIn,  validateReview, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const resource = await Resource.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    resource.reviews.push(review)
    await review.save();
    await resource.save();
    req.flash('success', `Successfully submitted a review for ${resource.title}!!`)
    res.redirect(`/resources/${resource._id}`)
}))

//delete a review on a specific resource
app.delete('/resources/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);
}))

//view all bookmarks
app.get('/bookmarks', catchAsync(async (req, res)=> {
    // const arr = ['663d6811d3e91886db02df22', '663d6811d3e91886db02df26']
    const resIds = []
    const query = await Bookmark.find({bookmarker: '6640e6b41c41bfe241701cb8'})
    query.map((e) => {
        resIds.push(e.resource)
    })
    const bookmarks = await Resource.find({_id: {$in: resIds }})
    console.log(bookmarks)
    res.render('../views/bookmarks/index', { bookmarks })
}))
//create a bookmark
app.post('/resources/:id/bookmarks', catchAsync(async(req, res) =>{
    console.log('I am receiving requests!')
    console.log(req.params)
    const { id, isBookmarked } = req.params;
    const resource = await Resource.findById(id)
    const bookmark = new Bookmark({isBookmarked: isBookmarked, resource: id})
    bookmark.bookmarker = req.user._id
    resource.bookmarks.push(bookmark)
    console.log(bookmark)
    await bookmark.save();
    await resource.save();
    req.flash('success', `Successfully bookmarked ${resource.title}!!`)
    res.send({isBookmarked:  bookmark._id})
    // res.redirect(`/resources/${id}`);

}));

//remove a bookmark
app.delete('/resources/:id/bookmarks/:bookmarkId', catchAsync(async (req, res) => {
    console.log('Delete bookmark route is hit!')
    console.log(req.params)
    const { id, bookmarkId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {bookmarks: bookmarkId}})
    await Bookmark.findByIdAndDelete(bookmarkId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);

}));

//show all subjects
app.get('/subjects', async(req, res) => {
    const resources = await Resource.find()
    const subjects = new Set()
    const counts = new Map()
    for(let r of resources ){
        subjects.add(r.subject)
    }
    for(let s of subjects){
        const count = await Resource.countDocuments({subject: s})
        counts.set(s, count)
    }
    res.render('../views/subjects/index', { subjects, counts })
})
//show a subject
app.get('/subjects/:id', catchAsync(async (req, res,next) => {
    const { id } = req.params
    const sub = {subject: id}
    const resources = await Resource.find({subject: id})
    if(resources.length == 0){
        next(new ExpressError(`Subject "${id}" was not found`,404))
    }
    const categories = new Set()
    for (let r of resources){
        categories.add(r.category)
    }
    res.render('../views/subjects/show', { categories, sub, resources })
}))
//show all categories
app.get('/categories', async(req, res) => {
    const resources = await Resource.find({}, 'category')
    const categories = new Set()
    const counts = new Map()
    for(let r of resources){
        categories.add(r.category)
    }
    for(let c of categories){
        const count = await Resource.countDocuments({category: c})
        counts.set(c, count)
    }
    res.render('../views/categories/index', { categories, counts })
})

//show a single category
app.get('/categories/:id', async(req, res) => {
    const { id } = req.params
    const cat =  {category: id}
    const resources = await Resource.find({category: id})
    res.render('../views/categories/show', { resources, cat })
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {   
    const { statusCode = 500, message = 'Something went wrong'} = err
    // res.status(statusCode).send(message)
    res.render('../views/error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})