'use strict';

const {Client} = require(`pg`);
const fs = require(`fs`);

const createDBSql = fs.readFileSync(`create-db.sql`).toString().split(`;`);

const client = new Client({
  host: `localhost`,
  port: 5434,
  user: `postgres`,
  password: `postgres`,
});

client.connect((err) => {
  if (err) {
    console.error(`connection error`, err.stack);
  } else {
    console.log(`connected`);
  }
});

createDBSql.forEach((query) => {
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.command);
    }
  });
});
