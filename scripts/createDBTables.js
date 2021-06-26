'use strict';

const {Client} = require(`pg`);
const fs = require(`fs`);

const createTablesSql = fs.readFileSync(`schema.sql`).toString().split(`;`);

const client = new Client({
  host: `localhost`,
  port: 5434,
  database: `typoteka`,
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

createTablesSql.forEach((query) => {
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.command);
    }
  });
});
