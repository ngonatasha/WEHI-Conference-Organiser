const express = require('express');
const router = express.Router();
const resultService = require('../service/resultService');
// Get questions and results by unique code
router.get('/poll/:uniqueCode', async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const { questions, results } = await resultService.getQuestionsAndResultsByUniqueCode(uniqueCode);
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this unique code.' });
    }
    res.status(200).json({ questions, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;