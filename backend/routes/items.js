const router = require('express').Router();
const itemsController = require('../controllers/itemsControllers');

router.post('/items/createItems', itemsController.createItems);
router.post('/items/updateItems', itemsController.updateItem);
router.get('/items/getItemsByName', itemsController.getItemByName);
router.get('/items/getItems', itemsController.getItems);
router.get('/items/getItemsByType', itemsController.getItemsByType);


module.exports = router;