import AWS from 'aws-sdk';
declare const s3bucket: AWS.S3;
export default s3bucket;
export declare function listBuckets(): void;
export declare function createBucket(name: string): Promise<unknown>;
