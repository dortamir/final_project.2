const router = require('express').Router();
const usersController = require('../controllers/usersControllers');

router.post('/users/signUp', usersController.signUp);

module.exports = router;
