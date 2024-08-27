const questionModel = require('../model/questionModel'); 

// Create a new record
const createQuestion = async (data) => {
  try {
      const newQuestion = await questionModel.create({
          questionType: data.questionType, 
          questionDescription: data.questionDescription, 
          questionImage: data.questionImage, 
          choices: data.choices,
          pollId: data.pollId 
      });
      return newQuestion;
  } catch (error) {
    console.log(data)
      throw new Error(`Error creating question: ${error.message}`);
  }
};


// Find a question by ID
async function findQuestionById(id) {
  try {
    const question = await questionModel.findByPk(id);
    return question;
  } catch (error) {
    throw new Error('Error finding question: ' + error.message);
  }
}
const findAllQuestions = async () => {
    try {
      const questions = await questionModel.findAll();
      return questions;
    } catch (error) {
      throw new Error('Error fetching questions: ' + error.message);
    }
  };

// Update a question by ID
async function updateQuestion(id, updates) {
  try {
    const [updated] = await questionModel.update(updates, {
      where: { id }
    });
    if (updated) {
      return await findQuestionById(id);
    }
    throw new Error('Question not found');
  } catch (error) {
    throw new Error('Error updating question: ' + error.message);
  }
}

// Delete a question by ID
async function deleteQuestion(id) {
  try {
    const deleted = await questionModel.destroy({
      where: { id }
    });
    if (deleted) {
      return true;
    }
    throw new Error('Question not found');
  } catch (error) {
    throw new Error('Error deleting question: ' + error.message);
  }
}

module.exports = {
  createQuestion,
  findQuestionById,
  updateQuestion,
  deleteQuestion,
  findAllQuestions
};
