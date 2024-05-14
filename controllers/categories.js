const express = require("express");
const router= express.Router()
const flash = require('connect-flash');

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
 
const Resource = require("../models/resource");

//show all categories
module.exports.showAllCategories = catchAsync(async(req, res) => {
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
});

//show a single category and resources under it
module.exports.showCategory = catchAsync(async(req, res) => {
    const { id } = req.params
    const cat =  {category: id}
    const resources = await Resource.find({category: id})
    res.render('../views/categories/show', { resources, cat })
})