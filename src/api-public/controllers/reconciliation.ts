import express from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Reconciliation } from '../services/reconciliation.js';

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      const reconciliation=new Reconciliation(req.get('g-app') as string);

      return response.succ(resp,await reconciliation.summary(req.query.filter_date as string,req.query.start_date as string,req.query.end_date as string));
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});


router.put('/', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      const reconciliation=new Reconciliation(req.get('g-app') as string);

      await reconciliation.putReconciliation(req.body as any)
      return response.succ(resp,{
        result:true
      });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
