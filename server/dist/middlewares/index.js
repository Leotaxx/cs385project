"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.isOwner = void 0;
const users_1 = require("../db/users");
const lodash_1 = require("lodash");
const isOwner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const currentUserId = (0, lodash_1.get)(req, 'identity._id');
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() != id) {
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isOwner = isOwner;
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['LEO-REST-API'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        (0, lodash_1.merge)(req, { identity: existingUser });
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=index.js.map