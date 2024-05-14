const express = require("express");
const router= express.Router()

const { showAllCategories, showCategory } = require("../controllers/categories");

//*************************Categories routes***************************** */
//show all categories
router.get('/', showAllCategories);

//show a single category
router.get('/:id', showCategory);

module.exports = router;