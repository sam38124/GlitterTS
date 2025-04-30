import response from '../../modules/response.js';
import express from 'express';
import db from '../../modules/database.js';
import exception from '../../modules/exception.js';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission.js';
import { IToken } from '../models/Auth.js';
import { Article } from '../services/article.js';
import { User } from '../services/user.js';

const router: express.Router = express.Router();
export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
  try {
    let query = [`page_type = 'blog'`, `\`appName\` = ${db.escape(req.get('g-app') as string)}`];
    req.query.tag && query.push(`tag = ${db.escape(req.query.tag)}`);
    req.query.label && query.push(`(JSON_EXTRACT(page_config, '$.meta_article.tag') LIKE '%${req.query.label}%')`);
    if (!(await UtPermission.isManager(req))) {
      query.push(`
        (JSON_EXTRACT(page_config, '$.hideIndex') IS NULL
        OR JSON_EXTRACT(page_config, '$.hideIndex') != 'true')
      `);
    }
    if (req.query.search) {
      query.push(`tag like '%${req.query.search}%'`);
    }
    if (req.query.search) {
      query.push(`
        (tag like '%${req.query.search}%') || 
        (UPPER(JSON_EXTRACT(page_config, '$.meta_article.title')) LIKE UPPER('%${req.query.search}%'))
      `);
    }
    const data = await new UtDatabase(process.env.GLITTER_DB!, `page_config`).querySql(query, req.query as any);
    data.data.map((dd: any) => {
      const content = dd.content;
      if (content.language_data && content.language_data[req.headers['language'] as string]) {
        const lang_ = content.language_data[req.headers['language'] as string];
        content.name = lang_.name || content.name;
        content.seo = lang_.seo || content.seo;
        content.text = lang_.text || content.text;
        content.title = lang_.title || content.title;
        content.config = lang_.config || content.config;
      }
    });
    return response.succ(resp, data);
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/manager', async (req: express.Request, resp: express.Response) => {
  try {
    let query = [`(content->>'$.type'='article')`];
    if (req.query.for_index === 'true') {
      req.query.for_index && query.push(`((content->>'$.for_index' != 'false') || (content->>'$.for_index' IS NULL))`);
    } else {
      req.query.for_index && query.push(`((content->>'$.for_index' = 'false'))`);
    }
    req.query.page_type && query.push(`((content->>'$.page_type' = '${req.query.page_type}'))`);
    req.query.tag && query.push(`(content->>'$.tag' = ${db.escape(req.query.tag)})`);
    req.query.label && query.push(`JSON_CONTAINS(content->'$.collection', '"${req.query.label}"')`);
    if (req.query.status) {
      req.query.status && query.push(`status in (${req.query.status})`);
    } else {
      query.push(`status = 1`);
    }

    if (req.query.search) {
      query.push(
        `(content->>'$.name' like '%${req.query.search}%') || (content->>'$.title' like '%${req.query.search}%')`
      );
    }

    const collection_list_value = await new User(req.get('g-app') as string).getConfigV2({
      key: 'blog_collection',
      user_id: 'manager',
    });
    const collection_title_map: any = [];
    if (Array.isArray(collection_list_value)) {
      function loop(list: any) {
        list.map((dd: any) => {
          loop(dd.items);
          collection_title_map.push({
            link: dd.link,
            title: dd.title,
          });
        });
      }

      loop(collection_list_value);
    }
    const data = await new UtDatabase(req.get('g-app') as string, `t_manager_post`).querySql(query, req.query as any);
    if (!Array.isArray(data.data)) {
      data.data = [data.data];
    }
    data.data.map((dd: any) => {
      if (dd?.content) {
        dd.content.collection = dd.content.collection || [];
        dd.content.collection = collection_title_map.filter((d1: any) => {
          return dd.content.collection.find((d2: any) => {
            return d2 === d1.link;
          });
        });
        const content = dd.content;
        if (content.language_data && content.language_data[req.headers['language'] as string]) {
          const lang_ = content.language_data[req.headers['language'] as string];
          content.name = lang_.name || content.name;
          content.seo = lang_.seo || content.seo;
          content.text = lang_.text || content.text;
          content.config = lang_.config || content.config;
          content.description = lang_.description || content.description;
          content.title = lang_.title || content.title;
        }
      }
    });
    return response.succ(resp, data);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/manager', async (req: express.Request, resp: express.Response) => {
  try {
    if (!(await UtPermission.isManager(req))) {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }

    return response.succ(resp, {
      result: await new Article(req.get('g-app') as string, req.body.token as IToken).addArticle(
        req.body.data,
        req.body.status
      ),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.put('/manager', async (req: express.Request, resp: express.Response) => {
  try {
    if (!(await UtPermission.isManager(req))) {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
    return response.succ(resp, {
      result: await new Article(req.get('g-app') as string, req.body.token as IToken).putArticle(req.body.data),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      await db.query(
        `
          delete FROM \`${process.env.GLITTER_DB!}\`.page_config 
          where id in (?) and userID = ?
        `,
        [(req.body.id as string).split(','), (req.body.token as IToken).userID]
      );
      return response.succ(resp, { result: true });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/manager', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      await db.query(
        `delete FROM \`${req.get('g-app')}\`.t_manager_post where id in (?)
        `,
        [(req.body.id as string).split(',')]
      );
      return response.succ(resp, { result: true });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
