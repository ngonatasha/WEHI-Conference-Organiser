const { DataTypes } = require('sequelize');
const sequelize = require('../../backend/db');
const pollModel = sequelize.define('pollModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uniqueCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created for pollModels!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
module.exports = pollModel;