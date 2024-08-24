const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('clapper', 'zheyuanw', '872188810Kk', {
  host: '172.23.36.89',
  dialect: 'postgres', 
});

module.exports = sequelize;