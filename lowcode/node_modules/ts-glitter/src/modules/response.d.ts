import * as express from 'express';
declare function succ(resp: express.Response, data: any): void;
declare function fail(resp: express.Response, err: any): void;
declare const _default: {
    succ: typeof succ;
    fail: typeof fail;
};
export default _default;
