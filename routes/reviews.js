const express = require("express");
const app = express();
const router= express.Router()
const flash = require('connect-flash');

const { isLoggedIn, isReviewAuthor } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Review = require("../models/review");
const Resource = require("../models/resource");
const { reviewSchema } = require("../validationSchemas");



//validatore a review
const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
}

//*************************Reviews routes***************************** */
//create a resource review
router.post('/:id/reviews', isLoggedIn,  validateReview, catchAsync(async(req, res) =>{
    console.log('*************************CREATE REVIEW ROUTE HAS BEEN HIT*******************************')
    const { id } = req.params;
    const resource = await Resource.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    resource.reviews.push(review)
    await review.save();
    await resource.save();
    req.flash('success', `Successfully submitted a review for ${resource.title}!!`)
    res.redirect(`/resources/${resource._id}`)
}));
//delete a review on a specific resource
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    console.log('*************************DELETE REVIEW ROUTE HAS BEEN HIT*******************************')

    const { id, reviewId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);
}));
module.exports = router