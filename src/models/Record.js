// models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  // Add more fields as needed for your record model
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
