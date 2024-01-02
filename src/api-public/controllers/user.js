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
const ses_js_1 = require("../../services/ses.js");
const UserUtil_js_1 = __importDefault(require("../../utils/UserUtil.js"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const router = express_1.default.Router();
router.post('/register', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        console.log(`checkAccount--->>`, req.body.account);
        if ((await user.checkUserExists(req.body.account))) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        }
        else {
            const res = (await user.createUser(req.body.account, req.body.pwd, req.body.userData, req));
            return response_1.default.succ(resp, {
                result: true,
                token: res.token,
                type: res.verify,
                needVerify: res.verify
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
                link: ``
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
router.post('/forget', async (req, resp) => {
    var _a;
    try {
        let data = await database_1.default.query(`select \`value\`
                                   from \`${config_js_1.default.DB_NAME}\`.private_config
                                   where app_name = '${req.get('g-app')}'
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
        const sql = `select *
                     from \`${req.get('g-app')}\`.t_user
                     where account = ${database_1.default.escape(req.body.email)}
                       and status = 1`;
        const userData = await database_1.default.execute(sql, []);
        console.log(`userData:${sql}`);
        if (userData.length > 0) {
            const token = await UserUtil_js_1.default.generateToken({
                user_id: userData[0]["userID"],
                account: userData[0]["account"],
                userData: userData[0]
            });
            data.forget_content = (_a = data.forget_content) !== null && _a !== void 0 ? _a : '';
            if (data.forget_content.indexOf('@{{code}}') === -1) {
                data.forget_content = `<div style="margin:0">
                                                        <table style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
                                                            <tbody>
                                                            <tr>
                                                                <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                    <table class="m_-7325585852261570963header"
                                                                           style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                <center>

                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td class="m_-7325585852261570963shop-name__cell"
                                                                                                            style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <h1 style="font-weight:normal;font-size:30px;color:#333;margin:0">
                                                                                                                <a href="">GLITTER.AI</a>
                                                                                                            </h1>
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>

                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>

                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding-bottom:40px;border-width:0">
                                                                                <center>
                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                                                                    重設密碼</h2>
                                                                                                <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                                                                    利用此連結前往 <a
                                                                                                >GLITTER.AI</a>
                                                                                                    重設你的顧客帳號密碼。如果你沒有申請新密碼，
                                                                                                    <wbr>
                                                                                                    可以安心刪除這封電子郵件。
                                                                                                </p>
                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;line-height:0em">
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <table class="m_-7325585852261570963button m_-7325585852261570963main-action-cell"
                                                                                                                   style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px">
                                                                                                                <tbody>
                                                                                                                <tr>
                                                                                                                    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;border-radius:4px"
                                                                                                                        align="center"
                                                                                                                        bgcolor="black">
                                                                                                                        <a href="@{{code}}"
                                                                                                                           class="m_-7325585852261570963button__text"
                                                                                                                           style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px">重設密碼</a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                </tbody>
                                                                                                            </table>


                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>


                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <div class="yj6qo"></div>
                                                        <div class="adL">
                                                        </div>
                                                    </div>`;
            }
            let url = data.forget_content.replace(`@{{code}}`, `${req.body.host_name}?page=${data.forget_page}&token=${token}&appName=${req.get('g-app')}&return_type=resetPassword`);
            await (0, ses_js_1.sendmail)(`service@ncdesign.info`, req.body.email, data.forget_title || "忘記密碼", url);
            return response_1.default.succ(resp, {
                result: true
            });
        }
        else {
            return response_1.default.succ(resp, {
                result: false
            });
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
        if (req.query.type === 'list' && (await ut_permission_js_1.UtPermission.isManager(req))) {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, (await user.getUserList(req.query)));
        }
        else {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, (await user.getUserData(req.body.token.userID)));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/userdata', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        console.log(`userID-->`, req.query.userID);
        return response_1.default.succ(resp, (await user.getUserData(req.query.userID + "")));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        if ((await ut_permission_js_1.UtPermission.isManager(req)) && req.query.userID) {
            return response_1.default.succ(resp, (await user.updateUserData(req.query.userID, req.body.userData, true)));
        }
        else {
            return response_1.default.succ(resp, (await user.updateUserData(req.body.token.userID, req.body.userData)));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/resetPwd', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.resetPwd(req.body.token.userID, req.body.pwd)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/resetPwdNeedCheck', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        console.log(`pwd:${req.body.pwd}-newPwd:${req.body.newPwd}`);
        return response_1.default.succ(resp, (await user.resetPwdNeedCheck(req.body.token.userID, req.body.old_pwd, req.body.pwd)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const user = new user_1.User(req.get('g-app'));
            return response_1.default.succ(resp, (await user.deleteUser({
                id: req.body.id
            })));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        (await user.subscribe(req.body.email, req.body.tag));
        return response_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.getSubScribe(req.query)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/subscribe', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        (await user.deleteSubscribe(req.body.email));
        return response_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/fcm', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        (await user.registerFcm(req.body.userID, req.body.deviceToken));
        return response_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/fcm', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        return response_1.default.succ(resp, (await user.getFCM(req.query)));
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
            (await post.setConfig({
                key: req.body.key,
                value: req.body.value,
                user_id: (_a = req.body.user_id) !== null && _a !== void 0 ? _a : undefined
            }));
        }
        else {
            (await post.setConfig({
                key: req.body.key,
                value: req.body.value
            }));
        }
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/public/config', async (req, resp) => {
    var _a, _b;
    try {
        const post = new user_1.User(req.get('g-app'), req.body.token);
        return response_1.default.succ(resp, { result: true, value: (_b = ((_a = (await post.getConfig({
                key: req.query.key,
                user_id: req.query.user_id
            }))[0]) !== null && _a !== void 0 ? _a : {})['value']) !== null && _b !== void 0 ? _b : "" });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map