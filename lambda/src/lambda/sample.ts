import {lambda} from "ts-glitter/src/lambda/interface";

export const sample:any = lambda.create_function((db, request) => {
    return new Promise(async (resolve, reject) => {
        resolve('hello world');
    });
})