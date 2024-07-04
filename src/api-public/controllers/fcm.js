"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const firebase_1 = require("../../modules/firebase");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const app = req.get('g-app');
            let device_token_stack = [];
            for (const b of req.body.device_token) {
                if (b === 'all') {
                    device_token_stack = device_token_stack.concat((await database_1.default.query(`select * from \`${app}\`.t_fcm`, [])).map((dd) => {
                        return dd.deviceToken;
                    }));
                }
                else {
                    device_token_stack.push(b);
                }
            }
            req.body.device_token = device_token_stack;
            for (const b of chunkArray(Array.from(new Set(req.body.device_token)), 20)) {
                let check = b.length;
                let t_notice_insert = {};
                await new Promise(async (resolve) => {
                    var _a;
                    for (const d of b) {
                        const userID = ((_a = (await database_1.default.query(`select userID from \`${app}\`.t_fcm where deviceToken=?`, [d]))[0]) !== null && _a !== void 0 ? _a : {}).userID;
                        if (userID && !t_notice_insert[userID]) {
                            t_notice_insert[userID] = true;
                            await database_1.default.query(`insert into \`${app}\`.t_notice (user_id, tag, title, content, link)
                                        values (?, ?, ?, ?, ?)`, [
                                userID,
                                'manual',
                                req.body.title,
                                req.body.content,
                                req.body.link || ''
                            ]);
                        }
                        if (d) {
                            new firebase_1.Firebase(req.get('g-app')).sendMessage({
                                title: req.body.title,
                                token: d,
                                tag: req.body.tag || '',
                                link: req.body.link || '',
                                body: req.body.content
                            }).then(() => {
                                check--;
                                if (check === 0) {
                                    resolve(true);
                                }
                            });
                        }
                        else {
                            check--;
                            if (check === 0) {
                                resolve(true);
                            }
                        }
                    }
                });
            }
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
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
module.exports = router;
//# sourceMappingURL=fcm.js.map