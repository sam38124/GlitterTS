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
const ut_permission_js_1 = require("../utils/ut-permission.js");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        if (req.query.type === 'list' && (await ut_permission_js_1.UtPermission.isManager(req))) {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, await user.getUserList(req.query));
        }
        else if (req.query.type === 'account' && (await ut_permission_js_1.UtPermission.isManager(req))) {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, await user.getUserData(req.query.email, 'account'));
        }
        else {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, await user.getUserData(req.body.token.userID));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if ((await ut_permission_js_1.UtPermission.isManager(req)) && req.query.userID) {
            return response_1.default.succ(resp, await user.updateUserData(req.query.userID, req.body.userData, true));
        }
        else {
            return response_1.default.succ(resp, await user.updateUserData(req.body.token.userID, req.body.userData));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, await user.deleteUser({
                id: req.body.id,
            }));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/register', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if (await user.checkUserExists(req.body.account)) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        }
        else {
            const res = await user.createUser(req.body.account, req.body.pwd, req.body.userData, req);
            res.type = res.verify;
            res.needVerify = res.verify;
            return response_1.default.succ(resp, res);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/login', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if (req.body.login_type === 'fb') {
            return response_1.default.succ(resp, await user.loginWithFb(req.body.fb_token));
        }
        else if (req.body.login_type === 'line') {
            return response_1.default.succ(resp, await user.loginWithLine(req.body.line_token, req.body.redirect));
        }
        else if (req.body.login_type === 'google') {
            return response_1.default.succ(resp, await user.loginWithGoogle(req.body.google_token, req.body.redirect));
        }
        else {
            return response_1.default.succ(resp, await user.login(req.body.account, req.body.pwd));
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
                link: ``,
            };
        }
        const user = new user_1.User(req.query['g-app']);
        await user.verifyPASS(req.query.token);
        return resp.redirect(`${config_js_1.default.domain}/${req.query['g-app']}/index.html?page=${data.link}`);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/checkMail/updateAccount', async (req, resp) => {
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
                link: ``,
            };
        }
        const user = new user_1.User(req.query['g-app']);
        await user.updateAccountBack(req.query.token);
        return resp.redirect(`${config_js_1.default.domain}/${req.query['g-app']}/index.html?page=${data.link}`);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/check/email/exists', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            result: await new user_1.User(req.get('g-app')).checkEmailExists(req.query.email),
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/forget', async (req, resp) => {
    try {
        const sql = `select *
                     from \`${req.get('g-app')}\`.t_user
                     where account = ${database_1.default.escape(req.body.email)}
                       and status = 1`;
        const userData = (await database_1.default.execute(sql, []));
        if (userData.length > 0) {
            await new user_1.User(req.get('g-app')).forgetPassword(req.body.email);
            return response_1.default.succ(resp, {
                result: true,
            });
        }
        else {
            return response_1.default.succ(resp, {
                result: false,
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/forget/check-code', async (req, resp) => {
    try {
        const forget_code = await redis_js_1.default.getValue(`forget-${req.body.email}`);
        const forget_count = parseInt((await redis_js_1.default.getValue(`forget-count-${req.body.email}`)) || '5', 10);
        if (forget_code && forget_code === req.body.code && forget_count < 5) {
            return response_1.default.succ(resp, {
                result: true,
            });
        }
        else {
            await redis_js_1.default.setValue(`forget-count-${req.body.email}`, `${forget_count + 1}`);
            throw exception_1.default.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/reset/pwd', async (req, resp) => {
    try {
        const forget_code = await redis_js_1.default.getValue(`forget-${req.body.email}`);
        if (forget_code && forget_code === req.body.code) {
            await new user_1.User(req.get('g-app')).resetPwd(req.body.email, req.body.pwd);
            return response_1.default.succ(resp, {
                result: true,
            });
        }
        else {
            await redis_js_1.default.deleteKey(`forget-${req.body.email}`);
            throw exception_1.default.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/resetPwd', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, await user.resetPwd(req.body.token.userID, req.body.pwd));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/resetPwdNeedCheck', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, await user.resetPwdNeedCheck(req.body.token.userID, req.body.old_pwd, req.body.pwd));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/userdata', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, await user.getUserData(req.query.userID + ''));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/group', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        const type = req.query.type ? `${req.query.type}`.split(',') : undefined;
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await user.getUserGroups(type));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, await user.getSubScribe(req.query));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        await user.subscribe(req.body.email, req.body.tag);
        return response_1.default.succ(resp, {
            result: true,
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        await user.deleteSubscribe(req.body.email);
        return response_1.default.succ(resp, {
            result: true,
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/fcm', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, await user.getFCM(req.query));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/fcm', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        await user.registerFcm(req.body.userID, req.body.deviceToken);
        return response_1.default.succ(resp, {
            result: true,
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/public/config', async (req, resp) => {
    var _a, _b;
    try {
        const post = new user_1.User(req.get('g-app'), req.body.token);
        return response_1.default.succ(resp, {
            result: true,
            value: (_b = ((_a = (await post.getConfig({
                key: req.query.key,
                user_id: req.query.user_id,
            }))[0]) !== null && _a !== void 0 ? _a : {})['value']) !== null && _b !== void 0 ? _b : '',
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/public/config', async (req, resp) => {
    var _a;
    try {
        const post = new user_1.User(req.get('g-app'), req.body.token);
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            console.log(`public/config->manager`);
            await post.setConfig({
                key: req.body.key,
                value: req.body.value,
                user_id: (_a = req.body.user_id) !== null && _a !== void 0 ? _a : undefined,
            });
        }
        else {
            console.log(`public/config->user`);
            await post.setConfig({
                key: req.body.key,
                value: req.body.value,
            });
        }
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/notice', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new user_1.User(req.get('g-app'), req.body.token).getNotice({
            query: req.query,
        }));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/notice/unread/count', async (req, resp) => {
    try {
        return response_1.default.succ(resp, await new user_1.User(req.get('g-app'), req.body.token).getUnreadCount());
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map