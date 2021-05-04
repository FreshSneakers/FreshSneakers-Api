const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/User.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const ProductsController = require('../controllers/products.controller')
const ContactController = require('../controllers/contact.controller')

//User routes
router.get('/users', UsersController.getUser)
router.get('/user/me', authMiddleware.isAuthenticated, UsersController.get)
router.get('/activate/:token', UsersController.activate)
router.post('/signup', UsersController.signup)
router.post('/login', UsersController.login)

//Products routes
router.get('/buy', ProductsController.getBuy)
router.post('/buy/sneaker', authMiddleware.isAuthenticated, ProductsController.buyProduct)
router.get('/sneaker-buy/:id', ProductsController.buyDetail)

router.get('/sell', ProductsController.filterProduct)
router.post('/sell/sneaker', authMiddleware.isAuthenticated, ProductsController.sellProduct)
router.get('/sneaker-sell/:id', ProductsController.sellDetail)
router.post('/products/webhook', express.raw({ type: 'application/json' }), ProductsController.webhook)
//Contact US
router.post('/contact', ContactController.doContact)


//Profile
router.post('/profile', authMiddleware.isAuthenticated, UsersController.doEditProfile)



module.exports = router