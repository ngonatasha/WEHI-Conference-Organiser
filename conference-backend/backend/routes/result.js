const express = require('express');
const router = express.Router();
const resultService = require('../service/resultService'); // Service layer for CRUD logic
const { io } = require('../app'); // Import WebSocket instance

// Create a new result
router.post('/', async (req, res) => {
  try {
    const { answer, questionId } = req.body;
    const newResult = await resultService.createOrUpdateResult({ answer, questionId });

    // Notify all clients about the new result
    console.log("pass1")
    io.emit('resultCreated', await resultService.getResultsByQuestionId(questionId));
    console.log("pass2")

    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all results for a specific question
router.get('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const results = await resultService.getResultsByQuestionId(questionId);
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ error: 'No results found for this question' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a result by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await resultService.findResultById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a result by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedResult = await resultService.updateResult(id, updates);
    if (updatedResult) {
      // Notify all clients about the updated results
      const questionId = updatedResult.questionId; // Assuming the result has a questionId field
      io.emit('resultUpdated', await resultService.getResultsByQuestionId(questionId));
      res.status(200).json(updatedResult);
    } else {
      res.status(404).json({ error: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a result by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedResult = await resultService.deleteResult(id);
    if (deletedResult) {
      // Notify all clients about the updated results after deletion
      io.emit('resultDeleted', await resultService.getResultsByQuestionId(deletedResult.questionId));
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
