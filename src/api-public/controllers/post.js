"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const database_1 = __importDefault(require("../../modules/database"));
const post_1 = require("../services/post");
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_js_1 = require("../services/shopping.js");
const ut_permission_js_1 = require("../utils/ut-permission.js");
const ut_database_js_1 = require("../utils/ut-database.js");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = (req.body.token && req.body.token.userID) || 0;
        if (req.body.type === 'manager' &&
            !(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        const data = (await post.postContent({
            userID: postData.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
        return response_1.default.succ(resp, { result: true, id: data.insertId });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const data = (await post.getContent(req.query));
        data.result = true;
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/user', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const data = (await post.getContentV2(req.query, false));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/manager', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const data = (await post.getContentV2(req.query, true));
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        const post = new post_1.Post(req.get('g-app'), req.body.token);
        const postData = req.body.postData;
        postData.userID = req.body.token.userID;
        if (req.body.type === 'manager' &&
            !(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        (await post.putContent({
            userID: req.body.token.userID,
            content: JSON.stringify(postData),
        }, req.body.type === 'manager' ? `t_manager_post` : `t_post`));
        return response_1.default.succ(resp, { result: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/manager', async (req, resp) => {
    var _a, _b;
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            let query = [
                `(content->>'$.type'='${req.query.type}')`
            ];
            req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
            return response_1.default.succ(resp, await (new shopping_js_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
                page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
                limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
                id: req.query.id
            })));
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/manager', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await database_1.default.query(`delete
                            FROM \`${req.get('g-app')}\`.t_manager_post
                            where id in (?)`, [req.query.id.split(',')]);
            return response_1.default.succ(resp, { result: true });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/user', async (req, resp) => {
    try {
        if ((await ut_permission_js_1.UtPermission.isManager(req))) {
            await database_1.default.query(`delete
                            FROM \`${req.get('g-app')}\`.t_post
                            where id in (?)`, [req.query.id.split(',')]);
            return response_1.default.succ(resp, { result: true });
        }
        else {
            await database_1.default.query(`delete
                            FROM \`${req.get('g-app')}\`.t_post
                            where id in (?) and userID=?`, [req.query.id.split(','), req.body.token.userID]);
            return response_1.default.succ(resp, { result: true });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/user', async (req, resp) => {
    try {
        let query = [
            `(content->>'$.type'='${req.query.type}')`
        ];
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_post`).querySql(query, req.query);
        return response_1.default.succ(resp, data);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=post.js.map