const router = require('express').Router();
const mapController = require('../controllers/mapController');


router.get('/map/markers', mapController.getMarkers);
router.post('/map/route_weather_test', mapController.route_weather_test);  


module.exports = router;