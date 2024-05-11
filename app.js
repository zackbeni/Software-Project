const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const { resourceSchema } = require('./validationSchemas.js')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Resource = require('./models/resource');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')


const subjects =  ['Programming Languages', 'Databases', 'Web Technologies']
const categories = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'React', 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL']
const sources = ['W3Schools', 'TutorialsPoint', 'GeeksForGeeks', 'MDN']

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/project-test')

const validateResource = (req, res, next) =>{
    const { error } = resourceSchema.validate(req.body)
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
//add a new resource
app.get('/resources/new', (req, res) => {
    res.render('resources/new', { sources, subjects, categories });
})
app.post('/resources', validateResource, catchAsync(async (req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();
    res.redirect(`/resources/${resource._id}`)
}))

//show a specific resource
app.get('/resources/:id', catchAsync(async (req, res, next) => {
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/show', { resource })

}))

//edit a specific resource
app.get('/resources/:id/edit', async (req, res) =>{
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/edit', { resource, sources , subjects, categories})
})

//update a specific resource
app.put('/resources/:id', validateResource, async (req, res) => {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { ...req.body.resource });
    res.redirect(`/resources/${resource._id}`)
});

//Delete a specific resource
app.delete('/resources/:id', async (req, res) => {
    const { id } = req.params;
    // console.log(req.body.resource)
    const resource = await Resource.findByIdAndDelete(id, { ...req.body.resource });
    res.redirect(`/resources}`)
});

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