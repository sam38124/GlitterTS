"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const AWSLib_1 = __importDefault(require("../modules/AWSLib"));
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../modules/logger"));
const router = express_1.default.Router();
router.post('/upload', async (req, resp) => {
    var _a, _b;
    try {
        const TAG = `[AWS-S3][Upload]`;
        const logger = new logger_1.default();
        const s3bucketName = config_1.config.AWS_S3_NAME;
        const userID = (_b = ((_a = req.body.token) !== null && _a !== void 0 ? _a : {}).userID) !== null && _b !== void 0 ? _b : "guest";
        const name = req.body.fileName;
        const s3path = `file/${userID}/${new Date().getTime() + '-' + name}`;
        const fullUrl = config_1.config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        };
        await AWSLib_1.default.getSignedUrl('putObject', params, async (err, url) => {
            if (err) {
                logger.error(TAG, String(err));
                console.log(err, err.stack);
                return response_1.default.fail(resp, err);
            }
            else {
                return response_1.default.succ(resp, { url, fullUrl });
            }
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
