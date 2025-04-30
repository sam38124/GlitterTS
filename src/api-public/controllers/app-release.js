"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../../modules/response"));
const database_1 = __importDefault(require("../../modules/database"));
const config_1 = require("../../config");
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_js_1 = require("../services/shopping.js");
const release_js_1 = require("../../services/release.js");
const path_1 = __importDefault(require("path"));
const ut_permission_js_1 = require("../utils/ut-permission.js");
const private_config_js_1 = require("../../services/private_config.js");
const ios_release_js_1 = require("../../services/ios-release.js");
const router = express_1.default.Router();
router.get('/release', async (req, resp) => {
    var _a, _b;
    try {
        let query = [`(content->>'$.type'='${req.query.type}')`];
        req.query.search &&
            query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
        return response_1.default.succ(resp, await new shopping_js_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
            page: ((_a = req.query.page) !== null && _a !== void 0 ? _a : 0),
            limit: ((_b = req.query.limit) !== null && _b !== void 0 ? _b : 50),
            id: req.query.id,
        }));
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
            const domain = (await database_1.default.query(`select \`domain\`
           from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
           where appName = ?`, [req.get('g-app')]))[0]['domain'];
            const config = (await private_config_js_1.Private_config.getConfig({
                appName: req.get('g-app'),
                key: 'glitter_app_release',
            }))[0].value;
            await ios_release_js_1.IosRelease.start({
                appName: config.name,
                bundleID: config.ios_app_bundle_id || (domain),
                glitter_domain: config.domain,
                appDomain: req.get('g-app'),
                project_router: copyFile + '/proshake.xcodeproj/project.pbxproj',
                domain_url: domain,
                config: config,
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
        console.error(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/release/android/download', async (req, resp) => {
    try {
        if (await ut_permission_js_1.UtPermission.isManager(req)) {
            const file = new Date().getTime();
            const copyFile = path_1.default.resolve(__filename, `../../../app-project/work-space/${file}`);
            release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../../app-project/android'), copyFile);
            const domain = (await database_1.default.query(`select \`domain\`
           from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
           where appName = ?`, [req.get('g-app')]))[0]['domain'];
            const config = (await private_config_js_1.Private_config.getConfig({
                appName: req.get('g-app'),
                key: 'glitter_app_release',
            }))[0].value;
            await release_js_1.Release.android({
                appName: config.name,
                bundleID: config.ios_app_bundle_id || (domain),
                glitter_domain: config.domain,
                appDomain: req.get('g-app'),
                project_router: copyFile,
                domain_url: domain,
                config: config
            });
            await release_js_1.Release.compressFiles(copyFile, `${copyFile}.zip`);
            const url = await release_js_1.Release.uploadFile(`${copyFile}.zip`, `${copyFile}.zip`);
            release_js_1.Release.deleteFile(`${copyFile}.zip`);
            release_js_1.Release.deleteFolder(`${copyFile}`);
            return response_1.default.succ(resp, {
                url: url,
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