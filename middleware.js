const Resource = require('./models/resource');
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.url
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        // console.log('from return to', req)
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};
module.exports.isAdmin  = async(req, res, next) =>{
    const { id } = req.params
    const resource = Resource.findById(id)
    if(req.user && req.user.isAdmin){
        next();
    }else{
        req.flash('error', 'You are not authorised!')
        res.redirect(`/resources/${id}`)
    }

};
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/resources/${id}`);
    }
    next();
}
