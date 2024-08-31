const resultModel = require('../model/resultModel');
const questionModel = require('../model/questionModel');
const sequelize = require('../../backend/db');
// Create or update a result based on the answer
const createOrUpdateResult = async (data) => {
  const { answer, questionId } = data;
  const normalizedAnswer = answer.toLowerCase();
  
  const transaction = await sequelize.transaction();

  try {
    const question = await questionModel.findByPk(questionId, { include: [resultModel] }, { transaction });
    
    if (!question) {
      throw new Error('Question not found');
    }

    let result = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } }, { transaction });

    if (result) {
      await result.increment('total', { transaction });
      await updateRatio(questionId, transaction);
      result = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } }, { transaction });
    } else {
      const totalResults = await resultModel.sum('total', { where: { questionId } }, { transaction });
      result = await resultModel.create({
        answer: normalizedAnswer,
        questionId,
        total: 1,
        ratio: 1 / (totalResults + 1)
      }, { transaction });
    }

    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Update ratio for all results of a question
const updateRatio = async (questionId, transaction) => {
  const results = await resultModel.findAll({ where: { questionId } }, { transaction });
  const totalResults = await resultModel.sum('total', { where: { questionId } }, { transaction });

  for (const result of results) {
    const newRatio = result.total / totalResults;
    await result.update({ ratio: newRatio }, { transaction });
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

module.exports = {
  findResultsByQuestionId,
  findResultById,
  createOrUpdateResult,
  deleteResult,
  getResultsByQuestionId
};
