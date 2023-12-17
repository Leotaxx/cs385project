"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cars_1 = __importDefault(require("./cars"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, select: false },
    },
    cars: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Car'
        }]
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
const getUsers = () => exports.UserModel.find();
exports.getUsers = getUsers;
const getUserByEmail = (email) => exports.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => exports.UserModel.findOne({ 'authentication.sessionToken': sessionToken });
exports.getUserBySessionToken = getUserBySessionToken;
const getUserById = (id) => exports.UserModel.findById(id).populate('cars');
exports.getUserById = getUserById;
const createUser = (values) => new exports.UserModel(values).save().then((user) => user.toObject());
exports.createUser = createUser;
const deleteUserById = async (userId) => {
    try {
        // Find the user and their associated cars
        const user = await exports.UserModel.findById(userId).exec();
        if (!user) {
            console.log('User not found');
            return; // or handle this case as needed
        }
        // If the user has cars, remove them
        if (user.cars.length > 0) {
            await cars_1.default.deleteMany({ _id: { $in: user.cars } });
        }
        // Delete the user
        await exports.UserModel.findByIdAndDelete(userId);
        console.log('User and their cars have been successfully deleted');
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        // Handle the error appropriately
    }
};
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => exports.UserModel.findByIdAndUpdate(id, values);
exports.updateUserById = updateUserById;
//# sourceMappingURL=users.js.map