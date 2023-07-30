"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { test: true });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=t.js.map