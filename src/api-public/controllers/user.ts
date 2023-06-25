import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import config from "../../config.js";

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
        return resp.redirect(`${(req.secure) ? `https` : `http`}://${req.headers.host}/${req.query['g-app']}/${data.link}`)
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

router.post('/checkEmail', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {});
    } catch (err) {
        return response.fail(resp, err);
    }
});




