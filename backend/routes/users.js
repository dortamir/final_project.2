const router = require('express').Router();
const usersController = require('../controllers/usersControllers');

router.post('/users/signUp', usersController.signUp);
router.post('/users/signIn', usersController.signIn);

module.exports = router;
