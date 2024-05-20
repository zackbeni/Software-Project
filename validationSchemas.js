const joi= require('joi')
module.exports.resourceSchema = joi.object({
    resource: joi.object({
        source: joi.string().required(),
        title: joi.string().required(),
        url: joi.string().required(),
        description: joi.string().required(),
        subject: joi.string().required(),
        category: joi.string().required()
    }).required()
});
module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
    
})