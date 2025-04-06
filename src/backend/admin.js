// routes/admin.js
const express = require('express');
const router = express.Router();
const Candidate = require('./models/candidate');
const VotingDate = require('./models/VotingDate');

// Route to add a candidate
router.post('/add-candidate', async (req, res) => {
  try {
    const { name, party } = req.body;
    const newCandidate = new Candidate({ name, party });
    await newCandidate.save();
    res.json({ success: true, message: "✅ Candidate saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to save candidate." });
  }
});

// Route to set voting dates
router.post('/set-dates', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    await VotingDate.deleteMany(); // Remove previous
    const dates = new VotingDate({ startDate, endDate });
    await dates.save();
    res.json({ success: true, message: "✅ Voting dates saved!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Failed to save voting dates." });
  }
});

module.exports = router;
