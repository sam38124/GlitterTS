"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucket = exports.listBuckets = void 0;
var logger_1 = require("./logger");
var aws_sdk_1 = require("aws-sdk");
var config_1 = require("../config");
var TAG = '[AWS][Init]';
var logger = new logger_1.default();
var REGION = 'us-east-1';
aws_sdk_1.default.config.update({
    accessKeyId: config_1.default.AWS_ACCESS_KEY,
    secretAccessKey: config_1.default.AWS_SecretAccessKey,
    region: 'ap-east-1'
});
aws_sdk_1.default.config.update({ region: REGION });
var s3bucket = new aws_sdk_1.default.S3();
logger.info(TAG, 'AWS accessKeyId: ' + ((_a = aws_sdk_1.default.config.credentials) === null || _a === void 0 ? void 0 : _a.accessKeyId) || 'No accessKeyId');
exports.default = s3bucket;
function listBuckets() {
    // Call S3 to list the buckets
    s3bucket.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        else {
            console.log("Success", data.Buckets);
        }
    });
}
exports.listBuckets = listBuckets;
function createBucket(name) {
    // Create S3 service object
    var s3 = new aws_sdk_1.default.S3();
    // Create the parameters for calling createBucket
    var bucketParams = {
        Bucket: name
    };
    return new Promise(function (resolve, reject) {
        s3.createBucket(bucketParams, function (err, data) {
            if (err) {
                console.log("Error", err);
                resolve(true);
            }
            else {
                resolve(true);
                console.log("Success", data.Location);
            }
        });
    });
}
exports.createBucket = createBucket;
