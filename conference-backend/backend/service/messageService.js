// messageService.js
const messageModel = require('../model/messageModel'); 

const createMessage = async (content, pollId) => {
  try {
    const newMessage = await messageModel.create({
      content,
      pollId,
    });
    return newMessage;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

const getMessagesByPollId = async (pollId) => {
  try {
    const messages = await messageModel.findAll({
      where: { pollId },
      order: [['createdAt', 'ASC']], 
    });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; 
  }
};

module.exports = {
  createMessage,
  getMessagesByPollId,
};
