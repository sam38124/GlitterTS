import express from "express";
import response from "../../modules/response.js";
import {DataAnalyze} from "../services/data-analyze.js";
import {FbApi} from "../services/fb-api.js";

const router: express.Router = express.Router();
export = router;

// 事件追蹤
router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        await new FbApi(req.get('g-app') as string, req.body.token).post(req.body.data,req)
        return response.succ(
            resp,
            {
                result:true
            }
        );
    } catch (err) {
        return response.fail(resp, err);
    }
});
