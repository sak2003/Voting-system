// src/backend/models/VotingDate.js

const mongoose = require('mongoose');

const votingDateSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('VotingDate', votingDateSchema);
