"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: 'sample_post' });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: 'sample_put' });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: 'sample_delete' });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, { result: 'sample_get' });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=sample.js.map