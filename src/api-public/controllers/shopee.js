"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const shopee_1 = require("../services/shopee");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
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
router.post('/getOrderAuth', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            "result": new shopee_1.Shopee(req.get('g-app'), req.body.token, 'order').generateAuth(req.body.redirect)
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getToken', async (req, resp) => {
    try {
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
router.get('/sync-status', async (req, resp) => {
    return response_1.default.succ(resp, {
        result: shopee_1.Shopee.getItemProgress.find((dd) => {
            return dd === req.get('g-app');
        }) !== undefined
    });
});
router.post('/getItemList', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            shopee_1.Shopee.getItemProgress.push(req.get('g-app'));
            const itemList = new shopee_1.Shopee(req.get('g-app'), req.body.token).getItemList(req.body.start, req.body.end);
            itemList.then(() => {
                shopee_1.Shopee.getItemProgress = shopee_1.Shopee.getItemProgress.filter((dd) => {
                    return dd !== req.get('g-app');
                });
            }).catch(() => {
                shopee_1.Shopee.getItemProgress = shopee_1.Shopee.getItemProgress.filter((dd) => {
                    return dd !== req.get('g-app');
                });
            });
            return response_1.default.succ(resp, {
                result: true
            });
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/listenMessage', async (req, resp) => {
    try {
        return response_1.default.succ(resp, {
            "result": "OK"
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/syncStock', async (req, resp) => {
    try {
        const res = await new shopee_1.Shopee(req.get('g-app'), req.body.token).asyncStockFromShopnex();
        return response_1.default.succ(resp, {
            "result": "OK",
            "response": res
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/getOrderList', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            shopee_1.Shopee.getItemProgress.push(req.get('g-app'));
            const itemList = new shopee_1.Shopee(req.get('g-app'), req.body.token).getOrderList(req.body.start, req.body.end);
            return response_1.default.succ(resp, {
                result: true
            });
        }
        else {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null);
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
['post', 'get'].map((dd) => {
    router[dd]('/stock-hook', async (req, resp) => {
        try {
            console.log(`stock-hook-body===>`, req.body);
            console.log(`stock-hook-query===>`, req.query);
            return response_1.default.succ(resp, {
                "result": "OK",
                "response": {}
            });
        }
        catch (err) {
            return response_1.default.fail(resp, err);
        }
    });
});
module.exports = router;
//# sourceMappingURL=shopee.js.map