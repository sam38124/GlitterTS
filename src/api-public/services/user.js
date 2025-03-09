"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const tool_1 = __importStar(require("../../services/tool"));
const UserUtil_1 = __importDefault(require("../../utils/UserUtil"));
const config_js_1 = __importDefault(require("../../config.js"));
const app_js_1 = __importDefault(require("../../app.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const process_1 = __importDefault(require("process"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const ses_js_1 = require("../../services/ses.js");
const ut_database_js_1 = require("../utils/ut-database.js");
const custom_code_js_1 = require("./custom-code.js");
const auto_send_email_js_1 = require("./auto-send-email.js");
const google_auth_library_1 = require("google-auth-library");
const rebate_js_1 = require("./rebate.js");
const notify_js_1 = require("./notify.js");
const config_1 = require("../../config");
const sms_js_1 = require("./sms.js");
const form_check_js_1 = require("./form-check.js");
const ut_permission_js_1 = require("../utils/ut-permission.js");
const share_permission_js_1 = require("./share-permission.js");
const terms_check_js_1 = require("./terms-check.js");
const app_js_2 = require("../../services/app.js");
class User {
    constructor(app, token) {
        this.normalMember = {
            id: '',
            duration: { type: 'noLimit', value: 0 },
            tag_name: '一般會員',
            condition: { type: 'total', value: 0 },
            dead_line: { type: 'noLimit' },
            create_date: '2024-01-01T00:00:00.000Z',
        };
        this.app = app;
        this.token = token;
    }
    static generateUserID() {
        let userID = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            userID += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
        return userID;
    }
    async findAuthUser(email) {
        try {
            const authData = (await database_1.default.query(`SELECT *
                     FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                     WHERE JSON_EXTRACT(config, '$.verifyEmail') = ?;
                    `, [email || '-21']))[0];
            return authData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'checkAuthUser Error:' + e, null);
        }
    }
    async emailVerify(account) {
        const time = await redis_js_1.default.getValue(`verify-${account}-last-time`);
        if (!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30) {
            await redis_js_1.default.setValue(`verify-${account}-last-time`, new Date().toISOString());
            const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-verify-update', 'zh-TW');
            const code = tool_js_1.default.randomNumber(6);
            await redis_js_1.default.setValue(`verify-${account}`, code);
            data.content = data.content.replace(`@{{code}}`, code);
            (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, account, data.title, data.content);
            return {
                result: true,
            };
        }
        else {
            return {
                result: false,
            };
        }
    }
    async phoneVerify(account) {
        const time = await redis_js_1.default.getValue(`verify-phone-${account}-last-time`);
        if (!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30) {
            await redis_js_1.default.setValue(`verify-phone-${account}-last-time`, new Date().toISOString());
            const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-phone-verify-update', 'zh-TW');
            const code = tool_js_1.default.randomNumber(6);
            await redis_js_1.default.setValue(`verify-phone-${account}`, code);
            data.content = data.content.replace(`@{{code}}`, code);
            const sns = new sms_js_1.SMS(this.app, this.token);
            await sns.sendSNS({ data: data.content, phone: account }, () => { });
            return {
                result: true,
            };
        }
        else {
            return {
                result: false,
            };
        }
    }
    async createUser(account, pwd, userData, req, pass_verify) {
        var _a;
        try {
            const login_config = await this.getConfigV2({
                key: 'login_config',
                user_id: 'manager',
            });
            const register_form = await this.getConfigV2({
                key: 'custom_form_register',
                user_id: 'manager',
            });
            register_form.list = (_a = register_form.list) !== null && _a !== void 0 ? _a : [];
            form_check_js_1.FormCheck.initialRegisterForm(register_form.list);
            userData = userData !== null && userData !== void 0 ? userData : {};
            delete userData.pwd;
            delete userData.repeat_password;
            const findAuth = await this.findAuthUser(account);
            const userID = findAuth ? findAuth.user : User.generateUserID();
            if (register_form.list.find((dd) => {
                return dd.key === 'email' && `${dd.hidden}` !== 'true' && dd.required;
            }) &&
                !userData.email) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                    msg: 'lead data with email.',
                });
            }
            if (register_form.list.find((dd) => {
                return dd.key === 'phone' && `${dd.hidden}` !== 'true' && dd.required;
            }) &&
                !userData.phone) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                    msg: 'lead data with phone.',
                });
            }
            const memberConfig = await app_js_2.App.checkBrandAndMemberType(this.app);
            if (!pass_verify && memberConfig.plan !== 'light-year') {
                if (login_config.email_verify &&
                    userData.verify_code !== (await redis_js_1.default.getValue(`verify-${userData.email}`)) &&
                    register_form.list.find((dd) => {
                        return dd.key === 'email' && `${dd.hidden}` !== 'true';
                    })) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'email-verify-false',
                    });
                }
                if (login_config.phone_verify &&
                    userData.verify_code_phone !== (await redis_js_1.default.getValue(`verify-phone-${userData.phone}`)) &&
                    register_form.list.find((dd) => {
                        return dd.key === 'phone' && `${dd.hidden}` !== 'true';
                    })) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'phone-verify-false',
                    });
                }
            }
            if (userData && userData.email) {
                userData.email = userData.email.toLowerCase();
            }
            userData.verify_code = undefined;
            userData.verify_code_phone = undefined;
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                 VALUES (?, ?, ?, ?, ?);`, [
                userID,
                account,
                await tool_1.default.hashPwd(pwd),
                Object.assign(Object.assign({}, (userData !== null && userData !== void 0 ? userData : {})), { status: undefined }),
                userData.status === 0 ? 0 : 1,
            ]);
            await this.createUserHook(userID);
            const usData = await this.getUserData(userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Register Error:' + e, e.data);
        }
    }
    async createUserHook(userID) {
        const usData = await this.getUserData(userID, 'userID');
        usData.userData.repeatPwd = undefined;
        await database_1.default.query(`update \`${this.app}\`.t_user
             set userData=?
             where userID = ?`, [
            JSON.stringify(await this.checkUpdate({
                userID: userID,
                updateUserData: usData.userData,
                manager: false,
            })),
            userID,
        ]);
        const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome', 'zh-TW');
        if (data.toggle) {
            (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, usData.account, data.title, data.content);
        }
        const getRS = await this.getConfig({ key: 'rebate_setting', user_id: 'manager' });
        const rgs = getRS[0] && getRS[0].value.register ? getRS[0].value.register : {};
        if (rgs && rgs.switch && rgs.value) {
            await new rebate_js_1.Rebate(this.app).insertRebate(userID, rgs.value, '新加入會員', {
                type: 'first_regiser',
                deadTime: rgs.unlimited ? undefined : (0, moment_1.default)().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        new notify_js_1.ManagerNotify(this.app).userRegister({ user_id: userID });
    }
    async updateAccount(account, userID) {
        try {
            const configAd = await app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig');
            switch (configAd.verify) {
                case 'mail':
                    const checkToken = (0, tool_1.getUUID)();
                    const url = `<h1>${configAd.name}</h1>
                        <p>
                            <a href="${config_js_1.default.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
                        </p>`;
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, account, `信箱認證`, url);
                    return {
                        type: 'mail',
                        mailVerify: checkToken,
                        updateAccount: account,
                    };
                default:
                    return {
                        type: '',
                    };
            }
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
        }
    }
    async login(account, pwd) {
        try {
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where (userData ->>'$.email' = ? or userData->>'$.phone'=? or account=?)
                       and status = 1`, [account.toLowerCase(), account.toLowerCase(), account.toLowerCase()]))[0];
            if ((process_1.default.env.universal_password && pwd === process_1.default.env.universal_password) ||
                (await tool_1.default.compareHash(pwd, data.pwd))) {
                data.pwd = undefined;
                data.token = await UserUtil_1.default.generateToken({
                    user_id: data['userID'],
                    account: data['account'],
                    userData: {},
                });
                return data;
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async loginWithFb(token) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v19.0/me?access_token=${token}&__cppo=1&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors`,
            headers: {
                Cookie: 'sb=UysEY1hZJvSZxgxk_g316pK-',
            },
        };
        const fbResponse = await new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
                .then((response) => {
                resolve(response.data);
            })
                .catch((error) => {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + error, null);
            });
        });
        if ((await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_user
                     where userData ->>'$.email' = ?`, [fbResponse.email]))[0]['count(1)'] == 0) {
            const findAuth = await this.findAuthUser(fbResponse.email);
            const userID = findAuth ? findAuth.user : User.generateUserID();
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                 VALUES (?, ?, ?, ?, ?);`, [
                userID,
                fbResponse.email,
                await tool_1.default.hashPwd(User.generateUserID()),
                {
                    name: fbResponse.name,
                    fb_id: fbResponse.id,
                    email: fbResponse.email,
                },
                1,
            ]);
            await this.createUserHook(userID);
        }
        const data = (await database_1.default.execute(`select *
                 from \`${this.app}\`.t_user
                 where userData ->>'$.email' = ?
                   and status = 1`, [fbResponse.email]))[0];
        data.userData['fb-id'] = fbResponse.id;
        await database_1.default.execute(`update \`${this.app}\`.t_user
             set userData=?
             where userID = ?
               and id > 0`, [JSON.stringify(data.userData), data.userID]);
        const usData = await this.getUserData(data.userID, 'userID');
        usData.pwd = undefined;
        usData.token = await UserUtil_1.default.generateToken({
            user_id: usData['userID'],
            account: usData['account'],
            userData: {},
        });
        return usData;
    }
    async loginWithLine(code, redirect) {
        try {
            const lineData = await this.getConfigV2({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            const lineResponse = await new Promise((resolve, reject) => {
                if (redirect === 'app') {
                    resolve({
                        id_token: code,
                    });
                }
                else {
                    axios_1.default
                        .request({
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api.line.me/oauth2/v2.1/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: qs_1.default.stringify({
                            code: code,
                            client_id: lineData.id,
                            client_secret: lineData.secret,
                            grant_type: 'authorization_code',
                            redirect_uri: redirect,
                        }),
                    })
                        .then(response => {
                        resolve(response.data);
                    })
                        .catch(error => {
                        console.error(error);
                        resolve(false);
                    });
                }
            });
            if (!lineResponse) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
            }
            const userData = jsonwebtoken_1.default.decode(lineResponse.id_token);
            const line_profile = await new Promise((resolve, reject) => {
                axios_1.default
                    .request({
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.line.me/oauth2/v2.1/verify',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: qs_1.default.stringify({
                        id_token: lineResponse.id_token,
                        client_id: lineData.id,
                    }),
                })
                    .then(response => {
                    resolve(response.data);
                })
                    .catch(error => {
                    resolve(false);
                });
            });
            if (!line_profile.email) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
            }
            const app = this.app;
            async function getUsData() {
                return (await database_1.default.execute(`select *
                     from \`${app}\`.t_user
                     where (userData ->>'$.email' = ?)
                        or (userData ->>'$.lineID' = ?)
                     ORDER BY CASE
                                  WHEN (userData ->>'$.lineID' = ?) THEN 1
                                  ELSE 3
                                  END
                    `, [line_profile.email, userData.sub, userData.sub]));
            }
            let findList = await getUsData();
            if (!findList[0]) {
                const findAuth = await this.findAuthUser(line_profile.email);
                const userID = findAuth ? findAuth.user : User.generateUserID();
                await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                     VALUES (?, ?, ?, ?, ?);`, [
                    userID,
                    line_profile.email,
                    await tool_1.default.hashPwd(User.generateUserID()),
                    {
                        name: userData.name || '未命名',
                        lineID: userData.sub,
                        email: line_profile.email,
                    },
                    1,
                ]);
                await this.createUserHook(userID);
                findList = await getUsData();
            }
            const data = findList[0];
            const usData = await this.getUserData(data.userID, 'userID');
            data.userData.lineID = userData.sub;
            await database_1.default.execute(`update \`${this.app}\`.t_user
                 set userData=?
                 where userID = ?
                   and id > 0`, [JSON.stringify(data.userData), data.userID]);
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async loginWithGoogle(code, redirect) {
        try {
            const config = await this.getConfigV2({
                key: 'login_google_setting',
                user_id: 'manager',
            });
            const ticket = await new Promise(async (resolve, reject) => {
                try {
                    if (redirect === 'app') {
                        const client = new google_auth_library_1.OAuth2Client(config.app_id);
                        resolve(await client.verifyIdToken({
                            idToken: code,
                            audience: config.app_id,
                        }));
                    }
                    else {
                        const oauth2Client = new google_auth_library_1.OAuth2Client(config.id, config.secret, redirect);
                        const { tokens } = await oauth2Client.getToken(code);
                        oauth2Client.setCredentials(tokens);
                        resolve(await oauth2Client.verifyIdToken({
                            idToken: tokens.id_token,
                            audience: config.id,
                        }));
                    }
                }
                catch (e) {
                    resolve(undefined);
                }
            });
            if (!ticket) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Google Register Error', null);
            }
            const payload = ticket.getPayload();
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user
                         where userData ->>'$.email' = ?`, [payload === null || payload === void 0 ? void 0 : payload.email]))[0]['count(1)'] == 0) {
                const findAuth = await this.findAuthUser(payload === null || payload === void 0 ? void 0 : payload.email);
                const userID = findAuth ? findAuth.user : User.generateUserID();
                await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                     VALUES (?, ?, ?, ?, ?);`, [
                    userID,
                    payload === null || payload === void 0 ? void 0 : payload.email,
                    await tool_1.default.hashPwd(User.generateUserID()),
                    {
                        name: payload === null || payload === void 0 ? void 0 : payload.given_name,
                        email: payload === null || payload === void 0 ? void 0 : payload.email,
                    },
                    1,
                ]);
                await this.createUserHook(userID);
            }
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where userData ->>'$.email' = ?
                       and status = 1`, [payload === null || payload === void 0 ? void 0 : payload.email]))[0];
            data.userData['google-id'] = payload === null || payload === void 0 ? void 0 : payload.sub;
            await database_1.default.execute(`update \`${this.app}\`.t_user
                 set userData=?
                 where userID = ?
                   and id > 0`, [JSON.stringify(data.userData), data.userID]);
            const usData = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async loginWithPin(user_id, pin) {
        var _a;
        try {
            if (await ut_permission_js_1.UtPermission.isManagerTokenCheck(this.app, `${this.token.userID}`)) {
                const per_c = new share_permission_js_1.SharePermission(this.app, this.token);
                const permission = (await per_c.getPermission({
                    page: 0,
                    limit: 1000,
                })).data;
                if (permission.find((dd) => {
                    return `${dd.user}` === `${user_id}` && `${dd.config.pin}` === pin;
                })) {
                    const user_ = new User((_a = (await per_c.getBaseData())) === null || _a === void 0 ? void 0 : _a.brand);
                    const usData = await user_.getUserData(user_id, 'userID');
                    usData.pwd = undefined;
                    usData.token = await UserUtil_1.default.generateToken({
                        user_id: usData['userID'],
                        account: usData['account'],
                        userData: {},
                    });
                    return usData;
                }
                else {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
                }
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
            return {};
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async loginWithApple(token) {
        try {
            const config = await this.getConfigV2({
                key: 'login_apple_setting',
                user_id: 'manager',
            });
            const private_key = config.secret;
            const client_secret = jsonwebtoken_1.default.sign({
                iss: config.team_id,
                sub: config.id,
                aud: 'https://appleid.apple.com',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            }, private_key, {
                algorithm: 'ES256',
                header: {
                    alg: 'ES256',
                    kid: config.key_id,
                },
            });
            const res = await axios_1.default
                .post('https://appleid.apple.com/auth/token', `client_id=${config.id}&client_secret=${client_secret}&code=${token}&grant_type=authorization_code`)
                .then(res => res.data)
                .catch(e => {
                console.error(e);
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify False', null);
            });
            const decoded = jsonwebtoken_1.default.decode(res['id_token'], { complete: true });
            const uid = decoded.payload.sub;
            const findAuth = await this.findAuthUser(decoded.payload.email);
            const userID = findAuth ? findAuth.user : User.generateUserID();
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user
                         where userData ->>'$.email' = ?`, [decoded.payload.email]))[0]['count(1)'] == 0) {
                const userID = User.generateUserID();
                await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                     VALUES (?, ?, ?, ?, ?);`, [
                    userID,
                    decoded.payload.email,
                    await tool_1.default.hashPwd(User.generateUserID()),
                    {
                        email: decoded.payload.email,
                        name: (() => {
                            const email = decoded.payload.email;
                            return email.substring(0, email.indexOf('@'));
                        })(),
                    },
                    1,
                ]);
                await this.createUserHook(userID);
            }
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where userData ->>'$.email' = ?
                       and status = 1`, [decoded.payload.email]))[0];
            data.userData['apple-id'] = uid;
            await database_1.default.execute(`update \`${this.app}\`.t_user
                 set userData=?
                 where userID = ?
                   and id > 0`, [JSON.stringify(data.userData), data.userID]);
            const usData = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async getUserData(query, type = 'userID') {
        try {
            const sql = `select *
                         from \`${this.app}\`.t_user
                         where ${(() => {
                let query2 = [`1=1`];
                if (type === 'userID') {
                    query2.push(`userID=${database_1.default.escape(query)}`);
                }
                else if (type === 'email_or_phone') {
                    query2.push(`((userData->>'$.email'=${database_1.default.escape(query)}) or (userData->>'$.phone'=${database_1.default.escape(query)}))`);
                }
                else {
                    query2.push(`userData->>'$.email'=${database_1.default.escape(query)}`);
                }
                return query2.join(` and `);
            })()}`;
            const data = (await database_1.default.execute(sql, []))[0];
            let cf = {
                userData: data,
            };
            await new custom_code_js_1.CustomCode(this.app).loginHook(cf);
            if (data) {
                data.pwd = undefined;
                data.member = await this.checkMember(data, true);
                const userLevel = (await this.getUserLevel([{ userId: data.userID }]))[0];
                data.member_level = userLevel.data;
                data.member_level_status = userLevel.status;
                const n = data.member.findIndex((item) => {
                    return data.member_level.id === item.id;
                });
                if (n !== -1) {
                    data.member.map((item, index) => {
                        item.trigger = index >= n;
                    });
                }
                data.member.push({
                    id: this.normalMember.id,
                    og: this.normalMember,
                    trigger: true,
                    tag_name: this.normalMember.tag_name,
                    dead_line: '',
                });
            }
            return data;
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e, null);
        }
    }
    async checkMember(userData, trigger) {
        const member_update = await this.getConfigV2({
            key: 'member_update',
            user_id: userData.userID,
        });
        member_update.value = member_update.value || [];
        if (!member_update.time || trigger) {
            const member_list = (await this.getConfigV2({
                key: 'member_level_config',
                user_id: 'manager',
            })).levels || [];
            const orderCountingSQL = await this.getCheckoutCountingModeSQL();
            const order_list = (await database_1.default.query(`SELECT orderData ->> '$.total' AS total, created_time
           FROM \`${this.app}\`.t_checkout
           WHERE email IN (${[userData.userData.email, userData.userData.phone]
                .filter(Boolean)
                .map(database_1.default.escape)
                .join(',')})
           AND ${orderCountingSQL}
           ORDER BY id DESC`, [])).map((dd) => ({
                total_amount: parseInt(dd.total, 10),
                date: dd.created_time,
            }));
            let pass_level = true;
            const member = member_list
                .map((dd, index) => {
                dd.index = index;
                if (dd.condition.type === 'single') {
                    const time = order_list.find((d1) => {
                        return d1.total_amount >= parseInt(dd.condition.value, 10);
                    });
                    if (time) {
                        let dead_line = new Date(time.created_time);
                        if (dd.dead_line.type === 'noLimit') {
                            dead_line.setDate(dead_line.getDate() + 365 * 10);
                            return {
                                id: dd.id,
                                trigger: pass_level,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                        else {
                            dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                            return {
                                id: dd.id,
                                trigger: pass_level && dead_line.getTime() > new Date().getTime(),
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                    }
                    else {
                        let leak = parseInt(dd.condition.value, 10);
                        if (leak !== 0) {
                            pass_level = false;
                        }
                        return {
                            id: dd.id,
                            tag_name: dd.tag_name,
                            dead_line: '',
                            trigger: leak === 0 && pass_level,
                            og: dd,
                            leak: leak,
                        };
                    }
                }
                else {
                    let sum = 0;
                    let start_with = new Date();
                    if (dd.duration.type === 'noLimit') {
                        start_with.setTime(start_with.getTime() - 365 * 1000 * 60 * 60 * 24);
                    }
                    else {
                        start_with.setTime(start_with.getTime() - Number(dd.duration.value) * 1000 * 60 * 60 * 24);
                    }
                    const order_match = order_list.filter((d1) => {
                        return new Date(d1.date).getTime() > start_with.getTime();
                    });
                    order_match.map((dd) => {
                        sum += dd.total_amount;
                    });
                    if (sum >= Number(dd.condition.value)) {
                        let dead_line = new Date();
                        if (dd.dead_line.type === 'noLimit') {
                            dead_line.setTime(dead_line.getTime() + 365 * 1000 * 60 * 60 * 24);
                            return {
                                id: dd.id,
                                trigger: pass_level,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                        else {
                            dead_line.setTime(dead_line.getTime() + Number(dd.dead_line.value) * 1000 * 60 * 60 * 24);
                            return {
                                id: dd.id,
                                trigger: pass_level,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                    }
                    else {
                        let leak = Number(dd.condition.value) - sum;
                        return {
                            id: dd.id,
                            tag_name: dd.tag_name,
                            dead_line: '',
                            trigger: false,
                            og: dd,
                            leak: leak,
                            sum: sum,
                        };
                    }
                }
            })
                .reverse();
            member.map(dd => {
                if (dd.trigger) {
                    dd.start_with = new Date();
                }
            });
            const original_member = member_update.value.find((dd) => {
                return dd.trigger;
            });
            if (original_member) {
                const calc_member_now = member.find((d1) => {
                    return d1.id === original_member.id;
                });
                if (calc_member_now) {
                    const dd = member_list.find(dd => {
                        return dd.id === original_member.id;
                    });
                    const renew_check_data = (() => {
                        let start_with = new Date(original_member.start_with);
                        const order_match = order_list.filter((d1) => {
                            return new Date(d1.date).getTime() > start_with.getTime();
                        });
                        const dead_line = new Date(original_member.dead_line);
                        if (dd.dead_line.type === 'noLimit') {
                            dead_line.setDate(dead_line.getDate() + 365 * 10);
                            return {
                                id: dd.id,
                                trigger: true,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                        else if (dd.renew_condition.type === 'single') {
                            const time = order_match.find((d1) => {
                                return d1.total_amount >= parseInt(dd.renew_condition.value, 10);
                            });
                            if (time) {
                                dead_line.setDate(dead_line.getDate() + parseInt(dd.dead_line.value, 10));
                                return {
                                    id: dd.id,
                                    trigger: true,
                                    tag_name: dd.tag_name,
                                    dead_line: dead_line,
                                    og: dd,
                                };
                            }
                            else {
                                return {
                                    id: dd.id,
                                    trigger: false,
                                    tag_name: dd.tag_name,
                                    dead_line: '',
                                    leak: parseInt(dd.renew_condition.value, 10),
                                    og: dd,
                                };
                            }
                        }
                        else {
                            let sum = 0;
                            order_match.map((dd) => {
                                sum += dd.total_amount;
                            });
                            if (sum >= parseInt(dd.renew_condition.value, 10)) {
                                dead_line.setDate(dead_line.getDate() + parseInt(dd.dead_line.value, 10));
                                return {
                                    id: dd.id,
                                    trigger: true,
                                    tag_name: dd.tag_name,
                                    dead_line: dead_line,
                                    og: dd,
                                };
                            }
                            else {
                                return {
                                    id: dd.id,
                                    trigger: false,
                                    tag_name: dd.tag_name,
                                    dead_line: '',
                                    leak: parseInt(dd.renew_condition.value, 10) - sum,
                                    og: dd,
                                };
                            }
                        }
                    })();
                    if (new Date(original_member.dead_line).getTime() > new Date().getTime()) {
                        calc_member_now.dead_line = original_member.dead_line;
                        calc_member_now.trigger = true;
                        calc_member_now.start_with = original_member.start_with || calc_member_now.start_with;
                        calc_member_now.re_new_member = renew_check_data;
                    }
                    else {
                        if (dd.renew_condition) {
                            if (renew_check_data.trigger) {
                                calc_member_now.trigger = true;
                                calc_member_now.dead_line = renew_check_data.dead_line;
                                calc_member_now.start_with = new Date();
                                calc_member_now.re_new_member = renew_check_data;
                            }
                        }
                    }
                }
            }
            member_update.value = member;
            member_update.time = new Date();
            await this.setConfig({
                key: 'member_update',
                user_id: userData.userID,
                value: member_update,
            });
            return member;
        }
        else {
            return member_update.value;
        }
    }
    find30DayPeriodWith3000Spent(transactions, total, duration) {
        const ONE_YEAR_MS = duration * 24 * 60 * 60 * 1000;
        const THIRTY_DAYS_MS = duration * 24 * 60 * 60 * 1000;
        const NOW = new Date().getTime();
        const recentTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return NOW - transactionDate.getTime() <= ONE_YEAR_MS;
        });
        recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for (let i = 0; i < recentTransactions.length; i++) {
            let sum = 0;
            for (let j = i; j < recentTransactions.length; j++) {
                const dateI = new Date(recentTransactions[i].date);
                const dateJ = new Date(recentTransactions[j].date);
                if (dateI.getTime() - dateJ.getTime() <= THIRTY_DAYS_MS) {
                    sum += recentTransactions[j].total_amount;
                    if (sum >= total) {
                        return {
                            start_date: recentTransactions[j].date,
                            end_date: recentTransactions[i].date,
                        };
                    }
                }
                else {
                    break;
                }
            }
        }
        return null;
    }
    async getUserAndOrderSQL(obj) {
        const orderByClause = this.getOrderByClause(obj.orderBy);
        const whereClause = obj.where.filter(str => str.length > 0).join(' AND ');
        const limitClause = obj.page !== undefined && obj.limit !== undefined ? `LIMIT ${obj.page * obj.limit}, ${obj.limit}` : '';
        const orderCountingSQL = await this.getCheckoutCountingModeSQL();
        const sql = `
        SELECT ${obj.select}
        FROM (
            SELECT 
                email,
                COUNT(*) AS order_count,
                SUM(total) AS total_amount
            FROM \`${this.app}\`.t_checkout
            WHERE ${orderCountingSQL}
            GROUP BY email
        ) AS o
        RIGHT JOIN \`${this.app}\`.t_user u ON o.email = u.account
        LEFT JOIN (
            SELECT 
                email,
                total AS last_order_total,
                created_time AS last_order_time,
                ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_time DESC) AS rn
            FROM \`${this.app}\`.t_checkout
            WHERE ${orderCountingSQL}
        ) AS lo ON o.email = lo.email AND lo.rn = 1
        WHERE (${whereClause})
        ORDER BY ${orderByClause} ${limitClause}
    `;
        return sql;
    }
    getOrderByClause(orderBy) {
        const orderByMap = {
            order_total_desc: 'o.total_amount DESC',
            order_total_asc: 'o.total_amount',
            order_count_desc: 'o.order_count DESC',
            order_count_asc: 'o.order_count',
            name: 'JSON_EXTRACT(u.userData, "$.name")',
            created_time_desc: 'u.created_time DESC',
            created_time_asc: 'u.created_time',
            online_time_desc: 'u.online_time DESC',
            online_time_asc: 'u.online_time',
            last_order_total_desc: 'lo.last_order_total DESC',
            last_order_total_asc: 'lo.last_order_total',
            last_order_time_desc: 'lo.last_order_time DESC',
            last_order_time_asc: 'lo.last_order_time',
        };
        return orderByMap[orderBy] || 'u.id DESC';
    }
    async getUserList(query) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const querySql = ['1=1'];
            const noRegisterUsers = [];
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            if (query.groupType) {
                const getGroup = await this.getUserGroups(query.groupType.split(','), query.groupTag);
                if (getGroup.result && getGroup.data[0]) {
                    const users = getGroup.data[0].users;
                    users.map((user, index) => {
                        if (user.userID === null) {
                            noRegisterUsers.push({
                                id: -(index + 1),
                                userID: -(index + 1),
                                email: user.email,
                                account: user.email,
                                userData: { email: user.email },
                                status: 1,
                            });
                        }
                    });
                    const ids = query.id
                        ? query.id.split(',').filter(id => {
                            return users.find(item => {
                                return item.userID === parseInt(`${id}`, 10);
                            });
                        })
                        : users.map((item) => item.userID).filter(item => item);
                    query.id = ids.length > 0 ? ids.filter(id => id).join(',') : '0,0';
                }
                else {
                    query.id = '0,0';
                }
            }
            if (query.rebate && query.rebate.length > 0) {
                const r = query.rebate.split(',');
                const rebateData = await new rebate_js_1.Rebate(this.app).getRebateList({
                    page: 0,
                    limit: 0,
                    search: '',
                    type: 'download',
                    low: r[0] === 'moreThan' ? parseInt(r[1], 10) : undefined,
                    high: r[0] === 'lessThan' ? parseInt(r[1], 10) : undefined,
                });
                if (rebateData && rebateData.total > 0) {
                    const ids = query.id
                        ? query.id.split(',').filter(id => {
                            return rebateData.data.find(item => {
                                return item.user_id === parseInt(`${id}`, 10);
                            });
                        })
                        : rebateData.data.map(item => item.user_id);
                    query.id = ids.join(',');
                }
                else {
                    query.id = '0,0';
                }
            }
            if (query.level && query.level.length > 0) {
                const levels = query.level.split(',');
                const levelGroup = await this.getUserGroups(['level']);
                if (levelGroup.result) {
                    let levelIds = [];
                    levelGroup.data.map(item => {
                        if (item.tag && levels.includes(item.tag)) {
                            levelIds = levelIds.concat(item.users.map(user => user.userID));
                        }
                    });
                    if (levelIds.length > 0) {
                        const ids = query.id
                            ? query.id.split(',').filter(id => {
                                return levelIds.find(item => {
                                    return item === parseInt(`${id}`, 10);
                                });
                            })
                            : levelIds;
                        query.id = ids.join(',');
                    }
                    else {
                        query.id = '0,0';
                    }
                }
            }
            if (query.id && query.id.length > 1) {
                querySql.push(`(u.userID in (${query.id}))`);
            }
            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (u.created_time BETWEEN ${database_1.default.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${database_1.default.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }
            if (query.last_order_time) {
                const last_time = query.last_order_time.split(',');
                if (last_time.length > 1) {
                    querySql.push(`
                        (lo.last_order_time BETWEEN ${database_1.default.escape(`${last_time[0]} 00:00:00`)} 
                        AND ${database_1.default.escape(`${last_time[1]} 23:59:59`)})
                    `);
                }
            }
            if (query.birth && query.birth.length > 0) {
                const birth = query.birth.split(',');
                const birthMap = birth.map(month => parseInt(`${month}`, 10));
                if (birthMap.every(n => typeof n === 'number' && !isNaN(n))) {
                    querySql.push(`(MONTH(JSON_EXTRACT(u.userData, '$.birth')) IN (${birthMap.join(',')}))`);
                }
            }
            if (query.tags && query.tags.length > 0) {
                const tags = query.tags.split(',');
                if (Array.isArray(tags) && tags.length > 0) {
                    const tagConditions = tags
                        .map(tag => `JSON_CONTAINS(u.userData->'$.tags', ${database_1.default.escape(`"${tag}"`)})`)
                        .join(' OR ');
                    querySql.push(`(${tagConditions})`);
                }
            }
            if (query.total_amount) {
                const arr = query.total_amount.split(',');
                if (arr.length > 1) {
                    if (arr[0] === 'lessThan') {
                        querySql.push(`(o.total_amount < ${arr[1]} OR o.total_amount is null)`);
                    }
                    if (arr[0] === 'moreThan') {
                        querySql.push(`(o.total_amount > ${arr[1]})`);
                    }
                }
            }
            if (query.last_order_total) {
                const arr = query.last_order_total.split(',');
                if (arr.length > 1) {
                    if (arr[0] === 'lessThan') {
                        querySql.push(`(lo.last_order_total < ${arr[1]} OR lo.last_order_total is null)`);
                    }
                    if (arr[0] === 'moreThan') {
                        querySql.push(`(lo.last_order_total > ${arr[1]})`);
                    }
                }
            }
            if (query.total_count) {
                const arr = query.total_count.split(',');
                if (arr.length > 1) {
                    if (arr[0] === 'lessThan') {
                        querySql.push(`(o.order_count < ${arr[1]} OR o.order_count is null)`);
                    }
                    if (arr[0] === 'moreThan') {
                        querySql.push(`(o.order_count > ${arr[1]})`);
                    }
                }
            }
            if (query.search) {
                const searchValue = `%${query.search}%`;
                const searchFields = [
                    {
                        key: 'name',
                        condition: `UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name'))) LIKE UPPER('${searchValue}')`,
                    },
                    {
                        key: 'phone',
                        condition: `UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.phone'))) LIKE UPPER('${searchValue}')`,
                    },
                    {
                        key: 'email',
                        condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.email')) LIKE '${searchValue}'`,
                    },
                    {
                        key: 'lineID',
                        condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.lineID')) LIKE '${searchValue}'`,
                    },
                    {
                        key: 'fb-id',
                        condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$."fb-id"')) LIKE '${searchValue}'`,
                    },
                ];
                const filteredConditions = searchFields
                    .filter(({ key }) => !query.searchType || query.searchType === key)
                    .map(({ condition }) => condition);
                if (filteredConditions.length > 0) {
                    querySql.push(`(${filteredConditions.join(' OR ')})`);
                }
            }
            if (query.filter_type !== 'excel') {
                querySql.push(`status = ${query.filter_type === 'block' ? 0 : 1}`);
            }
            const dataSQL = await this.getUserAndOrderSQL({
                select: 'o.email, o.order_count, o.total_amount, u.*, lo.last_order_total, lo.last_order_time',
                where: querySql,
                orderBy: (_c = query.order_string) !== null && _c !== void 0 ? _c : '',
                page: query.page,
                limit: query.limit,
            });
            const countSQL = await this.getUserAndOrderSQL({
                select: 'count(1)',
                where: querySql,
                orderBy: (_d = query.order_string) !== null && _d !== void 0 ? _d : '',
            });
            const userData = (await database_1.default.query(dataSQL, [])).map((dd) => {
                dd.pwd = undefined;
                dd.tag_name = '一般會員';
                return dd;
            });
            const userMap = new Map(userData.map((user) => [String(user.userID), user]));
            const levels = await this.getUserLevel(userData.map((user) => ({ userId: user.userID })));
            const levelMap = new Map(levels.map(lv => { var _a; return [lv.id, (_a = lv.data.dead_line) !== null && _a !== void 0 ? _a : '']; }));
            const queryResult = await database_1.default.query(`
                    SELECT *
                    FROM \`${this.app}\`.t_user_public_config
                    WHERE \`key\` = 'member_update'
                      AND user_id IN (${[...userMap.keys(), '-21211'].join(',')})
                `, []);
            for (const b of queryResult) {
                const tagName = (_g = (_f = (_e = b === null || b === void 0 ? void 0 : b.value) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.tag_name;
                if (tagName) {
                    const user = userMap.get(String(b.user_id));
                    if (user) {
                        user.tag_name = tagName;
                    }
                }
            }
            const processUserData = async (user) => {
                var _a;
                const _rebate = new rebate_js_1.Rebate(this.app);
                const userRebate = await _rebate.getOneRebate({ user_id: user.userID });
                user.rebate = userRebate ? userRebate.point : 0;
                user.member_deadline = (_a = levelMap.get(user.userID)) !== null && _a !== void 0 ? _a : '';
            };
            if (Array.isArray(userData) && userData.length > 0) {
                const chunkSize = 20;
                const chunkedUserData = [];
                for (let i = 0; i < userData.length; i += chunkSize) {
                    chunkedUserData.push(userData.slice(i, i + chunkSize));
                }
                for (const batch of chunkedUserData) {
                    await Promise.all(batch.map(async (user) => {
                        await processUserData(user);
                    }));
                }
            }
            return {
                data: userData.map((user) => {
                    user.order_count = user.order_count || 0;
                    user.total_amount = user.total_amount || 0;
                    return user;
                }),
                total: (await database_1.default.query(countSQL, []))[0]['count(1)'],
                extra: {
                    noRegisterUsers: noRegisterUsers.length > 0 ? noRegisterUsers : undefined,
                },
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserList Error:' + e, null);
        }
    }
    async getUserGroups(type, tag, hide_level) {
        try {
            const pass = (text) => type === undefined || type.includes(text);
            let dataList = [];
            if (pass('subscriber')) {
                const subscriberList = await database_1.default.query(`SELECT DISTINCT u.userID, s.email
                     FROM \`${this.app}\`.t_subscribe AS s
                              LEFT JOIN
                          \`${this.app}\`.t_user AS u ON s.email = JSON_EXTRACT(u.userData, '$.email');`, []);
                dataList.push({ type: 'subscriber', title: '電子郵件訂閱者', users: subscriberList });
            }
            if (pass('neverBuying') || pass('usuallyBuying')) {
                const buyingList = [];
                const buyingData = await database_1.default.query(`SELECT u.userID, c.email, JSON_UNQUOTE(JSON_EXTRACT(c.orderData, '$.email')) AS order_email
                     FROM \`${this.app}\`.t_checkout AS c
                              JOIN
                          \`${this.app}\`.t_user AS u ON c.email = JSON_EXTRACT(u.userData, '$.email')
                     WHERE c.status = 1;`, []);
                buyingData.map((item1) => {
                    const index = buyingList.findIndex(item2 => item2.userID === item1.userID);
                    if (index === -1) {
                        buyingList.push({ userID: item1.userID, email: item1.email, count: 1 });
                    }
                    else {
                        buyingList[index].count++;
                    }
                });
                const usuallyBuyingStandard = 4.5;
                const usuallyBuyingList = buyingList.filter(item => item.count > usuallyBuyingStandard);
                const neverBuyingData = await database_1.default.query(`SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email
                     FROM \`${this.app}\`.t_user
                     WHERE userID not in (${buyingList
                    .map(item => item.userID)
                    .concat([-1312])
                    .join(',')})`, []);
                dataList = dataList.concat([
                    { type: 'neverBuying', title: '尚未購買過的顧客', users: neverBuyingData },
                    { type: 'usuallyBuying', title: '已購買多次的顧客', users: usuallyBuyingList },
                ]);
            }
            if (!hide_level && pass('level')) {
                const levelData = await this.getLevelConfig();
                const levels = levelData
                    .map((item) => {
                    return { id: item.id, name: item.tag_name };
                })
                    .filter((item) => {
                    return tag ? item.id === tag : true;
                });
                for (const level of levels) {
                    dataList.push({
                        type: 'level',
                        title: `會員等級 - ${level.name}`,
                        tag: level.id,
                        users: [],
                    });
                }
                const users = await database_1.default.query(`SELECT userID
                     FROM \`${this.app}\`.t_user;`, []);
                const levelItems = await this.getUserLevel(users.map((item) => {
                    return { userId: item.userID };
                }));
                for (const levelItem of levelItems) {
                    const n = dataList.findIndex(item => item.tag === levelItem.data.id);
                    if (n > -1) {
                        dataList[n].users.push({
                            userID: levelItem.id,
                            email: levelItem.email,
                            count: 0,
                        });
                    }
                }
            }
            if (type) {
                dataList = dataList.filter(item => type.includes(item.type));
            }
            return {
                result: dataList.length > 0,
                data: dataList.map(data => {
                    data.count = data.users.length;
                    return data;
                }),
            };
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserGroups Error:' + e, null);
        }
    }
    async getLevelConfig() {
        const levelData = await this.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
        const levelList = levelData.levels || [];
        levelList.push(this.normalMember);
        return levelList;
    }
    async getUserLevel(data) {
        const dataList = [];
        const idList = data.filter(item => item.userId !== undefined).map(item => item.userId);
        const emailList = data.filter(item => item.email !== undefined).map(item => `"${item.email}"`);
        const idSQL = idList.length > 0 ? idList.join(',') : -1111;
        const emailSQL = emailList.length > 0 ? emailList.join(',') : -1111;
        const users = await database_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_user
             WHERE userID in (${idSQL})
                OR JSON_EXTRACT(userData, '$.email') in (${emailSQL})
            `, []);
        const levelList = await this.getLevelConfig();
        const normalData = {
            id: this.normalMember.id,
            og: this.normalMember,
            trigger: true,
            tag_name: this.normalMember.tag_name,
            dead_line: '',
        };
        if (users.length > 0) {
            const memberUpdates = await database_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_user_public_config
                 WHERE \`key\` = 'member_update'
                   AND user_id in (${idSQL});`, []);
            for (const user of users) {
                if (user.userData.level_status === 'manual') {
                    const member_level = levelList.find((item) => {
                        return item.id === user.userData.level_default;
                    });
                    dataList.push({
                        id: user.userID,
                        email: user.userData.email,
                        status: user.userData.level_status,
                        data: member_level !== null && member_level !== void 0 ? member_level : normalData,
                    });
                    continue;
                }
                if (memberUpdates.length > 0) {
                    const memberUpdate = await this.checkMember(user, false);
                    if (memberUpdate.length > 0) {
                        const member_level = memberUpdate.find((v) => v.trigger);
                        if (member_level) {
                            dataList.push({
                                id: user.userID,
                                email: user.userData.email,
                                status: 'auto',
                                data: member_level,
                            });
                            continue;
                        }
                    }
                }
                dataList.push({
                    id: user.userID,
                    email: user.userData.email,
                    status: 'auto',
                    data: normalData,
                });
            }
        }
        return dataList;
    }
    async subscribe(email, tag) {
        try {
            await database_1.default.queryLambada({
                database: this.app,
            }, async (sql) => {
                await sql.query(`replace
                        into t_subscribe (email,tag) values (?,?)`, [email, tag]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e, null);
        }
    }
    async registerFcm(userID, deviceToken) {
        try {
            await database_1.default.queryLambada({
                database: this.app,
            }, async (sql) => {
                await sql.query(`replace
                        into t_fcm (userID,deviceToken) values (?,?)`, [userID, deviceToken]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e, null);
        }
    }
    async deleteSubscribe(email) {
        try {
            await database_1.default.query(`delete
                 FROM \`${this.app}\`.t_subscribe
                 where email in (?)`, [email.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e, null);
        }
    }
    async getSubScribe(query) {
        var _a, _b;
        try {
            const querySql = [];
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            if (query.search) {
                querySql.push([
                    `(s.email LIKE '%${query.search}%') && (s.tag != ${database_1.default.escape(query.search)})`,
                    `(s.tag = ${database_1.default.escape(query.search)})
                        `,
                ].join(` || `));
            }
            if (query.account) {
                switch (query.account) {
                    case 'yes':
                        querySql.push(`(u.account is not null)`);
                        break;
                    case 'no':
                        querySql.push(`(u.account is null)`);
                        break;
                }
            }
            const subData = await database_1.default.query(`SELECT s.*, u.account
                 FROM \`${this.app}\`.t_subscribe AS s
                          LEFT JOIN \`${this.app}\`.t_user AS u
                                    ON s.email = u.account
                 WHERE ${querySql.length > 0 ? querySql.join(' AND ') : '1 = 1'} LIMIT ${query.page * query.limit}
                     , ${query.limit}

                `, []);
            const subTotal = await database_1.default.query(`SELECT count(*) as c
                 FROM \`${this.app}\`.t_subscribe AS s
                          LEFT JOIN \`${this.app}\`.t_user AS u
                                    ON s.email = u.account
                 WHERE ${querySql.length > 0 ? querySql.join(' AND ') : '1 = 1'}

                `, []);
            return {
                data: subData,
                total: subTotal[0].c,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'getSubScribe Error:' + e, null);
        }
    }
    async getFCM(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search &&
                querySql.push([
                    `(userID in (select userID from \`${this.app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))))`,
                ].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_fcm`).querySql(querySql, query);
            for (const b of data.data) {
                let userData = (await database_1.default.query(`select userData
                         from \`${this.app}\`.t_user
                         where userID = ?`, [b.userID]))[0];
                b.userData = userData && userData.userData;
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async deleteUser(query) {
        try {
            if (query.id) {
                await database_1.default.query(`delete
                     FROM \`${this.app}\`.t_user
                     where id in (?)`, [query.id.split(',')]);
            }
            else if (query.email) {
                await database_1.default.query(`delete
                     FROM \`${this.app}\`.t_user
                     where userData ->>'$.email'=?`, [query.email]);
            }
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e, null);
        }
    }
    async updateUserData(userID, par, manager = false) {
        var _a;
        try {
            const userData = (await database_1.default.query(`select *
                     from \`${this.app}\`.\`t_user\`
                     where userID = ${database_1.default.escape(userID)}`, []))[0];
            const login_config = await this.getConfigV2({
                key: 'login_config',
                user_id: 'manager',
            });
            const register_form = await this.getConfigV2({
                key: 'custom_form_register',
                user_id: 'manager',
            });
            register_form.list = (_a = register_form.list) !== null && _a !== void 0 ? _a : [];
            form_check_js_1.FormCheck.initialRegisterForm(register_form.list);
            if (par.userData.pwd) {
                if ((await redis_js_1.default.getValue(`verify-${userData.userData.email}`)) === par.userData.verify_code) {
                    await database_1.default.query(`update \`${this.app}\`.\`t_user\`
                         set pwd=?
                         where userID = ${database_1.default.escape(userID)}`, [await tool_1.default.hashPwd(par.userData.pwd)]);
                }
                else {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'email-verify-false',
                    });
                }
            }
            if (par.userData.email && par.userData.email !== userData.userData.email) {
                const count = (await database_1.default.query(`select count(1)
                         from \`${this.app}\`.\`t_user\`
                         where (userData ->>'$.email' = ${database_1.default.escape(par.userData.email)})
                           and (userID != ${database_1.default.escape(userID)}) `, []))[0]['count(1)'];
                if (count) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', {
                        msg: 'email-exists',
                    });
                }
                if (login_config.email_verify &&
                    par.userData.verify_code !== (await redis_js_1.default.getValue(`verify-${par.userData.email}`)) &&
                    register_form.list.find((dd) => {
                        return dd.key === 'email' && `${dd.hidden}` !== 'true';
                    })) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'email-verify-false',
                    });
                }
            }
            if (par.userData.phone && par.userData.phone !== userData.userData.phone) {
                const count = (await database_1.default.query(`select count(1)
                         from \`${this.app}\`.\`t_user\`
                         where (userData ->>'$.phone' = ${database_1.default.escape(par.userData.phone)})
                           and (userID != ${database_1.default.escape(userID)}) `, []))[0]['count(1)'];
                if (count) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', {
                        msg: 'phone-exists',
                    });
                }
                if (login_config.phone_verify &&
                    par.userData.verify_code_phone !== (await redis_js_1.default.getValue(`verify-phone-${par.userData.phone}`)) &&
                    register_form.list.find((dd) => {
                        return dd.key === 'phone' && `${dd.hidden}` !== 'true';
                    })) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', {
                        msg: 'phone-verify-false',
                    });
                }
            }
            const blockCheck = par.userData.type == 'block';
            par.status = blockCheck ? 0 : 1;
            if (par.userData.phone) {
                await database_1.default.query(`update \`${this.app}\`.t_checkout
                     set email=?
                     where id > 0
                       and email = ?`, [par.userData.phone, `${userData.userData.phone}`]);
                userData.account = par.userData.phone;
            }
            if (par.userData.email) {
                await database_1.default.query(`update \`${this.app}\`.t_checkout
                     set email=?
                     where id > 0
                       and email = ?`, [par.userData.email, `${userData.userData.email}`]);
                userData.account = par.userData.email;
            }
            par.userData = await this.checkUpdate({
                updateUserData: par.userData,
                userID: userID,
                manager: manager,
            });
            delete par.userData.verify_code;
            par = {
                account: userData.account,
                userData: JSON.stringify(par.userData),
                status: par.status,
            };
            if (!par.account) {
                delete par.account;
            }
            return {
                data: (await database_1.default.query(`update \`${this.app}\`.t_user
                     SET ?
                     WHERE 1 = 1
                       and userID = ?`, [par, userID])),
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError(e.code || 'BAD_REQUEST', e.message, e.data);
        }
    }
    async clearUselessData(userData, manager) {
        var _a, _b;
        let config = await app_js_1.default.getAdConfig(this.app, 'glitterUserForm');
        let register_form = (_a = (await this.getConfigV2({
            key: 'custom_form_register',
            user_id: 'manager',
        })).list) !== null && _a !== void 0 ? _a : [];
        form_check_js_1.FormCheck.initialRegisterForm(register_form);
        let customer_form_user_setting = (_b = (await this.getConfigV2({
            key: 'customer_form_user_setting',
            user_id: 'manager',
        })).list) !== null && _b !== void 0 ? _b : [];
        if (!Array.isArray(config)) {
            config = [];
        }
        config = config.concat(register_form).concat(customer_form_user_setting);
        Object.keys(userData).map(dd => {
            if (!config.find((d2) => {
                return d2.key === dd && (d2.auth !== 'manager' || manager);
            }) &&
                !['level_status', 'level_default', 'contact_phone', 'contact_name', 'tags'].includes(dd)) {
                delete userData[dd];
            }
        });
    }
    async checkUpdate(cf) {
        let originUserData = (await database_1.default.query(`select userData
                 from \`${this.app}\`.\`t_user\`
                 where userID = ${database_1.default.escape(cf.userID)}`, []))[0]['userData'];
        if (typeof originUserData !== 'object') {
            originUserData = {};
        }
        await this.clearUselessData(cf.updateUserData, cf.manager);
        function mapUserData(userData, originUserData) {
            Object.keys(userData).map(dd => {
                originUserData[dd] = userData[dd];
            });
        }
        mapUserData(cf.updateUserData, originUserData);
        return originUserData;
    }
    async resetPwd(user_id_and_account, newPwd) {
        try {
            const result = (await database_1.default.query(`update \`${this.app}\`.t_user
                 SET ?
                 WHERE 1 = 1
                   and ((userData ->>'$.email' = ?))`, [
                {
                    pwd: await tool_1.default.hashPwd(newPwd),
                },
                user_id_and_account,
            ]));
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async resetPwdNeedCheck(userID, pwd, newPwd) {
        try {
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where userID = ?
                       and status = 1`, [userID]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                const result = (await database_1.default.query(`update \`${this.app}\`.t_user
                     SET ?
                     WHERE 1 = 1
                       and userID = ?`, [
                    {
                        pwd: await tool_1.default.hashPwd(newPwd),
                    },
                    userID,
                ]));
                return {
                    result: true,
                };
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async updateAccountBack(token) {
        try {
            const sql = `select userData
                         from \`${this.app}\`.t_user
                         where JSON_EXTRACT(userData, '$.mailVerify') = ${database_1.default.escape(token)}`;
            const userData = (await database_1.default.query(sql, []))[0]['userData'];
            await database_1.default.execute(`update \`${this.app}\`.t_user
                 set account=${database_1.default.escape(userData.updateAccount)}
                 where JSON_EXTRACT(userData, '$.mailVerify') = ?`, [token]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
        }
    }
    async verifyPASS(token) {
        try {
            const par = {
                status: 1,
            };
            return (await database_1.default.query(`update \`${this.app}\`.t_user
                 SET ?
                 WHERE 1 = 1
                   and JSON_EXTRACT(userData, '$.mailVerify') = ?`, [par, token]));
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
        }
    }
    async checkUserExists(account) {
        try {
            return ((await database_1.default.execute(`select count(1)
                         from \`${this.app}\`.t_user
                         where userData ->>'$.email'
                           and status!=0`, [account]))[0]['count(1)'] == 1);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async checkMailAndPhoneExists(email, phone) {
        var _a, _b;
        try {
            let emailExists = false;
            let phoneExists = false;
            if (email) {
                const emailResult = await database_1.default.execute(`SELECT COUNT(1) AS count
                     FROM \`${this.app}\`.t_user
                     WHERE userData ->>'$.email' = ?
                    `, [email]);
                emailExists = ((_a = emailResult[0]) === null || _a === void 0 ? void 0 : _a.count) > 0;
            }
            if (phone) {
                const phoneResult = await database_1.default.execute(`SELECT COUNT(1) AS count
                     FROM \`${this.app}\`.t_user
                     WHERE userData ->>'$.phone' = ?
                    `, [phone]);
                phoneExists = ((_b = phoneResult[0]) === null || _b === void 0 ? void 0 : _b.count) > 0;
            }
            return {
                exist: emailExists || phoneExists,
                email,
                phone,
                emailExists,
                phoneExists,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async checkUserIdExists(id) {
        try {
            const count = (await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_user
                     where userID = ?`, [id]))[0]['count(1)'];
            return count;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async setConfig(config) {
        var _a, _b, _c;
        try {
            if (typeof config.value !== 'string') {
                config.value = JSON.stringify(config.value);
            }
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user_public_config
                         where \`key\` = ?
                           and user_id = ? `, [config.key, (_a = config.user_id) !== null && _a !== void 0 ? _a : this.token.userID]))[0]['count(1)'] === 1) {
                await database_1.default.query(`update \`${this.app}\`.t_user_public_config
                     set value=?,
                         updated_at=?
                     where \`key\` = ?
                       and user_id = ?`, [config.value, new Date(), config.key, (_b = config.user_id) !== null && _b !== void 0 ? _b : this.token.userID]);
            }
            else {
                await database_1.default.query(`insert
                     into \`${this.app}\`.t_user_public_config (\`user_id\`, \`key\`, \`value\`, updated_at)
                     values (?, ?, ?, ?)
                    `, [(_c = config.user_id) !== null && _c !== void 0 ? _c : this.token.userID, config.key, config.value, new Date()]);
            }
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfig(config) {
        try {
            return await database_1.default.execute(`select *
                 from \`${this.app}\`.t_user_public_config
                 where \`key\` = ${database_1.default.escape(config.key)}
                   and user_id = ${database_1.default.escape(config.user_id)}
                `, []);
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfigV2(config) {
        try {
            const that = this;
            const getData = await database_1.default.execute(`SELECT *
         FROM \`${this.app}\`.t_user_public_config
         WHERE ${config.key.includes(',')
                ? `\`key\` IN (${config.key
                    .split(',')
                    .map(dd => database_1.default.escape(dd))
                    .join(',')})`
                : `\`key\` = ${database_1.default.escape(config.key)}`}
         AND user_id = ${database_1.default.escape(config.user_id)}`, []);
            async function loop(data) {
                if (!data && config.user_id === 'manager') {
                    const defaultValues = {
                        customer_form_user_setting: { list: form_check_js_1.FormCheck.initialUserForm([]) },
                        global_express_country: { country: [] },
                        store_version: { version: 'v1' },
                        store_manager: {
                            list: [
                                {
                                    id: 'store_default',
                                    name: '庫存點1(預設)',
                                    note: '',
                                    address: '',
                                    manager_name: '',
                                    manager_phone: '',
                                },
                            ],
                        },
                        member_level_config: { levels: [] },
                        'language-label': { label: [] },
                        'store-information': {
                            language_setting: { def: 'zh-TW', support: ['zh-TW'] },
                        },
                        'list-header-view': {
                            'user-list': [
                                '顧客名稱',
                                '電子信箱',
                                '訂單',
                                '會員等級',
                                '累積消費',
                                '上次登入時間',
                                '社群綁定',
                                '用戶狀態',
                            ],
                        },
                    };
                    if (config.key.startsWith('terms-related-')) {
                        defaultValues[config.key] = terms_check_js_1.TermsCheck.check(config.key);
                    }
                    if (defaultValues.hasOwnProperty(config.key)) {
                        await that.setConfig({
                            key: config.key,
                            user_id: config.user_id,
                            value: defaultValues[config.key],
                        });
                        return await that.getConfigV2(config);
                    }
                }
                if (data && data.value) {
                    data.value = (await that.checkLeakData(config.key, data.value)) || data.value;
                }
                else if (config.key === 'store-information') {
                    return { language_setting: { def: 'zh-TW', support: ['zh-TW'] } };
                }
                return (data && data.value) || {};
            }
            if (config.key.includes(',')) {
                return Promise.all(config.key.split(',').map(async (dd) => ({
                    key: dd,
                    value: await loop(getData.find((d1) => d1.key === dd)),
                })));
            }
            else {
                return loop(getData[0]);
            }
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async checkLeakData(key, value) {
        var _a, _b, _c;
        switch (key) {
            case 'store-information': {
                (_a = value.language_setting) !== null && _a !== void 0 ? _a : (value.language_setting = { def: 'zh-TW', support: ['zh-TW'] });
                if (value.chat_toggle === undefined) {
                    const config = await this.getConfigV2({ key: 'message_setting', user_id: 'manager' });
                    value.chat_toggle = config.toggle;
                }
                (_b = value.checkout_mode) !== null && _b !== void 0 ? _b : (value.checkout_mode = {
                    payload: ['1', '3', '0'],
                    progress: ['shipping', 'wait', 'finish', 'arrived', 'pre_order'],
                    orderStatus: ['1', '0'],
                });
                break;
            }
            case 'menu-setting':
            case 'footer-setting':
                if (Array.isArray(value)) {
                    return { 'zh-TW': value, 'en-US': [], 'zh-CN': [] };
                }
                break;
            case 'store_manager':
                (_c = value.list) !== null && _c !== void 0 ? _c : (value.list = [
                    {
                        id: 'store_default',
                        name: '庫存點1(預設)',
                        note: '',
                        address: '',
                        manager_name: '',
                        manager_phone: '',
                    },
                ]);
                break;
            case 'customer_form_user_setting':
                value.list = form_check_js_1.FormCheck.initialUserForm(value.list);
                break;
        }
    }
    async checkEmailExists(email) {
        try {
            const count = (await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_user
                     where userData ->>'$.email' = ?`, [email]))[0]['count(1)'];
            return count;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async checkPhoneExists(phone) {
        try {
            const count = (await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_user
                     where userData ->>'$.phone' = ?`, [phone]))[0]['count(1)'];
            return count;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getUnreadCount() {
        var _a, _b;
        try {
            const last_read_time = await database_1.default.query(`SELECT value
                 FROM \`${this.app}\`.t_user_public_config
                 where \`key\` = 'notice_last_read'
                   and user_id = ?;`, [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID]);
            const date = !last_read_time[0] ? new Date('2022-01-29') : new Date(last_read_time[0].value.time);
            const count = (await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_notice
                     where user_id = ?
                       and created_time > ?`, [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID, date]))[0]['count(1)'];
            return {
                count: count,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async checkAdminPermission() {
        var _a, _b;
        try {
            const result = await database_1.default.query(`select count(1)
                 from ${process_1.default.env.GLITTER_DB}.app_config
                 where (appName = ?
                     and user = ?)
                    OR appName in (
                     (SELECT appName
                      FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                      WHERE user = ?
                        AND status = 1
                        AND invited = 1
                        AND appName = ?));`, [this.app, (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID, (_b = this.token) === null || _b === void 0 ? void 0 : _b.userID, this.app]);
            return {
                result: result[0]['count(1)'] === 1,
            };
        }
        catch (e) { }
    }
    async getNotice(cf) {
        var _a, _b, _c, _d;
        try {
            const query = [`user_id=${(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID}`];
            let last_time_read = 0;
            const last_read_time = await database_1.default.query(`SELECT value
                 FROM \`${this.app}\`.t_user_public_config
                 where \`key\` = 'notice_last_read'
                   and user_id = ?;`, [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID]);
            if (!last_read_time[0]) {
                await database_1.default.query(`insert into \`${this.app}\`.t_user_public_config (user_id, \`key\`, value, updated_at)
                     values (?, ?, ?, ?)`, [(_c = this.token) === null || _c === void 0 ? void 0 : _c.userID, 'notice_last_read', JSON.stringify({ time: new Date() }), new Date()]);
            }
            else {
                last_time_read = new Date(last_read_time[0].value.time).getTime();
                await database_1.default.query(`update \`${this.app}\`.t_user_public_config
                     set \`value\`=?
                     where user_id = ?
                       and \`key\` = ?`, [JSON.stringify({ time: new Date() }), `${(_d = this.token) === null || _d === void 0 ? void 0 : _d.userID}`, 'notice_last_read']);
            }
            const response = await new ut_database_js_1.UtDatabase(this.app, `t_notice`).querySql(query, cf.query);
            response.last_time_read = last_time_read;
            return response;
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async forgetPassword(email) {
        const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-forget', 'zh-TW');
        const code = tool_js_1.default.randomNumber(6);
        await redis_js_1.default.setValue(`forget-${email}`, code);
        await redis_js_1.default.setValue(`forget-count-${email}`, '0');
        (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, email, data.title, data.content.replace('@{{code}}', code));
    }
    static async ipInfo(ip) {
        try {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://ipinfo.io/${ip}?token=` + process_1.default.env.ip_info_auth,
                headers: {},
            };
            const db_data = (await database_1.default.query(`select *
                     from ${config_1.saasConfig.SAAS_NAME}.t_ip_info
                     where ip = ?`, [ip]))[0];
            let ip_data = db_data && db_data.data;
            if (!ip_data) {
                ip_data = (await axios_1.default.request(config)).data;
                await database_1.default.query(`insert into ${config_1.saasConfig.SAAS_NAME}.t_ip_info (ip, data)
                     values (?, ?)`, [ip, JSON.stringify(ip_data)]);
            }
            return ip_data;
        }
        catch (e) {
            return {
                country: 'TW',
            };
        }
    }
    async getCheckoutCountingModeSQL(table) {
        const asTable = table ? `${table}.` : '';
        const storeInfo = await this.getConfigV2({ key: 'store-information', user_id: 'manager' });
        const sqlQuery = [];
        const sqlObject = {
            orderStatus: {
                key: `order_status`,
                options: new Set(['1', '0', '-1']),
                addNull: new Set(['0']),
            },
            payload: {
                key: `status`,
                options: new Set(['1', '3', '0', '-1', '-2']),
                addNull: new Set(),
            },
            progress: {
                key: `progress`,
                options: new Set(['finish', 'arrived', 'shipping', 'pre_order', 'wait', 'returns']),
                addNull: new Set(['wait']),
            },
        };
        Object.entries(storeInfo.checkout_mode).forEach(([key, mode]) => {
            const obj = sqlObject[key];
            if (!Array.isArray(mode) || mode.length === 0 || !obj)
                return;
            const modeSet = new Set(mode);
            const sqlTemp = [];
            const validValues = [...obj.options].filter(val => modeSet.has(val));
            if (validValues.length > 0) {
                sqlTemp.push(`${asTable}${obj.key} IN (${validValues.map(val => `'${val}'`).join(',')})`);
            }
            if ([...obj.addNull].some(val => modeSet.has(val))) {
                sqlTemp.push(`${asTable}${obj.key} IS NULL`);
            }
            if (sqlTemp.length > 0) {
                sqlQuery.push(`(${sqlTemp.join(' OR ')})`);
            }
        });
        if (sqlQuery.length === 0) {
            return '1 = 0';
        }
        return sqlQuery.join(' AND ');
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map