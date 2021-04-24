const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/User.controller')
const authMiddleware = require('../middlewares/auth.middleware')

//User routes
router.get('/users', UsersController.getUser)
router.get('/user/me', authMiddleware.isAuthenticated, UsersController.get)
router.get('/activate/:token', UsersController.activate)
router.post('/signup', UsersController.signup)
router.post('/login', UsersController.login)

module.exports = router