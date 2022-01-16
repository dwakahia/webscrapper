const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');
const VehicleDetail = sequelize.define('vehicle_detail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    type: DataTypes.STRING,
    engine: DataTypes.STRING,
    mileage: DataTypes.STRING,
    fuel: DataTypes.STRING,
    transmission: DataTypes.STRING,
    drive: DataTypes.STRING,
    seats: DataTypes.STRING,
    drive_mode: DataTypes.STRING,
    color: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    year_of_mf: DataTypes.STRING,
    main_image: DataTypes.STRING,
});

module.exports = VehicleDetail;