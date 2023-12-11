"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const config_1 = require("../../config");
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_js_1 = require("../services/shopping.js");
const release_js_1 = require("../../services/release.js");
const path_1 = __importDefault(require("path"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const router = express_1.default.Router();
router.get('/release', async (req, resp) => {
    var _a, _b;
    try {
        let query = [
            `(content->>'$.type'='${req.query.type}')`
        ];
        req.query.search && query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        return response_1.default.succ(resp, await (new shopping_js_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            id: req.query.id
        })));
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/release/ios/download', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const file = new Date().getTime();
            const copyFile = path_1.default.resolve(__filename, `../../../app-project/work-space/${file}`);
            release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../../app-project/ios'), copyFile);
            release_js_1.Release.ios({
                appName: req.body.app_name,
                bundleID: req.body.bundle_id,
                glitter_domain: config_1.config.domain,
                appDomain: req.get('g-app'),
                project_router: copyFile + '/proshake.xcodeproj/project.pbxproj'
            });
            await release_js_1.Release.compressFiles(copyFile, `${copyFile}.zip`);
            const url = await release_js_1.Release.uploadFile(`${copyFile}.zip`, `${copyFile}.zip`);
            release_js_1.Release.deleteFile(`${copyFile}.zip`);
            release_js_1.Release.deleteFolder(`${copyFile}`);
            return response_1.default.succ(resp, {
                url: url
            });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.post('/release/android/download', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const file = new Date().getTime();
            const copyFile = path_1.default.resolve(__filename, `../../../app-project/work-space/${file}`);
            release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../../app-project/android'), copyFile);
            release_js_1.Release.android({
                appName: req.body.app_name,
                bundleID: req.body.bundle_id,
                glitter_domain: config_1.config.domain,
                appDomain: req.get('g-app'),
                project_router: copyFile
            });
            await release_js_1.Release.compressFiles(copyFile, `${copyFile}.zip`);
            const url = await release_js_1.Release.uploadFile(`${copyFile}.zip`, `${copyFile}.zip`);
            release_js_1.Release.deleteFile(`${copyFile}.zip`);
            release_js_1.Release.deleteFolder(`${copyFile}`);
            return response_1.default.succ(resp, {
                url: url
            });
        }
        else {
            return response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=app-release.js.map