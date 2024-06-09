import express from "express";
import response from "../../modules/response.js";


const router: express.Router = express.Router();

export = router;

router.get('/line', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, {result: true});
    } catch (err) {
        return response.fail(resp, err);
    }
});