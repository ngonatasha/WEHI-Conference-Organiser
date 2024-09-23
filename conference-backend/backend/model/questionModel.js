const { DataTypes } = require('sequelize');
const sequelize = require('../../backend/db');
const pollModel = require('./pollModel'); 
const questionModel = sequelize.define('questionModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  questionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionDescription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  questionImage: {
    type: DataTypes.BLOB('long'), 
    allowNull: true
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: true
  },
  pollId: {
    type: DataTypes.INTEGER,
    references: {
      model: pollModel, 
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  }
});
questionModel.belongsTo(pollModel, { foreignKey: 'pollId' });
pollModel.hasMany(questionModel, { foreignKey: 'pollId', onDelete: 'CASCADE' })
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created for questionModels!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
module.exports = questionModel;
