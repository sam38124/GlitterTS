"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const AWSLib_1 = __importDefault(require("../modules/AWSLib"));
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const database_1 = __importDefault(require("../modules/database"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../modules/logger"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const mime = require('mime');
const router = express_1.default.Router();
router.get('/templatePrefix', async (req, resp) => {
    try {
        const app = req.query.app;
        const fullUrl = config_1.config.AWS_S3_PREFIX_DOMAIN_NAME;
        const s3path = fullUrl + `template/${app}`;
        return response_1.default.succ(resp, { domain: s3path });
    }
    catch (e) {
        return response_1.default.fail(resp, e);
    }
});
router.post('/uploadTemplate', async (req, resp) => {
    var _a;
    try {
        const TAG = `[AWS-S3][Upload-Template]`;
        const logger = new logger_1.default();
        const s3bucketName = config_1.config.AWS_S3_NAME;
        const userID = ((_a = req.body.token) !== null && _a !== void 0 ? _a : {}).userID;
        const app = req.body.app;
        const name = req.body.fileName;
        if ((await database_1.default.query(`SELECT count(1) FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where appName=${database_1.default.escape(app)} and user=${userID}`, []))[0]['count(1)'] == 0) {
            return response_1.default.fail(resp, "No permission.");
        }
        const s3path = `template/${app}/${name}`;
        const fullUrl = config_1.config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            ContentType: (() => {
                if (config_1.config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                }
                else {
                    return mime.getType(fullUrl.split('.').pop());
                }
            })()
        };
        console.log(`fullUrl:${params.ContentType}`);
        await AWSLib_1.default.getSignedUrl('putObject', params, async (err, url) => {
            if (err) {
                logger.error(TAG, String(err));
                console.log(err, err.stack);
                return response_1.default.fail(resp, err);
            }
            else {
                return response_1.default.succ(resp, { url, fullUrl, type: params.ContentType });
            }
        });
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
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
            ContentType: (() => {
                if (config_1.config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                }
                else {
                    return mime.getType(fullUrl.split('.').pop());
                }
            })()
        };
        console.log(`fullUrl:${params.ContentType}`);
        await AWSLib_1.default.getSignedUrl('putObject', params, async (err, url) => {
            if (err) {
                logger.error(TAG, String(err));
                console.log(err, err.stack);
                return response_1.default.fail(resp, err);
            }
            else {
                return response_1.default.succ(resp, { url, fullUrl, type: params.ContentType });
            }
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getCrossResource', async (req, resp) => {
    try {
        async function downloadFile(url) {
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
            });
            return response.data;
        }
        async function uploadFile(fileData, cloudStorageUrl) {
            var _a, _b;
            const TAG = `[AWS-S3][Upload]`;
            const logger = new logger_1.default();
            const s3bucketName = config_1.config.AWS_S3_NAME;
            const userID = (_b = ((_a = req.body.token) !== null && _a !== void 0 ? _a : {}).userID) !== null && _b !== void 0 ? _b : "guest";
            const s3path = `file/${userID}/${new Date().getTime() + '-' + cloudStorageUrl}`;
            const fullUrl = config_1.config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
            const params = {
                Bucket: s3bucketName,
                Key: s3path,
                Expires: 300,
                ContentType: (() => {
                    if (config_1.config.SINGLE_TYPE) {
                        return `application/x-www-form-urlencoded; charset=UTF-8`;
                    }
                    else {
                        return mime.getType(fullUrl.split('.').pop());
                    }
                })()
            };
            return new Promise((resolve, reject) => {
                AWSLib_1.default.getSignedUrl('putObject', params, async (err, url) => {
                    if (err) {
                        logger.error(TAG, String(err));
                        console.log(err, err.stack);
                        reject(false);
                    }
                    else {
                        (0, axios_1.default)({
                            method: 'PUT',
                            url: url,
                            data: fileData,
                            headers: {
                                "Content-Type": params.ContentType
                            }
                        }).then(() => {
                            console.log(fullUrl);
                            resolve(fullUrl);
                        }).catch(() => {
                            console.log(`convertError:${fullUrl}`);
                        });
                    }
                });
            });
        }
        const fileUrl = req.body.url;
        const localFilePath = `${new Date().getTime()}${Math.random() * 100}.${fileUrl.split('.').pop().replace(/\?.*/, '')}`;
        const cloudStorageUrl = localFilePath;
        await downloadFile(fileUrl)
            .then((data) => {
            console.log('文件下载完成');
            fs_1.default.writeFileSync(localFilePath, data);
            const fileData = fs_1.default.readFileSync(localFilePath);
            return uploadFile(fileData, cloudStorageUrl);
        })
            .then((url) => {
            console.log('文件上传完成');
            fs_1.default.unlinkSync(localFilePath);
            return response_1.default.succ(resp, { url: url });
        })
            .catch((error) => {
            console.error('出现错误:', error);
            return response_1.default.fail(resp, error);
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=filemanager.js.map