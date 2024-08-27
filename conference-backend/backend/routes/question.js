const express = require('express');
const router = express.Router();
const questionService = require('../service/questionService');
const pollService = require('../service/pollService');

// Create a new question
router.post('/', async (req, res) => {
  try {
    const { questionType, questionDescription, choices,pollId } = req.body;
    const questionImage = req.file ? req.file.buffer : null; 

    const data = {
      questionType,
      questionDescription,
      questionImage,
      choices,
      pollId
    };
    
    const newQuestion = await questionService.createQuestion(data);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/uni/:uniqueCode', async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const questions = await pollService.findQuestionsByPollUniqueCode(uniqueCode);
    if (questions.length > 0) {
      res.status(200).json(questions);
    } else {
      res.status(404).json({ error: 'No questions found for this poll' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Get a question by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const question = await questionService.findQuestionById(id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const questions = await questionService.findAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a question by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedQuestion = await questionService.updateQuestion(id, updates);
    if (updatedQuestion) {
      res.status(200).json(updatedQuestion);
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a question by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await questionService.deleteQuestion(id);
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

