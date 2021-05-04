const createError = require("http-errors");
const Products = require("../models/Products.model");
const ProductsDeal = require("../models/Product-deal");
const stripe = require("stripe")(
  "sk_test_51ImlDcCK7DlXsOWSDBFH6OErdh6krTLU9uz88EKJFT0EEwgqoCNcxZgyE18sWwsfU5XdzjbwIipcThpyprjHvgY400fAMPnfFZ"
);
const createError = require('http-errors')
const Products = require('../models/Products.model')
const ProductsDeal = require('../models/Product-deal')
const stripe = require('stripe')(process.env.KEY_SECRET)

module.exports.getBuy = (req, res, next) => {
  Products.find({})
    .then((product) => {
      if (!product) {
        next(createError(404, "Product no found"));
      } else {
        res.status(201).json(product);
      }
    })
    .catch(next);
};

module.exports.buyDetail = (req, res, next) => {
  const { id } = req.params;

  Products.findById(id)
    .then((product) => {
      res.status(201).json(product);
    })
    .catch(next);
};

module.exports.filterProduct = (req, res, next) => {
  const { model } = req.query;

  Products.find({
    model: {
      $regex: model,
      $options: "i",
    },
  })
    .then((products) => {
      res.status(201).json(products);
    })
    .catch(next);
};

module.exports.sellDetail = (req, res, next) => {
  const { id } = req.params;

  Products.findById(id)
    .then((product) => {
      res.status(201).json(product);
    })
    .catch(next);
};

module.exports.sellProduct = (req, res, next) => {
  const {
    brand,
    model,
    description,
    price,
    image,
    color,
    size,
    user,
    _id,
  } = req.body;

  ProductsDeal.create({
    brand: brand,
    model: model,
    description: description,
    price: price,
    image: image,
    color: color,
    size: size,
    user: user,
    product: _id,
  })
    .then((productDeal) => {
      res.status(201).json(productDeal);
    })
    .catch(next);
};

module.exports.buyProduct = (req, res, next) => {
  const { product, size, user } = req.body.params;

  ProductsDeal.find({ product: product, size: size })
    .limit(1)
    .then((sneaker) => {
      return stripe.checkout.sessions
        .create({
          payment_method_types: ["card"],
          line_items: [
            {
              amount: sneaker[0].price * 100,
              currency: "EUR",
              name: sneaker[0].model,
              quantity: 1,
            },
          ],
          customer_email: user.email,
          mode: "payment",
          success_url: `http://localhost:3000/successful-pay?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `http://localhost:3000/sneaker-buy/${product}`,
        })
        .then((session) => {
          console.log(session);
          res.json({
            sessionId: session.id,
          });
        });
    })
    .catch((e) => console.log(e));
};
module.exports.filterProductBuy = (req, res, next) => {
  const { brand, price } = req.query;

  Products.find({
    brand: {
      $regex: brand,
      $options: "i",
    },
    price: {
      $regex: price,
    },
  })
    .then((products) => {
      res.status(201).json(products);
    })
    .catch(next);
};
