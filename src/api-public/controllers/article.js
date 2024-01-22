"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ut_database_js_1 = require("../utils/ut-database.js");
const response_js_1 = __importDefault(require("../../modules/response.js"));
const express_1 = __importDefault(require("express"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        let query = [
            `\`group\` = 'glitter-article'`,
            `\`appName\` = ${database_js_1.default.escape(req.get('g-app'))}`
        ];
        req.query.tag && query.push(`tag = ${database_js_1.default.escape(req.query.tag)}`);
        req.query.label && query.push(`(JSON_EXTRACT(page_config, '$.meta_article.tag') LIKE '%${req.query.label}%')`);
        if (req.query.search) {
            query.push(`tag like '%${req.query.search}%'`);
        }
        if (req.query.search) {
            query.push(`(tag like '%${req.query.search}%') 
            ||
             (UPPER(JSON_EXTRACT(page_config, '$.meta_article.title')) LIKE UPPER('%${req.query.search}%'))`);
        }
        const data = await new ut_database_js_1.UtDatabase(process.env.GLITTER_DB, `page_config`).querySql(query, req.query);
        return response_js_1.default.succ(resp, data);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await database_js_1.default.query(`delete
                            FROM \`${process.env.GLITTER_DB}\`.page_config
                            where id in (?)
                              and userID = ?`, [
                req.body.id.split(','),
                req.body.token.userID
            ]);
            return response_js_1.default.succ(resp, { result: true });
        }
        else {
            return response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=article.js.map