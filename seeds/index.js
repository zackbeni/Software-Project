const mongoose = require('mongoose');
const resourcesData = require('./resources')
const Resource = require('../models/resource');

mongoose.connect('mongodb://127.0.0.1:27017/project-test')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async ()=> {
    // empty database first
    await Resource.deleteMany({})
    for (let i = 0; i < resourcesData.length; i++){
        const r = new Resource({
            source: resourcesData[i].source,
            title: resourcesData[i].title,
            description: resourcesData[i].description,
            image: resourcesData[i].image,
            url: resourcesData[i].url,
            subject: resourcesData[i].subject,
            category: resourcesData[i].category
        })
        await r.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

// console.log(resourcesData[0].source)


