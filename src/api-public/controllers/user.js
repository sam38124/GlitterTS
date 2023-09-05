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
                     from \`${req.get('g-app')}\`.user
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
            const url = `<h1>${data.name}</h1>
<span style="color:black;">請前往重設您的密碼</span>
<p>
<a href="${config_js_1.default.domain}/${req.get('g-app')}/index.html?page=${data.forget}&token=${token}">點我前往重設密碼</a>
</p>
`;
            await (0, ses_js_1.sendmail)(`service@ncdesign.info`, req.body.email, `忘記密碼`, url);
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
router.put('/resetPwd', async (req, resp) => {
    try {
        const user = new user_1.User(req.get('g-app'));
        console.log(`pwd:${req.body.pwd}-newPwd:${req.body.newPwd}`);
        return response_1.default.succ(resp, (await user.resetPwd(req.body.token.userID, req.body.pwd, req.body.newPwd)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map