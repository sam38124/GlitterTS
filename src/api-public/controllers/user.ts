import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import config from "../../config.js";
import {sendmail} from "../../services/ses.js";
import UserUtil from "../../utils/UserUtil.js";
import {UtPermission} from "../utils/ut-permission.js";
import {Post} from "../services/post.js";
import {UtDatabase} from "../utils/ut-database.js";

const router: express.Router = express.Router();

export = router;

router.post('/register', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if ((await user.checkUserExists(req.body.account))) {
            throw exception.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        } else {
            const res = (await user.createUser(req.body.account, req.body.pwd, req.body.userData, req))
            res.type=res.verify;
            res.needVerify=res.verify;
            return response.succ(resp, res);
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/checkMail', async (req: express.Request, resp: express.Response) => {
    try {
        let data = await db.query(`select \`value\`
                                   from \`${config.DB_NAME}\`.private_config
                                   where app_name = '${req.query['g-app']}'
                                     and \`key\` = 'glitter_loginConfig'`, [])
        if (data.length > 0) {
            data = data[0]['value']
        } else {
            data = {
                verify: `normal`,
                link: ``
            }
        }
        const user = new User(req.query['g-app'] as string);
        await user.verifyPASS(req.query.token as string)
        return resp.redirect(`${config.domain}/${req.query['g-app']}/index.html?page=${data.link}`)
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/checkMail/updateAccount', async (req: express.Request, resp: express.Response) => {
    try {
        let data = await db.query(`select \`value\`
                                   from \`${config.DB_NAME}\`.private_config
                                   where app_name = '${req.query['g-app']}'
                                     and \`key\` = 'glitter_loginConfig'`, [])
        if (data.length > 0) {
            data = data[0]['value']
        } else {
            data = {
                verify: `normal`,
                link: ``
            }
        }
        const user = new User(req.query['g-app'] as string);
        await user.updateAccountBack(req.query.token as string)
        return resp.redirect(`${config.domain}/${req.query['g-app']}/index.html?page=${data.link}`)
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/forget', async (req: express.Request, resp: express.Response) => {
    try {
        let data = await db.query(`select \`value\`
                                   from \`${config.DB_NAME}\`.private_config
                                   where app_name = '${req.get('g-app')}'
                                     and \`key\` = 'glitter_loginConfig'`, [])
        if (data.length > 0) {
            data = data[0]['value']
        } else {
            data = {
                verify: `normal`,
                link: ``
            }
        }
        const sql = `select *
                     from \`${req.get('g-app')}\`.t_user
                     where account = ${db.escape(req.body.email)}
                       and status = 1`
        const userData: any = (await db.execute(sql, []) as any);
        console.log(`userData:${sql}`)
        if (userData.length > 0) {
            const token = await UserUtil.generateToken({
                user_id: userData[0]["userID"],
                account: userData[0]["account"],
                userData: userData[0]
            })
            data.forget_content = data.forget_content ?? ''
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
                                                    </div>`
            }
            let url = data.forget_content.replace(`@{{code}}`, `${req.body.host_name}?page=${data.forget_page}&token=${token}&appName=${req.get('g-app')}&return_type=resetPassword`)
            await sendmail(`service@ncdesign.info`, req.body.email, data.forget_title || "忘記密碼", url)
            return response.succ(resp, {
                result: true
            });
        } else {
            return response.succ(resp, {
                result: false
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.post('/login', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if(req.body.login_type==='fb'){
            return response.succ(resp, (await user.loginWithFb(req.body.fb_token)));
        }else{
            return response.succ(resp, (await user.login(req.body.account, req.body.pwd)));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (req.query.type==='list' && (await UtPermission.isManager(req))) {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, (await user.getUserList(req.query as any)));
        } else {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, (await user.getUserData(req.body.token.userID)));
        }

    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/userdata', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        console.log(`userID-->`,req.query.userID )
        return response.succ(resp, (await user.getUserData(req.query.userID + "")));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if ((await UtPermission.isManager(req)) && req.query.userID) {
            return response.succ(resp, (await user.updateUserData(req.query.userID as string, req.body.userData,true)));
        } else {
            return response.succ(resp, (await user.updateUserData(req.body.token.userID, req.body.userData)));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/resetPwd', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, (await user.resetPwd(req.body.token.userID, req.body.pwd)));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/resetPwdNeedCheck', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        console.log(`pwd:${req.body.pwd}-newPwd:${req.body.newPwd}`);
        return response.succ(resp, (await user.resetPwdNeedCheck(req.body.token.userID, req.body.old_pwd, req.body.pwd)));
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const user = new User(req.get('g-app') as string);
            return response.succ(resp, (await user.deleteUser({
                id:req.body.id
            })));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/subscribe',async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
       (await user.subscribe(req.body.email as string,req.body.tag as string))
        return response.succ(resp,{
            result:true
        });
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/subscribe',async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp,(await user.getSubScribe(req.query)));
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.delete('/subscribe',async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        (await user.deleteSubscribe(req.body.email as string))
        return response.succ(resp,{
            result:true
        });
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.post('/fcm',async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        (await user.registerFcm(req.body.userID as string,req.body.deviceToken as string))
        return response.succ(resp,{
            result:true
        });
    } catch (err) {
        return response.fail(resp, err);
    }
})


router.get('/fcm',async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp,(await user.getFCM(req.query)));
    } catch (err) {
        return response.fail(resp, err);
    }
})


router.put('/public/config', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new User(req.get('g-app') as string,req.body.token);
        if (await UtPermission.isManager(req)) {
            (await post.setConfig({
                key: req.body.key,
                value: req.body.value,
                user_id:req.body.user_id ?? undefined
            }))
        } else {
            (await post.setConfig({
                key: req.body.key,
                value: req.body.value
            }))
        }
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
})
router.get('/public/config', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new User(req.get('g-app') as string, req.body.token);
        return response.succ(resp, {result: true,value: ((await post.getConfig({
                key:req.query.key as string,
                user_id:req.query.user_id as string
            }))[0] ?? {})['value'] ?? ""});
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.get('/notice',async (req: express.Request, resp: express.Response) => {
    try {
        return  response.succ(resp, await new User(req.get('g-app') as string, req.body.token).getNotice({
            query:req.query
        }))
    }catch (err) {
        return response.fail(resp, err);
    }
})

router.get('/notice/unread/count',async (req: express.Request, resp: express.Response) => {
    try {
        return  response.succ(resp, await new User(req.get('g-app') as string, req.body.token).getUnreadCount())
    }catch (err) {
        return response.fail(resp, err);
    }
})