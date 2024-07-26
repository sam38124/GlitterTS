import express from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const result = await new Mail(req.get('g-app') as string, req.body.token).postMail(req.body);
            if (!result) {
                return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'Post Mail Failed', null));
            }
            return response.succ(resp, { result: true });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
