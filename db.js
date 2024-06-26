/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

let db = new Client({
  connectionString: "postgresql://postgres:2002@127.0.0.1:5432/biztime"
});

db.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected to the database');
  }
});

module.exports = db;