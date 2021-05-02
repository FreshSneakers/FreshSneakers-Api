const Contact = require("../models/ContactUs");



module.exports.doContact = (req, res, next) => {
    const { name, email, message } = req.body;
    console.log(name,email,message)
    Contact.create(req.body)
      .then((r) => {
       res.status(201).json(r)
      })
      .catch((e) => {
        next(e);
      });
  };
  
  