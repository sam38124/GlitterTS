"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../../modules/response.js"));
const graph_api_js_1 = require("../services/graph-api.js");
const ut_permission_js_1 = require("../utils/ut-permission.js");
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const ut_database_js_1 = require("../utils/ut-database.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const router = express_1.default.Router();
router.post('/add', async (req, resp) => {
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            throw exception_js_1.default.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        }
        else {
            return response_js_1.default.succ(resp, await (new graph_api_js_1.GraphApi(req.get('g-app'))).insert({
                route: req.body.route,
                method: req.body.method,
                info: req.body.info
            }));
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.put('/update', async (req, resp) => {
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            throw exception_js_1.default.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        }
        else {
            return response_js_1.default.succ(resp, await (new graph_api_js_1.GraphApi(req.get('g-app'))).update({
                route: req.body.route,
                method: req.body.method,
                info: req.body.info,
                id: req.body.id
            }));
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/list', async (req, resp) => {
    var _a, _b;
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            throw exception_js_1.default.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        }
        else {
            let query = [];
            req.query.page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 0;
            req.query.limit = (_b = req.query.limit) !== null && _b !== void 0 ? _b : 50;
            const data = await new ut_database_js_1.UtDatabase(req.get('g-app'), `t_graph_api`).querySql(query, req.query);
            return response_js_1.default.succ(resp, data);
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.delete('/delete', async (req, resp) => {
    try {
        if (!(await ut_permission_js_1.UtPermission.isManager(req))) {
            throw exception_js_1.default.BadRequestError('NO_PERMISSION', 'Only the app manager can access this function.', null);
        }
        else {
            (await database_js_1.default.query(`delete
                             FROM \`${req.get('g-app')}\`.t_graph_api
                             where id in (${req.body.id})`, []));
            return response_js_1.default.succ(resp, { result: true });
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
['get', 'post', 'put', 'delete', 'patch'].map((dd) => {
    const html = String.raw;
    router[dd]('/', async (req, resp) => {
        try {
            const isManager = await ut_permission_js_1.UtPermission.isManager(req);
            const isAppUser = await ut_permission_js_1.UtPermission.isAppUser(req);
            let userData = (isAppUser) ? (await database_js_1.default.query(`SELECT *
                                                          FROM \`${req.get('g-app')}\`.t_user
                                                          where userID = ?`, [req.body.token.userID]))[0] : undefined;
            userData && (userData.pwd = undefined);
            const route = (await database_js_1.default.query(`select *
                                           from \`${req.get('g-app')}\`.t_graph_api
                                           where route = ?
                                             and method = ?`, [
                req.query.route,
                dd.toUpperCase()
            ]))[0];
            if (!route) {
                throw exception_js_1.default.BadRequestError('NO_API', 'Cant find this api.', null);
            }
            else {
                await database_js_1.default.queryLambada({
                    database: req.get('g-app')
                }, async (db) => {
                    db.execute = db.query;
                    const functionValue = [
                        {
                            key: 'db', data: () => {
                                return db;
                            }
                        },
                        {
                            key: 'is_manager', data: () => {
                                return isManager;
                            }
                        },
                        {
                            key: 'is_appUser', data: () => {
                                return isAppUser;
                            }
                        },
                        {
                            key: 'body', data: () => {
                                return req.body;
                            }
                        },
                        {
                            key: 'query', data: () => {
                                return req.query;
                            }
                        }, {
                            key: 'user_data', data: () => {
                                return userData;
                            }
                        }
                    ];
                    const evalString = html `
                        return {
                        execute:(${functionValue.map((d2) => {
                        return d2.key;
                    }).join(',')})=>{
                        try {
                        ${route.info.code.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })')}
                        }catch (e) {
                        console.log(e)
                        }
                        }
                        }
                    `;
                    const myFunction = new Function(evalString);
                    return response_js_1.default.succ(resp, (await (myFunction().execute(functionValue[0].data(), functionValue[1].data(), functionValue[2].data(), functionValue[3].data(), functionValue[4].data(), functionValue[5].data()))));
                });
            }
        }
        catch (err) {
            return response_js_1.default.fail(resp, err);
        }
    });
});
module.exports = router;
//# sourceMappingURL=graph-api.js.map