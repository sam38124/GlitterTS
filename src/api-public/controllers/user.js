"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const database_1 = __importDefault(require("../../modules/database"));
const user_1 = require("../services/user");
const exception_1 = __importDefault(require("../../modules/exception"));
const config_js_1 = __importDefault(require("../../config.js"));
const router = express_1.default.Router();
router.post('/register', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if ((await user.checkUserExists(req.body.account))) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        }
        else {
            const res = (await user.createUser(req.body.account, req.body.pwd, req.body.userData, req));
            return response_1.default.succ(resp, {
                result: true,
                token: res.token,
                type: res.verify
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/checkMail', async (req, resp) => {
    try {
        let data = await database_1.default.query(`select \`value\`
                                   from \`${config_js_1.default.DB_NAME}\`.private_config
                                   where app_name = '${req.query['g-app']}'
                                     and \`key\` = 'glitter_loginConfig'`, []);
        if (data.length > 0) {
            data = data[0]['value'];
        }
        else {
            data = {
                verify: `normal`,
                link: ``
            };
        }
        const user = new user_1.User(req.query['g-app']);
        await user.verifyPASS(req.query.token);
        return resp.redirect(`${(req.secure) ? `https` : `http`}://${req.headers.host}/${req.query['g-app']}/${data.link}`);
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
router.get('/userdata', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.getUserData(req.query.userID + "")));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        console.log(req.body.userData);
        return response_1.default.succ(resp, (await user.updateUserData(req.body.token.userID, req.body.userData)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/checkEmail', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {});
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
