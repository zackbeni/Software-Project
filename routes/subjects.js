const express = require("express");
const router= express.Router()

const { showAllSubjects, showSubject } = require("../controllers/subjects");

//*************************Subjects Routes***************************** */
//show all subjects
router.get('/', showAllSubjects);

//show a subject
router.get('/:id', showSubject);

module.exports = router;