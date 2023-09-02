const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Record = require("../models/Record");

exports.createRecord = async (req, res) => {
	try {
		const { name, description, category, active } = req.body;

		// Create a new record object
		const newRecord = new Record({
			name,
			description,
			category,
			active,
		});

		// Save the record to the database
		await newRecord.save();

		res.status(201).json({ message: "Record created successfully." });
	} catch (error) {
		console.error("Record creation error:", error);
		res
			.status(500)
			.json({ error: "An error occurred while creating the record." });
	}
};

exports.getRecords = async (req, res) => {
	try {
		// Fetch all records from the database
		const records = await Record.find();
		res.status(200).json(records);
	} catch (error) {
		console.error("Error fetching records:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching records." });
	}
};

exports.getRecordByID = async (req, res) => {
	try {
		const recordId = req.params.id;

		// Fetch the record by its unique ID from the database
		const record = await Record.findById(recordId);

		if (!record) {
			return res.status(404).json({ error: "Record not found." });
		}

		res.status(200).json(record);
	} catch (error) {
		console.error("Error fetching record by ID:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching the record." });
	}
};
