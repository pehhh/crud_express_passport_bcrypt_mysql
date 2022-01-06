const mysql = require('mysql')
const {promisify}=require('util')
// para ir viendo donde falla

const pool=mysql.createPool( {
    host:'localhost',
    user: 'root',
    password:'password',
    database:'database_links'
})

pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed.");
      }
      if (err.code === "ER_CON_COUNT_ERROR") {
        console.error("Database has to many connections");
      }
      if (err.code === "ECONNREFUSED") {
        console.error("Database connection was refused");
      }
    }
  
    if (connection) connection.release();
    console.log("DB is Connected");
  
    return;
  });
  //lo convertimos a promesas
  // Promisify Pool Querys
  pool.query = promisify(pool.query);

  module.exports=pool