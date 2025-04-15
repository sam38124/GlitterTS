"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const update_progress_track_js_1 = require("../../update-progress-track.js");
const router = express_1.default.Router();
router.get('/', async (req, resp) => {
    try {
        const app = req.get('g-app');
        return response_1.default.succ(resp, update_progress_track_js_1.StackTracker.getAllProgress(app));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/:taskId', async (req, resp) => {
    try {
        const app = req.get('g-app');
        const progress = update_progress_track_js_1.StackTracker.getProgress(req.params.taskId) || null;
        return response_1.default.succ(resp, progress);
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=progress.js.map