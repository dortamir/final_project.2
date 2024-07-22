const db_api = require('../utils/db_utils/db_api')
const weatherAPI = require('../utils/apis/weatherAPI');


exports.route_weather_test = async (req, res) => {  // for testing only!!!!
    try {
        await weatherAPI.get_data(req.body)
            .then(weather_data => res.send(weather_data));
    } catch (err) { res.status(400).send(err); }
}