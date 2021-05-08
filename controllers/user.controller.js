const createError = require("http-errors");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { sendActivationEmail,sendForgotPassword} = require("../config/mailer.config");
const { token } = require("morgan");
const bcryptjs = require("bcrypt");
const saltRounds = 10;

module.exports.getUser = (req, res, next) => {
  User.find({}).then((users) => res.json(users));
};

module.exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        next(
          createError(400, {
            errors: { email: "This email is already in use" },
          })
        );
      } else {
        return User.create(req.body).then((user) => {
          sendActivationEmail(user.email, user.activationToken);
          res.status(201).json(user);
        });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      next(
        createError(404, {
          errors: { email: "Email or password is incorrect" },
        })
      );
    } else {
      return user.checkPassword(password).then((match) => {
        if (!match) {
          next(
            createError(404, {
              errors: { email: "Email or password is incorrect" },
            })
          );
        } else {
          if (!user.active) {
            next(
              createError(404, {
                errors: { email: "Your account is not activated" },
              })
            );
          } else {
            res.json({
              access_token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
              }),
            });
          }
        }
      });
    }
  });
};

module.exports.get = (req, res, next) => {
  User.findById(req.currentUser).then((user) => {
    if (!user) {
      next(createError(404));
    } else {
      res.json(user);
    }
  });
};

module.exports.activate = (req, res, next) => {
  const { token } = req.params;
  User.findOneAndUpdate(
    { activationToken: token, active: false },
    { active: true, activationToken: "active" },
    { useFindAndModify: false }
  )
    .then((u) => {
      console.log("RESPUESTA DEL JSON", u);
      res.status(201).json(u);
    })
    .catch((e) => next(e));
};

module.exports.doEditProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.currentUser, req.body, {
    safe: true,
    upsert: true,
    new: true,
  }).then((user) => {
    console.log(user);
    if (!user) {
      next(createError(404, "User nor found"));
    } else {
      res.json(user);
    }
  });
};

module.exports.forgot = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      next(
        createError(404, {
          errors: { email: "Email is incorrect" },
        })
      );
    } else {
      if (!user.active) {
        next(
          createError(404, {
            errors: { email: "Your account is not activated" },
          })
        );
      } else {
        sendForgotPassword(user.email, user.activationToken);
        console.log(user);
        res.status(201).json(user);
      }
    }
  });
};

module.exports.editPassword = (req, res, next) => {
  const {password} = req.body
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      User.findByIdAndUpdate(hashedPassword, {
        safe: true,
        upsert: true,
        new: true,
      })
      .then((u) => {
        res.json(user);
      });
    })
    
};
