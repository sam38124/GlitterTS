"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
class BaseApi {
    static create(config) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: config.type,
                headers: config.headers,
                body: config.data,
                mode: 'cors'
            };
            if (requestOptions.method === 'GET') {
                requestOptions.body = undefined;
            }
            try {
                requestOptions.headers['mac_address'] = window.glitter.macAddress;
            }
            catch (e) {
            }
            fetch(config.url, requestOptions)
                .then(async (response) => {
                try {
                    const json = await response.json();
                    resolve({ result: response.status === 200, response: json });
                }
                catch (e) {
                    resolve({ result: response.status === 200, response: '' });
                }
            }).catch(error => {
                console.log(error);
                resolve({ result: false, response: error });
            });
        });
    }
}
exports.BaseApi = BaseApi;
//# sourceMappingURL=base.js.map