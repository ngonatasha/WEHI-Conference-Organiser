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
// Find a poll by uniqueCode
const findPollByUniqueCode = async (uniqueCode) => {
  try {
    const poll = await pollModel.findOne({
      where: { uniqueCode }
    });
    return poll;
  } catch (error) {
    throw new Error('Error finding poll by uniqueCode: ' + error.message);
  }
};
// Find all questions for a poll by uniqueCode
const findQuestionsByPollUniqueCode = async (uniqueCode) => {
  try {
    const poll = await findPollByUniqueCode(uniqueCode);
    if (!poll) {
      throw new Error('Poll not found');
    }

    const questions = await questionModel.findAll({
      where: { pollId: poll.id }
    });
    return questions;
  } catch (error) {
    throw new Error('Error finding questions by poll uniqueCode: ' + error.message);
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
const deletePoll = async (uniqueCode) => {
  try {
    const deleted = await pollModel.destroy({
      where: {uniqueCode }
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
  findAllPolls,
  findPollByUniqueCode,
  findQuestionsByPollUniqueCode,
};
