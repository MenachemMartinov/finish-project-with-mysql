const mysql = require("mysql");


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    return console.error(err);
  }

  console.log("connected to mysql successfully");
});

// TODO: export function which will return a promise and perform queries
module.exports = connection;
