"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const user_1 = require("../services/user");
const exception_1 = __importDefault(require("../../modules/exception"));
const router = express_1.default.Router();
router.post('/register', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if ((await user.checkUserExists(req.body.account))) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        }
        else {
            return response_1.default.succ(resp, { result: true, token: (await user.createUser(req.body.account, req.body.pwd, req.body.userData)).token });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/login', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.login(req.body.account, req.body.pwd)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.getUserData(req.body.token.userID)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
