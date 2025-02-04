const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const { resourceSchema, reviewSchema } = require('./validationSchemas.js')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash')
const Resource = require('./models/resource.js');
const Review = require('./models/review.js')
const Bookmark = require('./models/bookmark.js');
const ExpressError = require('./utils/ExpressError.js')
const catchAsync = require('./utils/catchAsync.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const { isLoggedIn, storeReturnTo, isAdmin, isReviewAuthor } = require('./middleware.js')


//Establish connection to Mongo
mongoose.connect('mongodb://127.0.0.1:27017/project-test')

//routes
const userRoutes = require('./routes/users.js');
const resourceRoutes = require('./routes/resources.js');
const reviewRoutes = require('./routes/reviews.js');
const subjectRoutes = require('./routes/subjects.js')
const categoryRoutes = require('./routes/categories.js')
const bookmarksRoutes = require('./routes/bookmarks.js');

//Views and Engines
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'))

//Session configuration
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


//Defining locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//*******************************Use Routes*************************** */
app.use('/', userRoutes);
app.use('/resources', resourceRoutes);
app.use('/resources', reviewRoutes);
app.use('/subjects', subjectRoutes);
app.use('/categories', categoryRoutes);
app.use('/', bookmarksRoutes);


//home page
app.get('/', async(req, res) => {
    // res.send('Welcome to the home page!')
    const resources = await Resource.find({})
    res.render('../views/home', { resources })
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {   
    const { statusCode = 500, message = 'Something went wrong'} = err
    // res.status(statusCode).send(message)
    res.render('../views/error', { err })
})

app.listen(4000, () => {
    console.log('Listening on port 4000 now')
})
