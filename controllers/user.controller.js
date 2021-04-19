const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then(users => res.json(users))
};

module.exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        next(createError(400, { errors: { email: 'This email is already in use' } }))
      } else {
        return User.create(req.body)
          .then(user => res.status(201).json(user))
      }
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then(user => {
      if (!user) {
        next(createError(404, { errors: { email: 'Email or password incorrect' } }))
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              next(createError(404, { errors: { email: 'Email or password incorrect' } }))
            } else {
              res.json({
                access_token: jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: '1d'
                  }
                )
              })
            }
          })
      }
    })
}

module.exports.get = (req, res, next) => {
  User.findById(req.currentUser)
    .then(user => {
      if (!user) {
        next(createError(404))
      } else {
        res.json(user)
      }
    })
}