const resultModel = require('../model/resultModel');
const questionModel = require('../model/questionModel');
const pqlModel = require('../model/pollModel'); 
const sequelize = require('../../backend/db');
const { Mutex } = require('async-mutex');
const mutex = new Mutex();
// Create or update a result based on the answer
const createOrUpdateResult = async (data) => {
  const { answer, questionId } = data;
  const normalizedAnswer = answer.toLowerCase();
  //lock
  const release = await mutex.acquire();

  try {
    const question = await questionModel.findByPk(questionId, { include: [resultModel] });
    
    if (!question) {
      throw new Error('Question not found');
    }
    let result = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } });

    if (result) {
      await result.increment('total');
      await updateRatio(questionId);
      result = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } });
    } else {
      const totalResults = await resultModel.sum('total', { where: { questionId } }) || 0;
      result = await resultModel.create({
        answer: normalizedAnswer,
        questionId,
        total: 1,
        ratio: 1 / (totalResults + 1)
      });
      await updateRatio(questionId);
    }
    return result;
  } catch (error) {
    throw error;
  } finally {
    release();
  }
};

// Update ratio for all results of a question
const updateRatio = async (questionId) => {
  const results = await resultModel.findAll({ where: { questionId } });
  const totalResults = await resultModel.sum('total', { where: { questionId } });

  for (const result of results) {
    const newRatio = result.total / totalResults;
    await result.update({ ratio: newRatio });
  }
};


// Get all results by questionId
const getResultsByQuestionId = async (questionId) => {
  return await resultModel.findAll({ 
    where: { questionId }, 
    attributes: ['answer', 'total','ratio'] // Only include answer and ratio
  });
};

// Find all results by questionId
const findResultsByQuestionId = async (questionId) => {
  return await resultModel.findAll({ where: { questionId } });
};

// Find a result by ID
const findResultById = async (id) => {
  return await resultModel.findByPk(id);
};

// Delete a result by ID
const deleteResult = async (id) => {
  const result = await findResultById(id);
  if (result) {
    await result.destroy();
    return result;
  }
  return null;
};
const findPollIdByUniqueCode = async (uniqueCode) => {
	const poll = await pqlModel.findOne({ where: { uniqueCode } });
	if (!poll) {
	  throw new Error('Poll not found');
	}
	return poll.id;
  };
  const getQuestionsAndResultsByPollId = async (pollId) => {
    const questions = await questionModel.findAll({
      where: { pollId }
    });
    if (questions.length === 0) {
      throw new Error('No questions found for the given poll ID');
    }
    const results = {};
    for (const question of questions) {
      const questionResults = await resultModel.findAll({
      where: { questionId: question.id },
      attributes: ['answer', 'total', 'ratio']
      });
      results[question.id] = questionResults;
    }
    return { questions, results };
  };
  const getQuestionsAndResultsByUniqueCode = async (uniqueCode) => {
    const pollId = await findPollIdByUniqueCode(uniqueCode);
    return await getQuestionsAndResultsByPollId(pollId);
    };
module.exports = {
  findResultsByQuestionId,
  findResultById,
  createOrUpdateResult,
  deleteResult,
  getResultsByQuestionId,
  getQuestionsAndResultsByUniqueCode
};