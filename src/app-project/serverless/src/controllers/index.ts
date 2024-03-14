import express from "express";
import response from "../modules/response.js";
import exception from "../modules/exception.js";

const router: express.Router = express.Router();

router.use('*', doAuthAction);
/**
 * Just sample define your api router on here.
 * */
router.use('/sample',require('./sample'))


/**
 * Just sample you can write code to check user token and return check-token value.
 * */
async function doAuthAction(req: express.Request, resp: express.Response, next: express.NextFunction) {
    const token = req.get('Authorization')?.replace('Bearer ', '') as string;
    console.log()
    let checkToken = true
    if (checkToken) {
        next()
    } else {
        return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}

export = router;