"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const shopee_1 = require("../services/shopee");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        console.log("req.body in get -- ", req.body);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getAuth', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            "result": new shopee_1.Shopee(req.get('g-app'), req.body.token).generateAuth(req.body.redirect)
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getToken', async (req, resp) => {
    try {
        console.log(req.body);
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, {
                "result": new shopee_1.Shopee(req.get('g-app'), req.body.token).getToken(req.body.code, req.body.shop_id)
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getItemList', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const itemList = await new shopee_1.Shopee(req.get('g-app'), req.body.token).getItemList(req.body.start, req.body.end);
            return response_1.default.succ(resp, itemList);
        }
    }
    catch (err) {
        console.log("here -- ok");
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