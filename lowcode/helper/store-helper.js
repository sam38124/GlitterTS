var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiPageConfig } from "../api/pageConfig.js";
export class StoreHelper {
    static setPlugin(ogConfig, changeConfig) {
        return new Promise((resolve, reject) => {
            ApiPageConfig.getPlugin(window.appName).then((response) => __awaiter(this, void 0, void 0, function* () {
                const config = response.response.data;
                (['homePage', 'globalStyle', 'globalScript', 'globalValue', 'globalStyleTag']).map((dd) => {
                    if (JSON.stringify(ogConfig[dd]) === JSON.stringify(changeConfig[dd])) {
                        changeConfig[dd] = config[dd];
                    }
                });
                const api = yield ApiPageConfig.setPlugin(window.appName, changeConfig);
                resolve(api.result);
            })).catch(() => {
                resolve(false);
            });
        });
    }
}
