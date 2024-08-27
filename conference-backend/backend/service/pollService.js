const pollModel = require('../model/pollModel');
const questionModel = require('../model/questionModel');

// Create a new poll
const createPoll = async (data) => {
  try {
    const newPoll = await pollModel.create({
      uniqueCode: data.uniqueCode
    });
    return newPoll;
  } catch (error) {
    throw new Error(`Error creating poll: ${error.message}`);
  }
};

// Find a poll by ID
const findPollById = async (id) => {
  try {
    const poll = await pollModel.findByPk(id);
    return poll;
  } catch (error) {
    throw new Error('Error finding poll: ' + error.message);
  }
};

// Find all polls
const findAllPolls = async () => {
  try {
    const polls = await pollModel.findAll();
    return polls;
  } catch (error) {
    throw new Error('Error fetching polls: ' + error.message);
  }
};

// Update a poll by ID
const updatePoll = async (id, updates) => {
  try {
    const [updated] = await pollModel.update(updates, {
      where: { id }
    });
    if (updated) {
      return await findPollById(id);
    }
    throw new Error('Poll not found');
  } catch (error) {
    throw new Error('Error updating poll: ' + error.message);
  }
};

// Delete a poll by ID 
const deletePoll = async (id) => {
  try {
    const deleted = await pollModel.destroy({
      where: { id }
    });
    if (deleted) {
      return true;
    }
    throw new Error('Poll not found');
  } catch (error) {
    throw new Error('Error deleting poll: ' + error.message);
  }
};

module.exports = {
  createPoll,
  findPollById,
  updatePoll,
  deletePoll,
  findAllPolls
};
