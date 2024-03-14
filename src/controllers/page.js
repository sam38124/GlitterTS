"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const page_js_1 = require("../services/page.js");
const router = express_1.default.Router();
router.post('/template', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await new page_js_1.Page(req.body.token).postTemplate({
                appName: req.body.appName,
                data: req.body.config,
                tag: req.body.tag
            })) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/template', async (req, resp) => {
    try {
        return response_1.default.succ(resp, { result: (await new page_js_1.Page(req.body.token).getTemplate(req.query)) });
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/tag_list', async (req, resp) => {
    try {
        return response_1.default.succ(resp, (await new page_js_1.Page(req.body.token).getTagList(req.query.type, req.query.template_from)));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=page.js.map