import express from 'express';
import response from '../../modules/response';
import db from '../../modules/database';
import exception from '../../modules/exception';
import config from '../../config.js';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool';
import { User } from '../services/user';
import { UtPermission } from '../utils/ut-permission.js';
import { SharePermission } from '../services/share-permission';
import { FilterProtectData } from '../services/filter-protect-data.js';

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        const isManager = await UtPermission.isManager(req);
        const { type, email, search } = req.query;
        const actionMap: Record<string, () => Promise<any>> = {
            list: async () => {
                if (!isManager) throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
                return await user.getUserList(req.query as any);
            },
            account: async () => {
                if (!isManager) throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
                return await user.getUserData(email as string, 'account');
            },
            email: async () => {
                if (!isManager) throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
                return await user.getUserData(email as string, 'email_or_phone');
            },
            email_or_phone: async () => {
                return await user.getUserData(search as string, 'email_or_phone');
            },
            default: async () => {
                return await user.getUserData(req.body.token.userID);
            },
        };

        // 透過 `actionMap` 執行對應的函式，預設為 `default`
        const result = await (actionMap[type as string] || actionMap.default)();
        return response.succ(resp, result);
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
                      return { email: item };
                  })
                : [];
            const ids = req.query.id
                ? `${req.query.id}`.split(',').map((item) => {
                      return { userId: item };
                  })
                : [];
            return response.succ(resp, await user.getUserLevel([...emails, ...ids]));
        } else {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, await user.getUserLevel([{ userId: req.body.token.userID }]));
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
        const checkData = await user.checkMailAndPhoneExists(req.body.userData.email, req.body.userData.phone);
        if (checkData.exist) {
            throw exception.BadRequestError('BAD_REQUEST', 'user is already exists', { data: checkData });
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
        // 判斷是否為管理員
        if (!(await UtPermission.isManager(req))) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }

        const user = new User(req.get('g-app') as string);
        const responseList: any[] = [];

        // 註冊使用者
        async function checkUser(postUser: { account: string; userData: { email: string; phone: string } }) {
            const checkData = await user.checkMailAndPhoneExists(postUser.userData.email, postUser.userData.phone);
            if (checkData.exist) {
                return { pass: false, msg: 'User already exists', checkData };
            }
            return { pass: true, postUser };
        }

        // 對資料陣列做 chunk
        const userArray = Array.isArray(req.body.userArray) ? req.body.userArray : [req.body];
        const chunkSize = 20;
        const chunkedUserData = Array.from({ length: Math.ceil(userArray.length / chunkSize) }, (_, i) => userArray.slice(i * chunkSize, (i + 1) * chunkSize));
        let tempTags: string[] = [];

        for (const batch of chunkedUserData) {
            // 確認信箱電話是否存在
            const checks = await Promise.all(batch.map(checkUser));
            const errorResult = checks.find((item) => !item.pass);

            // 已存在則中止建立，並回傳
            if (errorResult) {
                throw exception.BadRequestError('BAD_REQUEST', errorResult.msg ?? 'User already exists', { data: errorResult.checkData });
            }

            // 建立顧客資料陣列，開始批次新增
            const createUserPromises = checks.map(async (check) => {
                const passUser = check.postUser;
                tempTags = tempTags.concat(passUser.userData.tags ?? []);
                return user.createUser(passUser.account, Tool.randomString(8), passUser.userData, {}, true);
            });

            const createResults = await Promise.allSettled(createUserPromises);

            createResults.forEach((result) => {
                if (result.status === 'fulfilled') {
                    responseList.push({ pass: true, type: result.value.verify, needVerify: result.value.verify });
                } else {
                    responseList.push({ pass: false, msg: 'Error processing request' });
                }
            });
        }

        // 處理會員標籤 Config
        const userTags = await user.getConfigV2({ key: 'user_general_tags', user_id: 'manager' });
        userTags.list = [...new Set([...tempTags, ...(userTags.list ?? [])])];
        await user.setConfig({
            key: 'user_general_tags',
            user_id: 'manager',
            value: userTags,
        });

        return response.succ(resp, responseList[0] || {});
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/login', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string, req.body.token);
        const { login_type, fb_token, line_token, redirect, google_token, user_id, pin, account, pwd } = req.body;

        const loginMethods: Record<string, () => Promise<any>> = {
            fb: async () => user.loginWithFb(fb_token),
            line: async () => user.loginWithLine(line_token, redirect),
            google: async () => user.loginWithGoogle(google_token, redirect),
            apple: async () => user.loginWithApple(req.body.token),
            pin: async () => user.loginWithPin(user_id, pin),
            default: async () => user.login(account, pwd),
        };

        const result = await (loginMethods[login_type] || loginMethods.default)();
        return response.succ(resp, result);
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
        return response.succ(resp, { result: true });
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

        const { page = '0', limit = '20', email, orderBy, queryType, query, status } = req.query;

        const permissionData = await new SharePermission(req.get('g-app') as string, req.body.token).getPermission({
            page: parseInt(page as string, 10) || 0,
            limit: parseInt(limit as string, 10) || 20,
            email: email as string,
            orderBy: orderBy as string,
            queryType: queryType as string,
            query: query as string,
            status: status as string,
        });

        return response.succ(resp, permissionData);
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
        const ip: any = req.query.ip || req.headers['x-real-ip'] || req.ip;
        return resp.send(await User.ipInfo(ip));
    } catch (err) {
        return response.fail(resp, err);
    }
});
