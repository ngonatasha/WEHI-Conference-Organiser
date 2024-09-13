const questionModel = require('../model/questionModel');
const resultModel = require('../model/resultModel');
const pqlModel = require('../model/pollModel'); // Assuming pqlModel is defined as you mentioned

// Find poll ID by unique code
const findPollIdByUniqueCode = async (uniqueCode) => {
	const poll = await pqlModel.findOne({ where: { uniqueCode } });
	if (!poll) {
	  throw new Error('Poll not found');
	}
	return poll.id;
  };
  
// Get questions and results by poll ID
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
  
// Get all questions and results by unique code
const getQuestionsAndResultsByUniqueCode = async (uniqueCode) => {
const pollId = await findPollIdByUniqueCode(uniqueCode);
return await getQuestionsAndResultsByPollId(pollId);
};

module.exports = {
getQuestionsAndResultsByUniqueCode
};