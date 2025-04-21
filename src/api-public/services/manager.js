"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class Manager {
    async setConfig(config) {
        try {
            await database_js_1.default.execute(`replace
            into \`${config.appName}\`.public_config (\`key\`,\`value\`,updated_at)
            values (?,?,?)
            `, [config.key, config.value, new Date()]);
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'setConfig ERROR: ' + e, null);
        }
    }
    static async getConfig(config) {
        try {
            return await this.checkData(await database_js_1.default.execute(`select *
            from \`${config.appName}\`.public_config
            where \`key\` = ${database_js_1.default.escape(config.key)}
            `, []), config.language);
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('ERROR', 'getConfig ERROR: ' + e, null);
        }
    }
    static async checkData(data, language) {
        if (data[0]) {
            let data_ = data[0];
            switch (data_.key) {
                case 'collection':
                    function loop(array) {
                        array.map(dd => {
                            if (dd.language_data && dd.language_data[language]) {
                                dd.code = dd.language_data[language].seo.domain || dd.code;
                                dd.seo_content = dd.language_data[language].seo.content || dd.seo_content;
                                dd.seo_title = dd.language_data[language].seo.title || dd.seo_title;
                                if (dd.array) {
                                    loop(dd.array);
                                }
                            }
                        });
                    }
                    loop(data_.value);
                    break;
            }
        }
        return data;
    }
    constructor(token) {
        this.token = token;
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map