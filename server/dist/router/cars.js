"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const cars_1 = require("../controllers/cars");
exports.default = (router) => {
    router.get('/cars/:id/:cid', middlewares_1.isAuthenticated, middlewares_1.isOwner, cars_1.showUserCars);
    router.post('/cars/:id', middlewares_1.isAuthenticated, middlewares_1.isOwner, cars_1.addCar);
    router.post('/cars/:id/:cid', middlewares_1.isAuthenticated, middlewares_1.isOwner, cars_1.deleteCar);
};
5;
//# sourceMappingURL=cars.js.map