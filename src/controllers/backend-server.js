"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../modules/response"));
const ut_permission_1 = require("../api-public/utils/ut-permission");
const backend_service_js_1 = require("../services/backend-service.js");
const router = express_1.default.Router();
router.get('/database_router', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).getDataBaseInfo()));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.delete('/ec2', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, {
                result: await (new backend_service_js_1.BackendService(req.get('g-app')).stopServer())
            });
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/ec2', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, {
                result: await (new backend_service_js_1.BackendService(req.get('g-app')).startServer())
            });
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.get('/ec2', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).serverInfo()));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.get('/api', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, (await (new backend_service_js_1.BackendService(req.get('g-app')).getApiList(req.query))));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.get('/api_router', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, (await (new backend_service_js_1.BackendService(req.get('g-app')).getApiList(req.query))));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/api', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).postApi(req.body.data)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.delete('/api', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).deleteAPI(req.body.data)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/api/shutdown', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).shutdown(req.body.data)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.get('/api_sample', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).getSampleProject()));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return response_1.default.fail(resp, err);
    }
});
router.post('/domain', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).putDomain(req.body.data)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/domain', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, (await (new backend_service_js_1.BackendService(req.get('g-app')).getDomainList(req.query))));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.delete('/domain', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).deleteDomain(req.body.data)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
router.get('/api_path', async (req, resp) => {
    try {
        if (await ut_permission_1.UtPermission.isManager(req)) {
            return response_1.default.succ(resp, await (new backend_service_js_1.BackendService(req.get('g-app')).getApiRouter(req.query)));
        }
        else {
            return response_1.default.fail(resp, {
                message: "No Permission!"
            });
        }
    }
    catch (err) {
        return response_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=backend-server.js.map