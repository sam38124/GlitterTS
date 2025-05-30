import express from 'express';
import response from '../../modules/response';
import db from '../../modules/database';
import { config, saasConfig } from '../../config';
import { Post } from '../services/post';
import exception from '../../modules/exception';
import { Shopping } from '../services/shopping.js';
import { Release } from '../../services/release.js';
import path from 'path';
import { UtPermission } from '../utils/ut-permission.js';
import { Private_config } from '../../services/private_config.js';
import { IosRelease } from '../../services/ios-release.js';

const router: express.Router = express.Router();

export = router;

router.get('/release', async (req: express.Request, resp: express.Response) => {
  try {
    let query = [`(content->>'$.type'='${req.query.type}')`];
    req.query.search &&
      query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).querySql(query, {
        page: (req.query.page ?? 0) as number,
        limit: (req.query.limit ?? 50) as number,
        id: req.query.id as string,
      })
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.post('/release/ios/download', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      const file = new Date().getTime();
      const copyFile = path.resolve(__filename, `../../../app-project/work-space/${file}`);
      Release.copyFolderSync(path.resolve(__filename, '../../../app-project/ios'), copyFile);
      const domain = (
        await db.query(
          `select \`domain\`
           from \`${saasConfig.SAAS_NAME}\`.app_config
           where appName = ?`,
          [req.get('g-app')]
        )
      )[0]['domain'];

      const config = (
        await Private_config.getConfig({
          appName: req.get('g-app') as string,
          key: 'glitter_app_release',
        })
      )[0].value;

      await IosRelease.start({
        appName: config.name,
        bundleID: config.ios_app_bundle_id || (domain),
        glitter_domain: config.domain as string,
        appDomain: req.get('g-app') as string,
        project_router: copyFile + '/proshake.xcodeproj/project.pbxproj',
        domain_url: domain,
        config: config,
      });

      await Release.compressFiles(copyFile,`${copyFile}.zip`)
      const url=await Release.uploadFile(`${copyFile}.zip`,`${copyFile}.zip`)
      Release.deleteFile(`${copyFile}.zip`)
      Release.deleteFolder(`${copyFile}`)
      return response.succ(resp, {
          url: url
      });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    console.error(err);
    return response.fail(resp, err);
  }
});

router.post('/release/android/download', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      const file = new Date().getTime();
      const copyFile = path.resolve(__filename, `../../../app-project/work-space/${file}`);
      Release.copyFolderSync(path.resolve(__filename, '../../../app-project/android'), copyFile);
      const domain = (
        await db.query(
          `select \`domain\`
           from \`${saasConfig.SAAS_NAME}\`.app_config
           where appName = ?`,
          [req.get('g-app')]
        )
      )[0]['domain'];
      const config = (
        await Private_config.getConfig({
          appName: req.get('g-app') as string,
          key: 'glitter_app_release',
        })
      )[0].value;
      await Release.android({
        appName: config.name,
        bundleID: config.ios_app_bundle_id || (domain),
        glitter_domain: config.domain as string,
        appDomain: req.get('g-app') as string,
        project_router: copyFile,
        domain_url: domain,
        config:config
      });
      await Release.compressFiles(copyFile, `${copyFile}.zip`);
      const url = await Release.uploadFile(`${copyFile}.zip`, `${copyFile}.zip`);
      Release.deleteFile(`${copyFile}.zip`);
      Release.deleteFolder(`${copyFile}`);
      return response.succ(resp, {
        url: url,
      });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
