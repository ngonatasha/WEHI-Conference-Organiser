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
  
}, {
  schema: 'Conference_react',
  tableName: 'pollModel', 
  timestamps: false 
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
module.exports = pollModel;