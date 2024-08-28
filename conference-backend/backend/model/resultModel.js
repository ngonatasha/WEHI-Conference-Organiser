const { DataTypes } = require('sequelize');
const sequelize = require('../../backend/db');
const questionModel = require('./questionModel'); 

const resultModel = sequelize.define('resultModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionId: {
    type: DataTypes.INTEGER,
    references: {
      model: questionModel, 
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  total:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ratio: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  schema: 'Conference_react',
  tableName: 'resultModel', 
  timestamps: false 
});

resultModel.belongsTo(questionModel, { foreignKey: 'questionId' });
questionModel.hasMany(resultModel, { foreignKey: 'questionId', onDelete: 'CASCADE' });

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created for resultModel!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = resultModel;
