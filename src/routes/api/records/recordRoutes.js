const express = require('express');
const router = express.Router();
const passport = require('passport');
const recordController = require('../../../controllers/recordController');
const isAuthenticated = require('../../../middleware/authMiddleware');


// Create a new record
router.post('/', passport.authenticate("jwt", { session: false }), recordController.createRecord);

//Update a record by id
router.put('/update/:id', passport.authenticate("jwt", { session: false }), recordController.updateRecord);

//Delete a record by id
router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), recordController.deleteRecord);

// Retrieve a list of records
router.get('/', passport.authenticate("jwt", { session: false }), recordController.getRecords);

// Retrieve a single record by ID
router.get('/:id', passport.authenticate("jwt", { session: false }), recordController.getRecordByID);

// Endpoint to filter and search user records
router.get("/searchByActiveOrNot", passport.authenticate("jwt", { session: false }), recordController.searchByActiveOrNot);

module.exports = router;

