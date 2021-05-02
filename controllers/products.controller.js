const createError = require('http-errors')
const Products = require('../models/Products.model')
const ProductsDeal = require('../models/Product-deal') 

module.exports.getBuy = (req, res, next) => {
    Products.find({})
        .then(product => {
            if (!product) {
                next(createError(404, 'Product no found'))
            } else {
                res.status(201).json(product)
            }
        })
        .catch(next)
}

module.exports.buyDetail = (req, res, next) => {
    const { id } = req.params

    Products.findById(id)
        .then((product) => {
            res.status(201).json(product)
        })
        .catch(next)
}

module.exports.filterProduct = (req, res, next) => {
    const { model } = req.query

    Products.find({
        model: {
            $regex: (model),
            $options: 'i'
        }
    })
        .then((products) => {
            res.status(201).json(products)
        })
        .catch(next)
}

module.exports.sellDetail = (req, res, next) => {
    const { id } = req.params

    Products.findById(id)
        .then((product) => {
            res.status(201).json(product)
        })
        .catch(next)
}

module.exports.sellProduct = (req, res, next) => {
    console.log('back', req.body)
    ProductsDeal.create(req.body)
        .then((productDeal) => {
            res.status(201).json(productDeal)
        })
        .catch(next)
}
