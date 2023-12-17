"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCarById = exports.createCar = exports.getCarByUser = exports.getCars = exports.CarModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./users");
const carSchema = new mongoose_1.default.Schema({
    make: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: String, required: true },
    quality: { type: String, required: true },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
});
carSchema.statics.doesUserOwnCar = async function (userId) {
    const count = await this.countDocuments({ owner: userId }).exec();
    return count > 0;
};
carSchema.post('save', async function () {
    try {
        await users_1.UserModel.findByIdAndUpdate(this.owner, { $push: { cars: this._id } }, { new: true, useFindAndModify: false });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.CarModel = mongoose_1.default.model('Car', carSchema);
const getCars = () => exports.CarModel.find();
exports.getCars = getCars;
const getCarByUser = (id) => exports.CarModel.find({ owner: id });
exports.getCarByUser = getCarByUser;
const createCar = (value) => new exports.CarModel(value).save().then((car) => car.toObject());
exports.createCar = createCar;
const deleteCarById = async (id) => {
    try {
        // Find the car document first
        const car = await exports.CarModel.findById(id).exec();
        if (!car) {
            console.log('Car not found');
            return; // or handle this case as needed
        }
        // Perform necessary updates
        await users_1.UserModel.findByIdAndUpdate(car.owner, { $pull: { cars: car._id } }, { new: true, useFindAndModify: false });
        // Remove the car document
        await car.deleteOne();
    }
    catch (error) {
        console.error('Error deleting car:', error.message);
        // Handle the error appropriately
    }
};
exports.deleteCarById = deleteCarById;
exports.default = exports.CarModel;
//# sourceMappingURL=cars.js.map