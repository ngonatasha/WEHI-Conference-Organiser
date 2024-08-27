const express = require('express');
const router = express.Router();
const pollService = require('../service/pollService');

// Create a new poll
router.post('/', async (req, res) => {
  try {
    const { uniqueCode } = req.body;

    const data = {
      uniqueCode
    };

    const newPoll = await pollService.createPoll(data);
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a poll by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const poll = await pollService.findPollById(id);
    if (poll) {
      res.status(200).json(poll);
    } else {
      res.status(404).json({ error: 'Poll not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await pollService.findAllPolls();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a poll by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedPoll = await pollService.updatePoll(id, updates);
    if (updatedPoll) {
      res.status(200).json(updatedPoll);
    } else {
      res.status(404).json({ error: 'Poll not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a poll by ID (and its associated questions)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await pollService.deletePoll(id);
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Poll not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
