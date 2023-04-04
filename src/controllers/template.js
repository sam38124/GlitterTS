"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const template_1 = require("../services/template");
const router = express_1.default.Router();
router.post('/', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).createPage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await (new template_1.Template(req.body.token).updatePage(req.body))) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/', async (req, resp) => {
    var _a;
    try {
        return response_1.default.succ(resp, {
            result: (await (new template_1.Template(req.body.token).getPage({
                appName: req.query.appName,
                tag: ((_a = req.query.tag) !== null && _a !== void 0 ? _a : undefined)
            })))
        });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
