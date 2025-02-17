import express from 'express';
import response from '../../modules/response';
import db from '../../modules/database';
import {User} from '../services/user';
import exception from '../../modules/exception';
import config, {saasConfig} from '../../config.js';
import {UtPermission} from '../utils/ut-permission.js';
import redis from '../../modules/redis.js';
import {Shopping} from '../services/shopping';
import Tool from '../../modules/tool';
import {SharePermission} from '../services/share-permission';
import {FilterProtectData} from '../services/filter-protect-data.js';
import axios from "axios";

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (req.query.type === 'list' && (await UtPermission.isManager(req))) {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserList(req.query as any));
        } else if (req.query.type === 'account' && (await UtPermission.isManager(req))) {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserData(req.query.email as any, 'account'));
        } else if (req.query.type === 'email' && (await UtPermission.isManager(req))) {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserData(req.query.email as any, 'email_or_phone'));
        } else if (req.query.type === 'email_or_phone') {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserData(req.query.search as any, 'email_or_phone'));
        } else {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserData(req.body.token.userID));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if ((await UtPermission.isManager(req)) && req.query.userID) {
            return response.succ(resp, await user.updateUserData(req.query.userID as string, req.body.userData, true));
        } else {
            return response.succ(resp, await user.updateUserData(req.body.token.userID, req.body.userData));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const user = new User(req.get('g-app') as string);
            return response.succ(
                resp,
                await user.deleteUser({
                    id: req.body.id,
                })
            );
        } else if (req.body.code === (await redis.getValue(`verify-${req.body.email}`))) {
            const user = new User(req.get('g-app') as string);
            return response.succ(
                resp,
                await user.deleteUser({
                    email: req.body.email,
                })
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/level', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const user = new User(req.get('g-app') as string);
            const emails = req.query.email
                ? `${req.query.email}`.split(',').map((item) => {
                    return {email: item};
                })
                : [];
            const ids = req.query.id
                ? `${req.query.id}`.split(',').map((item) => {
                    return {userId: item};
                })
                : [];
            return response.succ(resp, await user.getUserLevel([...emails, ...ids]));
        } else {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserLevel([{userId: req.body.token.userID}]));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/level/config', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.getLevelConfig());
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/email-verify', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        const res = await user.emailVerify(req.body.email);
        return response.succ(resp, res);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/phone-verify', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        const res = await user.phoneVerify(req.body.phone_number);
        return response.succ(resp, res);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/register', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if (await user.checkMailAndPhoneExists(req.body.userData.email, req.body.userData.phone)) {
            throw exception.BadRequestError('BAD_REQUEST', 'user is already exists', null);
        } else {
            const res = await user.createUser(req.body.account, req.body.pwd, req.body.userData, req);
            res.type = res.verify;
            res.needVerify = res.verify;
            return response.succ(resp, res);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/manager/register', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const user = new User(req.get('g-app') as string);
            if (await user.checkMailAndPhoneExists(req.body.userData.email, req.body.userData.phone)) {
                throw exception.BadRequestError('BAD_REQUEST', 'user is already exists', null);
            } else {
                const res = await user.createUser(req.body.account, Tool.randomString(8), req.body.userData, {}, true);
                res.type = res.verify;
                res.needVerify = res.verify;
                return response.succ(resp, res);
            }
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/login', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string,req.body.token);
        if (req.body.login_type === 'fb') {
            return response.succ(resp, await user.loginWithFb(req.body.fb_token));
        } else if (req.body.login_type === 'line') {
            return response.succ(resp, await user.loginWithLine(req.body.line_token, req.body.redirect));
        } else if (req.body.login_type === 'google') {
            return response.succ(resp, await user.loginWithGoogle(req.body.google_token, req.body.redirect));
        } else if (req.body.login_type === 'apple') {
            return response.succ(resp, await user.loginWithApple(req.body.token));
        } else if (req.body.login_type === 'pin'){
            return response.succ(resp, await user.loginWithPin(req.body.user_id,req.body.pin));
        }else{
            return response.succ(resp, await user.login(req.body.account, req.body.pwd));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/checkMail', async (req: express.Request, resp: express.Response) => {
    try {
        let data = await db.query(
            `select \`value\`
             from \`${config.DB_NAME}\`.private_config
             where app_name = '${req.query['g-app']}'
               and \`key\` = 'glitter_loginConfig'`,
            []
        );
        if (data.length > 0) {
            data = data[0]['value'];
        } else {
            data = {
                verify: `normal`,
                link: ``,
            };
        }
        const user = new User(req.query['g-app'] as string);
        await user.verifyPASS(req.query.token as string);
        return resp.redirect(`${config.domain}/${req.query['g-app']}/index.html?page=${data.link}`);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/checkMail/updateAccount', async (req: express.Request, resp: express.Response) => {
    try {
        let data = await db.query(
            `select \`value\`
             from \`${config.DB_NAME}\`.private_config
             where app_name = '${req.query['g-app']}'
               and \`key\` = 'glitter_loginConfig'`,
            []
        );
        if (data.length > 0) {
            data = data[0]['value'];
        } else {
            data = {
                verify: `normal`,
                link: ``,
            };
        }
        const user = new User(req.query['g-app'] as string);
        await user.updateAccountBack(req.query.token as string);
        return resp.redirect(`${config.domain}/${req.query['g-app']}/index.html?page=${data.link}`);
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/check/email/exists', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: await new User(req.get('g-app') as string).checkEmailExists(req.query.email as string),
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/check/phone/exists', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {
            result: await new User(req.get('g-app') as string).checkPhoneExists(req.query.phone as string),
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/forget', async (req: express.Request, resp: express.Response) => {
    try {
        const sql = `select *
                     from \`${req.get('g-app')}\`.t_user
                     where account = ${db.escape(req.body.email)}
                       and status = 1`;

        const userData: any = (await db.execute(sql, [])) as any;
        if (userData.length > 0) {
            await new User(req.get('g-app') as string).forgetPassword(req.body.email);
            return response.succ(resp, {
                result: true,
            });
        } else {
            return response.succ(resp, {
                result: false,
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/forget/check-code', async (req: express.Request, resp: express.Response) => {
    try {
        const forget_code = await redis.getValue(`forget-${req.body.email}`);
        const forget_count = parseInt(((await redis.getValue(`forget-count-${req.body.email}`)) as any) || '5', 10);
        if (forget_code && forget_code === req.body.code && forget_count < 5) {
            return response.succ(resp, {
                result: true,
            });
        } else {
            await redis.setValue(`forget-count-${req.body.email}`, `${forget_count + 1}`);
            throw exception.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/reset/pwd', async (req: express.Request, resp: express.Response) => {
    try {
        const forget_code = await redis.getValue(`forget-${req.body.email}`);
        if (forget_code && forget_code === req.body.code) {
            await new User(req.get('g-app') as string).resetPwd(req.body.email, req.body.pwd);
            return response.succ(resp, {
                result: true,
            });
        } else {
            await redis.deleteKey(`forget-${req.body.email}`);
            throw exception.BadRequestError('AUTH_FALSE', 'Code is not equal.', null);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/resetPwd', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.resetPwd(req.body.token.userID, req.body.pwd));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/resetPwdNeedCheck', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.resetPwdNeedCheck(req.body.token.userID, req.body.old_pwd, req.body.pwd));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/userdata', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.getUserData(req.query.userID + ''));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/group', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        const type = req.query.type ? `${req.query.type}`.split(',') : undefined;
        const tag = req.query.tag ? `${req.query.tag}` : undefined;
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await user.getUserGroups(type, tag));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/subscribe', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.getSubScribe(req.query));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/subscribe', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        await user.subscribe(req.body.email as string, req.body.tag as string);
        return response.succ(resp, {
            result: true,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/subscribe', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        await user.deleteSubscribe(req.body.email as string);
        return response.succ(resp, {
            result: true,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/fcm', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, await user.getFCM(req.query));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/fcm', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        await user.registerFcm(req.body.userID as string, req.body.deviceToken as string);
        return response.succ(resp, {
            result: true,
        });
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/public/config', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new User(req.get('g-app') as string, req.body.token);
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, {
                result: true,
                value: await post.getConfigV2({
                    key: req.query.key as string,
                    user_id: req.query.user_id as string,
                }),
            });
        } else {
            return response.succ(resp, {
                result: true,
                value: FilterProtectData.filter(
                    req.query.key as string,
                    await post.getConfigV2({
                        key: req.query.key as string,
                        user_id: req.query.user_id as string,
                    })
                ),
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/public/config', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new User(req.get('g-app') as string, req.body.token);
        if (await UtPermission.isManager(req)) {
            await post.setConfig({
                key: req.body.key,
                value: req.body.value,
                user_id: req.body.user_id ?? undefined,
            });
        } else {
            await post.setConfig({
                key: req.body.key,
                value: req.body.value,
            });
        }
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/notice', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(
            resp,
            await new User(req.get('g-app') as string, req.body.token).getNotice({
                query: req.query,
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/check-admin-auth', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await new User(req.get('g-app') as string, req.body.token || {}).checkAdminPermission());
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/notice/unread/count', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, await new User(req.get('g-app') as string, req.body.token).getUnreadCount());
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/permission', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response.succ(
            resp,
            await new SharePermission(req.get('g-app') as string, req.body.token).getPermission({
                page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 20,
                email: req.query.email ? `${req.query.email}` : undefined,
                orderBy: req.query.orderBy ? `${req.query.orderBy}` : undefined,
                queryType: req.query.queryType ? `${req.query.queryType}` : undefined,
                query: req.query.query ? `${req.query.query}` : undefined,
                status: req.query.status ? `${req.query.status}` : undefined,
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/permission', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response.succ(
            resp,
            await new SharePermission(req.get('g-app') as string, req.body.token).setPermission({
                email: req.body.email,
                config: req.body.config,
                status: req.body.status,
            })
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/permission', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response.succ(resp, await new SharePermission(req.get('g-app') as string, req.body.token).deletePermission(req.body.email));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/permission/status', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response.succ(resp, await new SharePermission(req.get('g-app') as string, req.body.token).toggleStatus(req.body.email));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/permission/invite', async (req: express.Request, resp: express.Response) => {
    try {
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response.succ(resp, await new SharePermission(req.get('g-app') as string, req.body.token).triggerInvited(req.body.email));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/permission/redirect', async (req: express.Request, resp: express.Response) => {
    try {
        return resp.send(await SharePermission.redirectHTML(`${req.query.key}`));
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.get('/ip/info', async (req: express.Request, resp: express.Response) => {
    try {
        const ip:any = req.query.ip || req.headers['x-real-ip'] || req.ip;
        return resp.send(await User.ipInfo(ip));
    } catch (err) {
        return response.fail(resp, err);
    }
});
