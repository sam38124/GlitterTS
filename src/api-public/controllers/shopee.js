"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        console.log("req.body in get -- ", req.body);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/listenMessage', async (req, resp) => {
    try {
        console.log("req.body in post -- ", req.body);
        return response_1.default.succ(resp, {
            "result": "OK"
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/listenMessage', async (req, resp) => {
    try {
        console.log("req.body in post -- ", req);
        return response_1.default.succ(resp, {
            "result": "OK"
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=shopee.js.map