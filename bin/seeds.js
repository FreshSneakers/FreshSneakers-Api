require('dotenv').config();
const mongoose = require("mongoose");
const faker = require("faker");
const User = require("../models/User.model");
const Products = require("../models/Products.model");
const sneakers = require("../data/sneakers");
require("../config/db.config");

mongoose.connection.once("open", () => {
  console.info(
    `*** Connected to the database ${mongoose.connection.db.databaseName} ***`
  );
  mongoose.connection.db
    .dropDatabase()
    .then(() => console.log("Database clear"))
    .then(() => {
      const users = [];
      for (let index = 0; index < 10; index++) {
        users.push({
          name: faker.internet.userName(),
          email: faker.internet.email(),
          password: "Aa12345678",
          addres: "Matadero 112",
          image: faker.internet.avatar(),
          role: "USER",
          active: true
        });
      }
      return User.create(users);
    })
    .then((users) => {
      console.log(`${users.length} users created`);
    })
    .then(() => console.info(`- All data created!`))
    .catch((error) => console.error(error))
    .finally(() => process.exit(0));
});

Promise.all([Products.deleteMany()])
  .then(() => {
    Products.insertMany(sneakers);
  })
  .then(console.log(`Products added successfully`))
  .catch((e) => console.log(e));
