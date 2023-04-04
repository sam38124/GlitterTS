import fs from 'fs';
import Logger from './logger';
import AWS from 'aws-sdk';
import config from "../config";

const TAG = '[AWS][Init]';
const logger = new Logger();
const REGION = 'us-east-1';
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SecretAccessKey,
    region: 'ap-east-1'
});
AWS.config.update({region: REGION});
const s3bucket = new AWS.S3();

logger.info(TAG, 'AWS accessKeyId: ' + AWS.config.credentials?.accessKeyId || 'No accessKeyId');

export default s3bucket;

export function listBuckets(){

// Call S3 to list the buckets
    s3bucket.listBuckets(function(err:any, data:any) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
        }
    });
}
export function createBucket(name: string) {
// Create S3 service object
    const s3 = new AWS.S3();

// Create the parameters for calling createBucket
    var bucketParams = {
        Bucket: name
    };
    return new Promise((resolve, reject) => {
        s3.createBucket(bucketParams, function (err, data) {
            if (err) {
                console.log("Error", err);
                resolve(true)
            } else {
                resolve(true)
                console.log("Success", data.Location);
            }
        });
    })
}