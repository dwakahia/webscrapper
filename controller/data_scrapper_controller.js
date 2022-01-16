const request = require('requestretry').defaults({
    fullResponse: false,
    maxAttempts: 30,
    retryDelay: 10000
})
const cheerio = require('cheerio');

const vehicleDetails = require('../models/vehicle_detail')

const base_url = "https://www.q-auto.net/stock_list.php";

const getLastPageNumber = async (pageNumber) => {
    try {
        let url = pageNumber > 0 ? `${base_url}?page=${pageNumber}` : base_url;
        console.log(url);
        const htmlResult = await request.get(url);
        const $ = await cheerio.load(htmlResult);
        let numberingElement = $('.stock_list_box');
        return numberingElement.length;
    } catch (error) {
        console.log('failed to get last page')
    }
}


const getVehicleUrls = async () => {

    let carsPerPage = await getLastPageNumber();
    let pageNo = 0;
    while (carsPerPage > 0 && pageNo < 10) {
        carsPerPage = await getLastPageNumber(pageNo);
        pageNo++;
    }
    let urls = [];


    try {
        for (let firstPage = 0; firstPage <= pageNo; firstPage++) {
            let url = firstPage > 0 ? `${base_url}?page=${firstPage}` : base_url;
            const htmlResult = await request.get(url);
            const $ = await cheerio.load(htmlResult);
            let carItems = $('.stock_list_box');
            carItems.each((index, carItem) => {
                urls.push($(carItem).find('h2,a').attr('href'));
            })
        }
        return urls;
    } catch (error) {
        console.log('failed to get vehicle urls')
    }

}

const getIndividualCarDetails = async () => {

    let allUrls = await getVehicleUrls();

    try {
        for (const url of allUrls) {
            const htmlResult = await request.get(url);
            const $ = await cheerio.load(htmlResult);
            let carName = $('.stkdetail_heading').text();
            let price = $('#price_local_detail').text();
            let year = $('.stkdetail_heading').find('span').text();
            let mainImage = $('.main_image').find('a').attr('href');
            let make, model, type, engine, mileage, fuel, transmission, drive, seats, driveMode, color;
            let stockDetail = $('.stock_detail').find('div');
            stockDetail.each((index, detail) => {
                let data = $(detail).text();

                if (data === 'Make') {
                    make = $(detail).next().text()
                }

                if (data === 'Model') {
                    model = $(detail).next().text()
                }

                if (data === 'Type') {
                    type = $(detail).next().text()
                }

                if (data === 'Engine') {
                    engine = $(detail).next().text()
                }

                if (data === 'Mileage') {
                    mileage = $(detail).next().text()
                }

                if (data === 'Transmission') {
                    transmission = $(detail).next().text()
                }

                if (data === 'Fuel') {
                    fuel = $(detail).next().text()
                }

                if (data === 'Drive') {
                    drive = $(detail).next().text()
                }

                if (data === 'Seats') {
                    seats = $(detail).next().text()
                }

                if (data === '2WD/4WD') {
                    driveMode = $(detail).next().text()
                }

                if (data === 'Color') {
                    color = $(detail).next().text()
                }


            });

            vehicleDetails.create({
                make: make,
                model: model,
                type: type,
                engine: engine,
                mileage: mileage,
                fuel: fuel,
                transmission: transmission,
                drive: drive,
                seats: seats,
                drive_mode: driveMode,
                color: color,
                name: carName,
                price: price,
                year_of_mf: year,
                main_image: mainImage
            }).then((result) => {
                console.log('saved');
            })

            await sleep(3000);

        }

    } catch (error) {
        console.log('could not get vehicle details')
    }

}

const sleep = async (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


module.exports = {getIndividualCarDetails}