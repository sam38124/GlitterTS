"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
const interface_1 = require("ts-glitter/src/lambda/interface");
exports.sample = interface_1.lambda.create_function((db, request) => {
    return new Promise(async (resolve, reject) => {
        resolve('hello world');
    });
});
//# sourceMappingURL=sample.js.map