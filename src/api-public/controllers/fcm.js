"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const firebase_1 = require("../../modules/firebase");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            for (const b of chunkArray(Array.from(new Set(req.body.device_token)), 20)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        if (d) {
                            new firebase_1.Firebase(req.get('g-app')).sendMessage({
                                title: req.body.title,
                                token: d,
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