import express from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Voucher } from '../services/voucher.js';
import { Post } from '../services/post.js';

const router: express.Router = express.Router();

export = router;

router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        if (req.body.type === 'manager' &&
            !(await UtPermission.isManager(req))
        ) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await new Voucher(req.get('g-app') as string, req.body.token as any).putVoucher({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }));
        return response.succ(resp, { result: true });
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const post = new Post(req.get('g-app') as string, req.body.token);
        const postData = req.body.postData;
        postData.userID = (req.body.token && req.body.token.userID) || 0;
        if (req.body.type === 'manager' &&
            !(await UtPermission.isManager(req))
        ) {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        const data = (await post.postContent({
            userID: postData.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
        return response.succ(resp, { result: true, id: data.insertId });
    } catch (err) {
        return response.fail(resp, err);
    }
});
