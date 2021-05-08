const createError = require("http-errors");
const User = require("../models/User.model");
const Products = require("../models/Products.model");
const ProductsDeal = require("../models/Product-deal");

module.exports.getOrdersBuy = (req, res, next) => {
    const { user } = req.query

    ProductsDeal.find({ bought_by: user })
        .then((orders) => {
            res.json(orders)
        })
        .catch(next)
}

module.exports.getOrderSell = (req, res, next) => {
    const { user } = req.query
    console.log(user)
    ProductsDeal.find({ user:user})
        .then((orders) => {
            res.json(orders)
        })
        .catch(next)
}