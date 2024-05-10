const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Resource = require('./models/resource');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://127.0.0.1:27017/project-test')

app.get('/', async(req, res) => {
    // res.send('Welcome to the home page!')
    const resources = await Resource.find({})
    res.render('../views/resources/index', { resources })
})
//show all resources
app.get('/resources',async(req, res) => {
    const resources = await Resource.find({})
    const count = await Resource.find({category: 'JavaScript'}).countDocuments()
    console.log(count)

    res.render('../views/resources/index', { resources })
})
//add a new resource
app.get('/resources/new', (req, res) => {
    const subjects =  ['Programming Languages', 'Databases', 'Web Technologies']
    const categories = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'React', 'HTML', 'CSS', 'MongoDB', 'MySQL', 'PostgreSQL']
    const sources = ['W3Schools', 'TutorialsPoint', 'GeeksForGeeks', 'MDN']
    res.render('resources/new', { sources, subjects, categories });
})
app.post('/resources', async (req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();
    res.redirect(`/resources/${resource._id}`)
})

//show a specific resource
app.get('/resources/:id', async (req, res) => {
    const { id }= req.params
    const resource = await Resource.findById(id)
    
    res.render('../views/resources/show', { resource })
})

//edit a specific resource
app.get('/resources/:id/edit', async (req, res) =>{
    const { id }= req.params
    const resource = await Resource.findById(id)
    res.render('../views/resources/edit', { resource })
})

//update a specific resource
app.put('/resources/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body.resource)
    const resource = await Resource.findByIdAndUpdate(id, { ...req.body.resource });
    res.redirect(`/resources/${resource._id}`)
});

//update a specific resource
app.delete('/resources/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body.resource)
    const resource = await Resource.findByIdAndDelete(id, { ...req.body.resource });
    res.redirect(`/resources/${resource._id}`)
});

//show all subjects
app.get('/subjects', async(req, res) => {
    const resources = await Resource.find()
    const subjects = new Set()
    for(let r of resources ){
        subjects.add(r.subject)
    }
    res.render('../views/subjects/index', { subjects })
})
app.get('/subjects/:id', async (req, res) => {
    const { id } = req.params
    const resources = await Resource.find({subject: id}, 'category')
    const categories = new Set()

    // console.log(resources.categorisation[0])
    for (let r of resources){
        // console.log(r.categorisation[0])
        categories.add(r.category)
    }
    console.log(id)
    console.log(resources)
    res.render('../views/subjects/show', { categories })
})
//show all categories
app.get('/categories', async(req, res) => {
    const resources = await Resource.find({}, 'category')
    const categories = new Set()
    for(let r of resources ){
        categories.add(r.category)
    }
    console.log(resources)
    res.render('../views/categories/index', { categories })
})

//show a single category
app.get('/categories/:id', async(req, res) => {
    const { id } = req.params
    const resources = await Resource.find({category: id})
    res.render('../views/categories/show', { resources })
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})

// const category = document.querySelector('#category').value