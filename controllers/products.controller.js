const createError = require('http-errors')
const Products = require('../models/Products.model')


module.exports.get = (req,res,next) => {
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

module.exports.filterProducts = (req,res,next) => {
    const sneakers = {}
    const {search} = req.query

    if(search){
        sneakers.brand = new RegExp(search,'i')
    }

    Products.find(criteria)
    .then(products => res.json(products))
    .catch(next)

}