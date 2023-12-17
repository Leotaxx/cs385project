"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.addCar = exports.showUserCars = void 0;
const cars_1 = require("../db/cars");
const showUserCars = async (req, res) => {
    try {
        const { id } = req.params;
        const cars = await (0, cars_1.getCarByUser)(id);
        return res.status(200).json(cars);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.showUserCars = showUserCars;
const addCar = async (req, res) => {
    try {
        const { make, carModel, year, quality, owner } = req.body;
        const car = await (0, cars_1.createCar)({
            make,
            carModel,
            year,
            quality,
            owner
        });
        return res.status(201).json(car).end(); // Send back the created car object
    }
    catch (error) {
        console.error(error); // Log the error for server-side debugging
        return res.status(400).send('An error occurred: ' + error.message);
    }
};
exports.addCar = addCar;
const deleteCar = async (req, res) => {
    try {
        const { cid } = req.params;
        const deleteCar = await (0, cars_1.deleteCarById)(cid);
        return res.json(deleteCar);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteCar = deleteCar;
//# sourceMappingURL=cars.js.map