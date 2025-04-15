import express from 'express';
import response from '../../modules/response';
import { StackTracker } from '../../update-progress-track.js';

const router: express.Router = express.Router();
export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
  try {
    const app = req.get('g-app') as string;
    return response.succ(resp, StackTracker.getAllProgress(app));
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/:taskId', async (req: express.Request, resp: express.Response) => {
  try {
    const app = req.get('g-app') as string;
    const progress = StackTracker.getProgress(req.params.taskId) || null;
    return response.succ(resp, progress);
  } catch (err) {
    return response.fail(resp, err);
  }
});
