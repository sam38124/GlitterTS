import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import config from "../../config.js";
import {sendmail} from "../../services/ses.js";
import UserUtil from "../../utils/UserUtil.js";

const router: express.Router = express.Router();

export = router;

router.post('/register', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        if ((await user.checkUserExists(req.body.account))) {
            throw exception.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        } else {
            const res = (await user.createUser(req.body.account, req.body.pwd, req.body.userData, req))
            return response.succ(resp, {
                result: true,
                token: res.token,
                type: res.verify
            });
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
                     from \`${req.get('g-app')}\`.user
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
            const url = `<h1>${data.name}</h1>
<span style="color:black;">請前往重設您的密碼</span>
<p>
<a href="${config.domain}/${(req.get('g-app') as string)}/index.html?page=${data.forget}&token=${token}">點我前往重設密碼</a>
</p>
`
            await sendmail(`service@ncdesign.info`, req.body.email, `忘記密碼`, url)
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
        return response.succ(resp, (await user.login(req.body.account, req.body.pwd)));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, (await user.getUserData(req.body.token.userID)));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/userdata', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        return response.succ(resp, (await user.getUserData(req.query.userID + "")));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        console.log(req.body.userData);
        return response.succ(resp, (await user.updateUserData(req.body.token.userID, req.body.userData)));
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/resetPwd', async (req: express.Request, resp: express.Response) => {
    try {
        const user = new User(req.get('g-app') as string);
        console.log(`pwd:${req.body.pwd}-newPwd:${req.body.newPwd}`);
        return response.succ(resp, (await user.resetPwd(req.body.token.userID, req.body.pwd, req.body.newPwd)));
    } catch (err) {
        return response.fail(resp, err);
    }
});


