var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BaseApi {
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
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const json = yield response.json();
                    resolve({ result: response.status === 200, response: json });
                }
                catch (e) {
                    resolve({ result: response.status === 200, response: '' });
                }
            })).catch(error => {
                console.log(error);
                resolve({ result: false, response: error });
            });
        });
    }
}
