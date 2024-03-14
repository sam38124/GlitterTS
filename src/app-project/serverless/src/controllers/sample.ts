import express from "express";
import response from "../modules/response.js";

const router: express.Router = express.Router();
export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: 'sample_post'});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: 'sample_put'});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: 'sample_delete'});
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: 'sample_get'});
    } catch (err) {
        return response.fail(resp, err);
    }
});