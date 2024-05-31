import express from "express";
import response from "../modules/response";
import {UtPermission} from "../api-public/utils/ut-permission";
import config from "../config";
import {BackendService} from "../services/backend-service.js";
import path from "path";
import {Release} from "../services/release.js";
import fs from "fs";


const router: express.Router = express.Router();
export = router;

router.get('/database_router', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, await (new BackendService(req.get('g-app') as string).getDataBaseInfo()));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
});

router.delete('/ec2', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, {
                result: await (new BackendService(req.get('g-app') as string).stopServer())
            });
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
});

router.post('/ec2', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, {
                result: await (new BackendService(req.get('g-app') as string).startServer())
            });
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
});

router.get('/ec2', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).serverInfo()));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
});
//
router.get('/api',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, (await (new BackendService(req.get('g-app') as string).getApiList(req.query))));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})

router.get('/api_router',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, (await (new BackendService(req.get('g-app') as string).getApiList(req.query))));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})

router.post('/api',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).postApi(req.body.data)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})
router.delete('/api',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).deleteAPI(req.body.data)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})

router.post('/api/shutdown',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).shutdown(req.body.data as any)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})
router.get('/api_sample', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {


            return response.succ(resp, await (new BackendService(req.get('g-app') as string).getSampleProject()));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
});

router.post('/domain',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).putDomain(req.body.data)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.post('/sub_domain',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).putDomain(req.body.data)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.get('/domain',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp, (await (new BackendService(req.get('g-app') as string).getDomainList(req.query))));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})


router.delete('/domain',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).deleteDomain(req.body.data)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})


router.get('/api_path',async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(resp,  await (new BackendService(req.get('g-app') as string).getApiRouter(req.query as any)));
        } else {
            return response.fail(resp, {
                message: "No Permission!"
            });
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})