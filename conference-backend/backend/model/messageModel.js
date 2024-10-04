const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const pollModel = require('./pollModel'); 
const messageModel = sequelize.define('messageModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,          
    allowNull: false                
  },

  pollId: {
    type: DataTypes.INTEGER,
    references: {
      model: pollModel, 
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
//   isEdited: {
//     type: DataTypes.BOOLEAN,      
//     defaultValue: false             
//   },
//   isDeleted: {
//     type: DataTypes.BOOLEAN,        
//     defaultValue: false             
//   }
  
});
messageModel.belongsTo(pollModel, { foreignKey: 'pollId' });
pollModel.hasMany(messageModel, { foreignKey: 'pollId', onDelete: 'CASCADE' })
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created for messageModels!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
module.exports = messageModel;