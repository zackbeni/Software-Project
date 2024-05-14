const express = require("express");
const router= express.Router()
const flash = require('connect-flash');

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
 
const Resource = require("../models/resource");


//show all subjects in the database
module.exports.showAllSubjects = catchAsync(async(req, res, next) => {
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
});

//show all categories under a subject in the database
module.exports.showSubject = catchAsync(async (req, res,next) => {
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
});