"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const ut_permission_js_1 = require("../api-public/utils/ut-permission.js");
const global_event_js_1 = require("../services/global-event.js");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        const event = new global_event_js_1.GlobalEvent(req.get('g-app'), req.body.token);
        return response_js_1.default.succ(resp, await event.getEvent({
            tag: req.query.tag
        }));
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const event = new global_event_js_1.GlobalEvent(req.get('g-app'), req.body.token);
            return response_js_1.default.succ(resp, await event.addEvent(req.body));
        }
        else {
            return response_js_1.default.fail(resp, { message: "No Permission!" });
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.put('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const event = new global_event_js_1.GlobalEvent(req.get('g-app'), req.body.token);
            return response_js_1.default.succ(resp, await event.putEvent(req.body));
        }
        else {
            return response_js_1.default.fail(resp, { message: "No Permission!" });
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.delete('/', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const event = new global_event_js_1.GlobalEvent(req.get('g-app'), req.body.token);
            return response_js_1.default.succ(resp, await event.deleteEvent(req.body));
        }
        else {
            return response_js_1.default.fail(resp, { message: "No Permission!" });
        }
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=global-event.js.map