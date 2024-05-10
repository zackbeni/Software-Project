const joi= require('joi')
module.exports.resourceSchema = joi.object({
    resource: joi.object({
        source: joi.string().required(),
        title: joi.string().required(),
        url: joi.string().required(),
        image: joi.string().required(),
        description: joi.string().required()
    }).required()
})