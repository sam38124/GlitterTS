import express from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Recommend } from '../services/recommend';

const router: express.Router = express.Router();

export = router;

router.get('/list', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Recommend(req.get('g-app') as string, req.body.token).getLinkList({
                    user_id: req.query.user_id ? `${req.query.user_id}` : undefined,
                    page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                    limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 0,
                    code:req.query.code ? `${req.query.code}` : '',
                })
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/list', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).postLink(req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/list/:id', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).putLink(req.params.id, req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/list/toggle/:id', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).toggleLink(req.params.id));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/list', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).deleteLink(req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/user', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new Recommend(req.get('g-app') as string, req.body.token).getUserList({
                    limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 0,
                    page: req.query.page ? parseInt(`${req.query.page}`, 10) : 50,
                    search: req.query.search ? `${req.query.search}` : undefined,
                    searchType: req.query.searchType ? `${req.query.searchType}` : undefined,
                    orderBy: req.query.orderBy ? `${req.query.orderBy}` : undefined,
                })
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/user', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).postUser(req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.put('/user/:id', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).putUser(req.params.id, req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/user', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await new Recommend(req.get('g-app') as string, req.body.token).deleteUser(req.body));
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
