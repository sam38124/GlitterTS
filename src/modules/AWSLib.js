"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucket = exports.listBuckets = void 0;
const logger_1 = __importDefault(require("./logger"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
const TAG = '[AWS][Init]';
const logger = new logger_1.default();
const REGION = 'us-east-1';
aws_sdk_1.default.config.update({
    accessKeyId: config_1.default.AWS_ACCESS_KEY,
    secretAccessKey: config_1.default.AWS_SecretAccessKey,
    region: 'ap-east-1'
});
aws_sdk_1.default.config.update({ region: REGION });
const s3bucket = new aws_sdk_1.default.S3();
logger.info(TAG, 'AWS accessKeyId: ' + ((_a = aws_sdk_1.default.config.credentials) === null || _a === void 0 ? void 0 : _a.accessKeyId) || 'No accessKeyId');
exports.default = s3bucket;
function listBuckets() {
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
    const s3 = new aws_sdk_1.default.S3();
    var bucketParams = {
        Bucket: name
    };
    return new Promise((resolve, reject) => {
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
//# sourceMappingURL=AWSLib.js.map