// dbConfig.js
const mysql = require('mysql');

const dbOptions = {
  host: 'prueba.cgfgqrpgf8vd.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'Lolasso2232',
  database: 'proyecto'
};

const createConnection =()=> {
  return mysql.createConnection(dbOptions);
}

module.exports = {
  createConnection
};
