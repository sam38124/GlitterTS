var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
export class BaseApi {
    static create(config) {
        return new Promise((resolve, reject) => {
            var _a;
            const requestOptions = {
                method: config.type,
                headers: config.headers,
                body: config.data,
                mode: 'cors',
                credentials: 'include',
            };
            if (requestOptions.method === 'GET') {
                requestOptions.body = undefined;
            }
            const url = new URL(config.url);
            if (url.origin !== location.origin) {
                delete requestOptions.credentials;
            }
            try {
                requestOptions.headers['mac_address'] = window.glitter.macAddress;
                requestOptions.headers['language'] = requestOptions.headers['language'] || Language.getLanguage();
                requestOptions.headers['currency_code'] =
                    requestOptions.headers['currency_code'] || ((_a = Currency.getCurrency()) === null || _a === void 0 ? void 0 : _a.currency_code);
            }
            catch (e) { }
            fetch(config.url, requestOptions)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const json = yield response.json();
                    resolve({ result: response.status === 200, response: json });
                }
                catch (e) {
                    resolve({ result: response.status === 200, response: '' });
                }
            }))
                .catch(error => {
                console.log(`fetch-error`, error);
                resolve({ result: false, response: error });
            });
        });
    }
}
