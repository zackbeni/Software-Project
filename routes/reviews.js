const express = require("express");
const router= express.Router()
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { validateReview, preventDuplicateReviews, createReview, updateReview, deleteReview } = require("../controllers/reviews");

//*************************Reviews routes***************************** */
//create a resource review
router.post('/:id/reviews', isLoggedIn,  validateReview, preventDuplicateReviews, createReview);

// Update a review on a specific resource
router.put('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, updateReview);

//delete a review on a specific resource
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);
module.exports = router;