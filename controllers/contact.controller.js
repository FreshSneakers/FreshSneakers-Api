const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { sendActivationEmail } = require("../config/mailer.config");
const Contact = require("../models/ContactUs");



module.exports.doContact = (req, res, next) => {
    const { name, email, message } = req.body;
    console.log(name,email,message)
    Contact.create(req.body)
      .then((r) => {
        console.log(r)
       res.status(201).json(r)
      })
      .catch((e) => {
        console.log(e);
        next(e);
      });
  };
  
  