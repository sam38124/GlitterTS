import s3bucket from '../modules/AWSLib';
import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {config, saasConfig} from "../config";
import Logger from "../modules/logger";
import {IToken} from "../models/Auth.js";
import axios from "axios";
import fs from "fs";

const mime = require('mime');
const router: express.Router = express.Router();
export = router;
router.get('/templatePrefix',async (req: express.Request, resp: express.Response)=>{
    try {
        const app=req.query.app
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME
        const s3path = fullUrl+`template/${app}`;
        return response.succ(resp, {domain:s3path});
    }catch (e) {
        return response.fail(resp, e);
    }
})
router.post('/uploadTemplate',async (req: express.Request, resp: express.Response) => {
    try {
        const TAG = `[AWS-S3][Upload-Template]`
        const logger = new Logger();
        const s3bucketName = config.AWS_S3_NAME;
        const userID = ((req.body.token as IToken) ?? {}).userID
        const app=req.body.app
        const name = req.body.fileName
        if((await db.query(`SELECT count(1) FROM \`${saasConfig.SAAS_NAME}\`.app_config
                where appName=${db.escape(app)} and user=${userID}`,[]))[0]['count(1)']==0){
            return response.fail(resp, "No permission.");
        }
        const s3path = `template/${app}/${name}`;
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            //If you use other contentType will response 403 error
            ContentType: (() => {
                if (config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`
                } else {
                    return mime.getType(fullUrl.split('.').pop())
                }
            })()
        };
        console.log(`fullUrl:${params.ContentType}`)
        await s3bucket.getSignedUrl('putObject', params, async (err: any, url: any) => {
            if (err) {
                logger.error(TAG, String(err));
                // use console.log here because logger.info cannot log err.stack correctly
                console.log(err, err.stack);

                return response.fail(resp, err);
            } else {
                return response.succ(resp, {url, fullUrl, type: params.ContentType});
            }
        })
    }catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})
router.post('/upload', async (req: express.Request, resp: express.Response) => {
    try {
        const TAG = `[AWS-S3][Upload]`
        const logger = new Logger();
        const s3bucketName = config.AWS_S3_NAME;
        const userID = ((req.body.token as IToken) ?? {}).userID ?? "guest"
        const name = req.body.fileName
        const s3path = `file/${userID}/${new Date().getTime() + '-' + name}`;
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;

        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            //If you use other contentType will response 403 error
            ContentType: (() => {
                if (config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`
                } else {
                    return mime.getType(fullUrl.split('.').pop())
                }
            })()
        };
        console.log(`fullUrl:${params.ContentType}`)
        await s3bucket.getSignedUrl('putObject', params, async (err: any, url: any) => {
            if (err) {
                logger.error(TAG, String(err));
                // use console.log here because logger.info cannot log err.stack correctly
                console.log(err, err.stack);

                return response.fail(resp, err);
            } else {
                return response.succ(resp, {url, fullUrl, type: params.ContentType});
            }
        })
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/getCrossResource', async (req: express.Request, resp: express.Response) => {
    try {
        // 下载文件
        async function downloadFile(url: string) {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer', // 设置响应类型为arraybuffer
            });

            return response.data;
        }
        // 上传文件到云端（以Google Cloud Storage为例）
        async function uploadFile(fileData:string, cloudStorageUrl:string) {
            const TAG = `[AWS-S3][Upload]`
            const logger = new Logger();
            const s3bucketName = config.AWS_S3_NAME;
            const userID = ((req.body.token as IToken) ?? {}).userID ?? "guest"
            const s3path = `file/${userID}/${new Date().getTime() + '-' + cloudStorageUrl}`;
            const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
            const params = {
                Bucket: s3bucketName,
                Key: s3path,
                Expires: 300,
                //If you use other contentType will response 403 error
                ContentType: (() => {
                    if (config.SINGLE_TYPE) {
                        return `application/x-www-form-urlencoded; charset=UTF-8`
                    } else {
                        return mime.getType(fullUrl.split('.').pop())
                    }
                })()
            };
            return new Promise<string>((resolve, reject)=>{
                 s3bucket.getSignedUrl('putObject', params,async (err: any, url: any) => {
                    if (err) {
                        logger.error(TAG, String(err));
                        // use console.log here because logger.info cannot log err.stack correctly
                        console.log(err, err.stack);
                        reject(false)
                    } else {
                        axios({
                            method: 'PUT',
                            url: url,
                            data: fileData,
                            headers: {
                                "Content-Type": params.ContentType
                            }
                        }).then(()=>{
                            console.log(fullUrl);
                            resolve(fullUrl)
                        }).catch(()=>{
                            console.log(`convertError:${fullUrl}`)
                        });

                    }
                })
            });
        }
        // 使用示例
        const fileUrl = req.body.url;
        const localFilePath = `${new Date().getTime()}${Math.random() * 100}.${fileUrl.split('.').pop().replace(/\?.*/, '')}`;
        const cloudStorageUrl = localFilePath;
        // 下载文件
        await downloadFile(fileUrl)
            .then((data) => {
                console.log('文件下载完成');
                // 将数据写入本地文件
                fs.writeFileSync(localFilePath, data);
                // 读取本地文件
                const fileData = fs.readFileSync(localFilePath) as any;
                // 上传文件到云端
                return uploadFile(fileData, cloudStorageUrl);
            })
            .then((url) => {
                console.log('文件上传完成');
                // 可以选择删除本地文件
                fs.unlinkSync(localFilePath);
                return response.succ(resp, {url: url});
            })
            .catch((error) => {
                console.error('出现错误:', error);
                return response.fail(resp, error);
            });
        // const data = await axios(req.body.url, {
        //     method: 'get',
        //     headers: {}
        // }).then((dd: any) => {
        //     return dd.data
        // })
        // return response.succ(resp, {url: cloudStorageUrl});
        // return response.succ(resp, data);
    } catch (err) {
        return response.fail(resp, err);
    }
})