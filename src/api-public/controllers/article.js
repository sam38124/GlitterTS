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
const article_js_1 = require("../services/article.js");
const user_js_1 = require("../services/user.js");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        let query = [`page_type = 'blog'`, `\`appName\` = ${database_js_1.default.escape(req.get('g-app'))}`];
        req.query.tag && query.push(`tag = ${database_js_1.default.escape(req.query.tag)}`);
        req.query.label && query.push(`(JSON_EXTRACT(page_config, '$.meta_article.tag') LIKE '%${req.query.label}%')`);
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            query.push(`(JSON_EXTRACT(page_config, '$.hideIndex') IS NULL
   OR JSON_EXTRACT(page_config, '$.hideIndex') != 'true')`);
        }
        if (req.query.search) {
            query.push(`tag like '%${req.query.search}%'`);
        }
        if (req.query.search) {
            query.push(`(tag like '%${req.query.search}%') 
            ||
             (UPPER(JSON_EXTRACT(page_config, '$.meta_article.title')) LIKE UPPER('%${req.query.search}%'))`);
        }
        const data = (await new ut_database_js_1.UtDatabase(process.env.GLITTER_DB, `page_config`).querySql(query, req.query));
        data.data.map((dd) => {
            const content = dd.content;
            if (content.language_data && content.language_data[req.headers['language']]) {
                const lang_ = content.language_data[req.headers['language']];
                content.name = lang_.name || content.name;
                content.seo = lang_.seo || content.seo;
                content.text = lang_.text || content.text;
                content.config = lang_.config || content.config;
            }
        });
        return response_js_1.default.succ(resp, data);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/manager', async (req, resp) => {
    try {
        let query = [`(content->>'$.type'='article')`];
        if (req.query.for_index === 'true') {
            req.query.for_index && query.push(`((content->>'$.for_index' != 'false') || (content->>'$.for_index' IS NULL))`);
        }
        else {
            req.query.for_index && query.push(`((content->>'$.for_index' = 'false'))`);
        }
        req.query.page_type && query.push(`((content->>'$.page_type' = '${req.query.page_type}'))`);
        req.query.tag && query.push(`(content->>'$.tag' = ${database_js_1.default.escape(req.query.tag)})`);
        req.query.label && query.push(`JSON_CONTAINS(content->'$.collection', '"${req.query.label}"')`);
        if (req.query.status) {
            req.query.status && query.push(`status in (${req.query.status})`);
        }
        else {
            query.push(`status = 1`);
        }
        if (req.query.search) {
            query.push(`(content->>'$.name' like '%${req.query.search}%') || (content->>'$.title' like '%${req.query.search}%')`);
        }
        const collection_list_value = await new user_js_1.User(req.get('g-app')).getConfigV2({
            key: 'blog_collection',
            user_id: 'manager',
        });
        const collection_title_map = [];
        if (Array.isArray(collection_list_value)) {
            function loop(list) {
                list.map((dd) => {
                    loop(dd.items);
                    collection_title_map.push({
                        link: dd.link,
                        title: dd.title,
                    });
                });
            }
            loop(collection_list_value);
        }
        const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_manager_post`).querySql(query, req.query);
        if (!Array.isArray(data.data)) {
            data.data = [data.data];
        }
        data.data.map((dd) => {
            dd.content.collection = dd.content.collection || [];
            dd.content.collection = collection_title_map.filter((d1) => {
                return dd.content.collection.find((d2) => {
                    return d2 === d1.link;
                });
            });
            const content = dd.content;
            if (content.language_data && content.language_data[req.headers['language']]) {
                const lang_ = content.language_data[req.headers['language']];
                content.name = lang_.name || content.name;
                content.seo = lang_.seo || content.seo;
                content.text = lang_.text || content.text;
                content.config = lang_.config || content.config;
                content.description = lang_.description || content.description;
                content.title = lang_.title || content.title;
            }
        });
        return response_js_1.default.succ(resp, data);
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/manager', async (req, resp) => {
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response_js_1.default.succ(resp, {
            result: await new article_js_1.Article(req.get('g-app'), req.body.token).addArticle(req.body.data, req.body.status),
        });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.put('/manager', async (req, resp) => {
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            return response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
        return response_js_1.default.succ(resp, {
            result: await new article_js_1.Article(req.get('g-app'), req.body.token).putArticle(req.body.data),
        });
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
                   and userID = ?`, [req.body.id.split(','), req.body.token.userID]);
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
router.delete('/manager', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            await database_js_1.default.query(`delete
                 FROM \`${req.get('g-app')}\`.t_manager_post
                 where id in (?)`, [req.body.id.split(',')]);
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