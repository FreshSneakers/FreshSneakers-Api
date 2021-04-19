const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.json(user));
};
