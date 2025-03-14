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

      return response.succ(resp,await reconciliation.summary());
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
