const express = require("express");
const app = express();
const router= express.Router()
const flash = require('connect-flash');
const Sentiment = require('sentiment')

const { isLoggedIn, isReviewAuthor } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Review = require("../models/review");
const Resource = require("../models/resource");
const { reviewSchema } = require("../validationSchemas");


//check if review conforms to the review schema
const validateReview = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(error.message,400)
    }else{
        next()
    }
}

const preventDuplicateReviews = async(req, res, next)=>{
    console.log('**************************THE CHECK DUPLICATES REVIEW IS RUNNING*******************************')
    const { id } = req.params;
    const resource = await Resource.findById(id).populate({
        path: 'reviews',
        match: {author: {$eq: req.user._id}}
    })
    if(!resource.reviews.length){
        next()
    }else{
        req.flash('error', `You can not submit multiple reviews for ${resource.title}!`)
        res.redirect(`/resources/${resource._id}`)
    }

}


//*************************Reviews routes***************************** */
//create a resource review
router.post('/:id/reviews', isLoggedIn,  validateReview, preventDuplicateReviews, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const { body } = req.body.review
    const sentimentInstance = new Sentiment()
    const result = sentimentInstance.analyze(body)
    const{ score, comparative} = result
    req.body.review.score = score
    req.body.review.comparative = comparative

    console.log(req.body)
    const resource = await Resource.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    resource.reviews.push(review)
    await review.save();
    await resource.save();
    req.flash('success', `Successfully submitted a review for ${resource.title}!!`)
    res.redirect(`/resources/${resource._id}`)
}));

// Update a review on a specific resource
router.put('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId} = req.params
    const {body, rating} = req.body
    const sentimentInstance = new Sentiment()
    const result = sentimentInstance.analyze(body)
    const{ score, comparative} = result
    await Review.findByIdAndUpdate(reviewId, {
        body: body,
        rating: Number(rating),
        score: score,
        comparative: comparative
    })
    console.log('I am running in updat a review')
    console.log(Review)
}));

//delete a review on a specific resource
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId} = req.params
    await Resource.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', `Successfully deleted the review!!`)
    res.redirect(`/resources/${id}`);
}));
module.exports = router