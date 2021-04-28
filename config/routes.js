const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/User.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const ProductsController = require('../controllers/products.controller')

//User routes
router.get('/users', UsersController.getUser)
router.get('/user/me', authMiddleware.isAuthenticated, UsersController.get)
router.get('/activate/:token', UsersController.activate)
router.post('/signup', UsersController.signup)
router.post('/login', UsersController.login)

//Products routes
router.get('/buy', ProductsController.getBuy)
router.get('/sell', ProductsController.filterProduct)
router.post('/sell/product', ProductsController.sellProduct)
router.get('/sneaker/:id', ProductsController.sellDetail)

module.exports = router