const createError = require('http-errors')
const Products = require('../models/Products.model')


module.exports.get = (req,res,next) => {
    console.log('hfhfh')
    Products.find({})
    .then(product => {
        if(!product){
            next(createError(404,'Product no found'))
        }else {
            res.json(product)
        }
    })
    .catch(next)
}