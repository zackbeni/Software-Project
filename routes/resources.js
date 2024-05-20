const express = require("express");
const router= express.Router()
const { isLoggedIn, isAdmin } = require("../middleware");
const { resourceIndex, newResourceForm, createResource, showResource, editResourceForm, updateResource, deleteResource, validateResource } = require("../controllers/resources");

//*************************Resources routes***************************** */


//show all resources route
router.get('/', resourceIndex)

//create a new resource routes
router.get('/new', isLoggedIn, isAdmin, newResourceForm);
router.post('/', isLoggedIn, validateResource, createResource)

//show a specific resource route
router.get('/:id', showResource)

//edit a specific resource routes
router.get('/:id/edit', isLoggedIn, isAdmin, editResourceForm);

router.put('/:id', isLoggedIn, isAdmin, validateResource, updateResource);

//Delete a specific resource
router.delete('/:id', isLoggedIn, deleteResource);

module.exports = router;