const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')


//User routes
router.get('/users',usersController.getUser)
