const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("postgres://udrappds5d8tkk:p04ab1ac60c4bb98c95938364ae31673e65fb2e14dd256bd1f45ce6a5213ec1d5@cd1goc44htrmfn.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d29e8n00ian76i", {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: true, 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});

module.exports = sequelize;

// How to query the database through psql or pgadmin

// 1. install postgres locally (to have psql shell) or any other form of DB query tool
// 2. enter below credentials to connect to the database
// 3. to see all the tables run
//        SELECT table_name 
//        FROM information_schema.tables
//        WHERE table_schema = 'public';


// username : udrappds5d8tkk
// password : p04ab1ac60c4bb98c95938364ae31673e65fb2e14dd256bd1f45ce6a5213ec1d5
// host/server name : cd1goc44htrmfn.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com
// port : 5432
// DB name : d29e8n00ian76i
