const resultModel = require('../model/resultModel');
const questionModel = require('../model/questionModel'); // 需要导入 questionModel 来获取总的结果数量
const { io } = require('../app'); // 导入 WebSocket 实例

// Create or update a result based on the answer
const createOrUpdateResult = async (data) => {
  const { answer, questionId } = data;
  const normalizedAnswer = answer.toLowerCase();
  const question = await questionModel.findByPk(questionId, { include: [resultModel] });
  
  if (!question) {
    throw new Error('Question not found');
  }

  let result = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } });

  if (result) {
    await result.increment('total');
    await updateRatio(questionId);
    const updatedResult = await resultModel.findOne({ where: { answer: normalizedAnswer, questionId } });
    return updatedResult;
  } else {
    const totalResults = await resultModel.sum('total', { where: { questionId } });
    const newResult = await resultModel.create({
      answer: normalizedAnswer,
      questionId,
      total: 1,
      ratio: 1 / (totalResults + 1) 
    });
    await updateRatio(questionId);
    return newResult;
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
    attributes: ['answer', 'ratio'] // Only include answer and ratio
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
