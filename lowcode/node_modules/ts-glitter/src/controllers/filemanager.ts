import s3bucket from '../modules/AWSLib';
import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {config, saasConfig} from "../config";
import Logger from "../modules/logger";
const router: express.Router = express.Router();
export = router;

router.post('/upload', async (req: express.Request, resp: express.Response) => {
    try {
        const TAG=`[AWS-S3][Upload]`
        const logger = new Logger();
        const s3bucketName = config.AWS_S3_NAME;
        const userID=(req.body.token as IToken).userID
        const name=req.body.fileName
        const s3path = `file/${userID}/${new Date().getTime()+'-'+name}`;
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            //If you use other contentType will response 403 error
            ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        };
        await s3bucket.getSignedUrl('putObject', params, async (err:any, url:any) => {
            if (err) {
                logger.error(TAG, String(err));
                // use console.log here because logger.info cannot log err.stack correctly
                console.log(err, err.stack);

                return response.fail(resp, err);
            } else {
                return response.succ(resp, { url, fullUrl });
            }
        })
    } catch (err) {
        return response.fail(resp, err);
    }
});