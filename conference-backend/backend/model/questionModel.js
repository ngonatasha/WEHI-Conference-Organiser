const { DataTypes } = require('sequelize');
const sequelize = require('../../backend/db');
const questionModel = sequelize.define('questionModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Open question', 'Multiple Choice'),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.BLOB('long'), 
    allowNull: true
  }
}, {
  tableName: 'questionModel', 
  timestamps: false 
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
module.exports = questionModel;
