"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const router = express_1.default.Router();
router.use('*', doAuthAction);
router.use('/sample', require('./sample'));
async function doAuthAction(req, resp, next) {
    var _a;
    const token = (_a = req.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    console.log();
    let checkToken = true;
    if (checkToken) {
        next();
    }
    else {
        return response_js_1.default.fail(resp, exception_js_1.default.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}
module.exports = router;
//# sourceMappingURL=index.js.map