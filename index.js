const sequelize = require('./util/database');
const dataScraper = require('./controller/data_scrapper_controller');
const VehicleDetail = require('./models/vehicle_detail');


sequelize.sync({
    force: true,
    logging: console.log
}).then(result => {
    console.log(result);
    dataScraper.getIndividualCarDetails();
}).catch(error => {
    console.log(error);
});









