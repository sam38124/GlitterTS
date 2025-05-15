import path from 'path';
import express from 'express';
import cors from 'cors';
import redis from './modules/redis';
import Logger from './modules/logger';
import { v4 as uuidv4 } from 'uuid';
import { asyncHooks as asyncHook } from './modules/hooks';
import { config, ConfigSetting, saasConfig } from './config';
import contollers = require('./controllers');
import public_contollers = require('./api-public/controllers');
import database from './modules/database';
import { SaasScheme } from './services/saas-table-check';
import db from './modules/database';
import { createBucket, listBuckets } from './modules/AWSLib';
import { Live_source } from './live_source';
import * as process from 'process';
import bodyParser from 'body-parser';
import { ApiPublic } from './api-public/services/public-table-check.js';
import { Release } from './services/release.js';
import fs from 'fs';
import { App } from './services/app.js';
import { Firebase } from './modules/firebase.js';
import { GlitterUtil } from './helper/glitter-util.js';
import { Seo } from './services/seo.js';
import { Shopping } from './api-public/services/shopping.js';
import { WebSocket } from './services/web-socket.js';
import { UtDatabase } from './api-public/utils/ut-database.js';
import compression from 'compression';
import { User } from './api-public/services/user.js';
import { Schedule } from './api-public/services/schedule.js';
import { Private_config } from './services/private_config.js';
import xmlFormatter from 'xml-formatter';
import { SystemSchedule } from './services/system-schedule';
import { Ai } from './services/ai.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Monitor } from './api-public/services/monitor.js';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { extractCols, SeoConfig } from './seo-config.js';
import { Language } from './Language.js';
import { CaughtError } from './modules/caught-error.js';

export const app = express();
const logger = new Logger();

app.options('/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app,mac_address,language,currency_code');
  res.status(200).send();
});

// 配置 session
app.use(
  session({
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }, // 設定 cookie 期限一年
  })
);

app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(express.raw({ limit: '100MB' }));
app.use(express.json({ limit: '100MB' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100MB' }));
app.use(createContext);
app.use(bodyParser.raw({ type: '*/*' }));
app.use(contollers);
app.use(public_contollers);

export async function initial(serverPort: number) {
  await (async () => {
    //統一設定時區為UTC
    process.env.TZ = 'UTC';
    await database.createPool();
    await Ai.initial();
    await SaasScheme.createScheme();
    await ApiPublic.createScheme(saasConfig.SAAS_NAME as string);
    await redis.connect();
    await createAppRoute();
    await listBuckets();
    await createBucket(config.AWS_S3_NAME as string);
    logger.info('[Init]', `Server start with env: ${process.env.NODE_ENV || 'local'}`);
    await app.listen(serverPort);
    fs.mkdirSync(path.resolve(__filename, '../app-project/work-space'), { recursive: true });
    Release.removeAllFilesInFolder(path.resolve(__filename, '../app-project/work-space'));
    if (process.env.firebase) {
      await Firebase.initial();
    }
    // await UpdateScript.run()
    if (ConfigSetting.runSchedule) {
      new Schedule().main();
      new SystemSchedule().start();
    }
    //
    WebSocket.start();
    logger.info('[Init]', `Server is listening on port: ${serverPort}`);
    CaughtError.initial();
  })();
  console.log('Starting up the server now.');
}

function createContext(req: express.Request, res: express.Response, next: express.NextFunction) {
  const uuid = uuidv4();
  const ip = req.ip;
  const requestInfo = { uuid: `${uuid}`, method: `${req.method}`, url: `${req.url}`, ip: `${ip}` };
  asyncHook.getInstance().createRequestContext(requestInfo);
  next();
}

async function createAppRoute() {
  const apps = await db.execute(
    `SELECT appName
     FROM \`${saasConfig.SAAS_NAME}\`.app_config;
    `,
    []
  );
  for (const dd of apps) {
    await createAPP(dd);
  }
}

// 信任代理
app.set('trust proxy', true);

export async function createAPP(dd: any) {
  const html = String.raw;
  Live_source.liveAPP.push(dd.appName);
  // const brand_type=await App.checkBrandAndMemberType(dd.appName)
  //SHOPNEX 才可以跑排程，並且需有DOMAIN
  // if(brand_type.brand==='shopnex' && brand_type.domain){
  Schedule.app.push(dd.appName);
  // }

  const file_path = path.resolve(__dirname, '../lowcode');
  return await GlitterUtil.set_frontend_v2(
    app,
    ['/' + encodeURI(dd.appName) + '/*', '/' + encodeURI(dd.appName)].map(rout => {
      return {
        rout: rout,
        path: file_path,
        app_name: dd.appName,
        root_path: '/' + encodeURI(dd.appName) + '/',
        seoManager: async (req, resp) => {
          return await SeoConfig.seoDetail(dd.appName as string, req, resp,true);
        },
        sitemap: async (req, resp) => {
          let appName = dd.appName;
          if (req.query.appName) {
            appName = req.query.appName;
          }
          let query = [`(content->>'$.type'='article')`];
          const article: any = await new UtDatabase(appName, `t_manager_post`).querySql(query, {
            page: 0,
            limit: 10000,
          });
          const domain = (
            await db.query(
              `select \`domain\`
               from \`${saasConfig.SAAS_NAME}\`.app_config
               where appName = ?`,
              [appName]
            )
          )[0]['domain'];

          const site_map = await getSeoSiteMap(appName, req);

          const cols =
            (
              await db.query(
                `SELECT *
                 FROM \`${appName}\`.public_config
                 WHERE \`key\` = 'collection';`,
                []
              )
            )[0] ?? {};

          const language_setting = (
            await new User(appName).getConfigV2({
              key: 'store-information',
              user_id: 'manager',
            })
          ).language_setting;

          const product = (
            await new Shopping(appName).getProduct({
              page: 0,
              limit: 100000,
              collection: '',
              accurate_search_text: false,
              accurate_search_collection: true,
              min_price: undefined,
              max_price: undefined,
              status: undefined,
              channel: undefined,
              id_list: undefined,
              order_by: 'order by id desc',
              with_hide_index: undefined,
              is_manger: true,
              productType: 'product',
              filter_visible: 'true',
              language: 'zh-TW',
              currency_code: 'TWD',
            })
          ).data;
          // 創建 SitemapStream
          const stream = new SitemapStream({ hostname: `https://${domain}` });

          // 將 links 添加到 stream
          const xml = await streamToPromise(
            Readable.from(
              [
                ...(
                  await db.query(
                    `select page_config, tag, updated_time
                     from \`${saasConfig.SAAS_NAME}\`.page_config
                     where appName = ?
                       and page_config ->>'$.seo.type'='custom'
                    `,
                    [appName]
                  )
                ).map((d2: any) => {
                  if (d2.tag === 'index') {
                    return { url: `https://${domain}`, changefreq: 'weekly' };
                  } else {
                    return { url: `https://${domain}/${d2.tag}`, changefreq: 'weekly' };
                  }
                }),
                ...article.data
                  .filter((d2: any) => {
                    return d2.content.template;
                  })
                  .map((d2: any) => {
                    return {
                      url: `https://${domain}/${d2.content.for_index === 'false' ? `pages` : `blogs`}/${d2.content.tag}`,
                      changefreq: 'weekly',
                      lastmod: formatDateToISO(new Date(d2.updated_time)),
                    };
                  }),
                ...(site_map || []).map((d2: any) => {
                  return { url: `https://${domain}/${d2.url}`, changefreq: 'weekly' };
                }),
                ...(() => {
                  let array: string[] = [];
                  extractCols(cols).map((item: any) => {
                    array = array.concat(
                      language_setting.support.map((d1: any) => {
                        const seo =
                          (item.language_data &&
                            item.language_data[d1] &&
                            item.language_data[d1].seo &&
                            item.language_data[d1].seo.domain) ||
                          item.code ||
                          item.title;
                        if (d1 === language_setting.def) {
                          return { url: `https://${domain}/collections/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'zh-TW') {
                          return { url: `https://${domain}/tw/collections/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'zh-CN') {
                          return { url: `https://${domain}/cn/collections/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'en-US') {
                          return { url: `https://${domain}/en/collections/${seo}`, changefreq: 'weekly' };
                        } else {
                          return { url: `https://${domain}/${d1}/collections/${seo}`, changefreq: 'weekly' };
                        }
                      })
                    );
                  });
                  return array;
                })(),
                ...(() => {
                  let array: string[] = [];
                  product.map((dd: any) => {
                    dd = dd.content;
                    array = array.concat(
                      language_setting.support.map((d1: any) => {
                        const seo =
                          (dd.language_data &&
                            dd.language_data[d1] &&
                            dd.language_data[d1].seo &&
                            dd.language_data[d1].seo.domain) ||
                          dd.seo.domain;
                        if (d1 === language_setting.def) {
                          return { url: `https://${domain}/products/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'zh-TW') {
                          return { url: `https://${domain}/tw/products/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'zh-CN') {
                          return { url: `https://${domain}/cn/products/${seo}`, changefreq: 'weekly' };
                        } else if (d1 === 'en-US') {
                          return { url: `https://${domain}/en/products/${seo}`, changefreq: 'weekly' };
                        } else {
                          return { url: `https://${domain}/${d1}/products/${seo}`, changefreq: 'weekly' };
                        }
                      })
                    );
                  });

                  return array;
                })(),
              ]
                .filter(dd => {
                  return dd.url !== `https://${domain}/blogs`;
                })
                .concat([{ url: `https://${domain}/blogs`, changefreq: 'weekly' }])
            ).pipe(stream)
          ).then((data: any) => data.toString());

          return xml;
        },
        sitemap_list: async (req, resp) => {
          let appName = dd.appName;
          if (req.query.appName) {
            appName = req.query.appName;
          }
          const domain = (
            await db.query(
              `select \`domain\`
               from \`${saasConfig.SAAS_NAME}\`.app_config
               where appName = ?`,
              [appName]
            )
          )[0]['domain'];
          return `<?xml version="1.0" encoding="UTF-8"?>
                    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                        <!-- This is the parent sitemap linking to additional sitemaps for products, collections and pages as shown below. The sitemap can not be edited manually, but is kept up to date in real time. -->
                        <sitemap>
                            <loc>https://${domain}/sitemap_detail.xml</loc>
                        </sitemap>
                    </sitemapindex> `;
        },
        robots: async (req, resp) => {
          let appName = dd.appName;
          if (req.query.appName) {
            appName = req.query.appName;
          }
          const robots = await new User(appName).getConfigV2({
            key: 'robots_text',
            user_id: 'manager',
          });
          robots.text = robots.text || '';
          const domain = (
            await db.query(
              `select \`domain\`
               from \`${saasConfig.SAAS_NAME}\`.app_config
               where appName = ?`,
              [appName]
            )
          )[0]['domain'];
          return robots.text.replace(/\s+/g, '').replace(/\n/g, '')
            ? robots.text
            : html`User-agent: * Allow: / Sitemap: https://${domain}/sitemap.xml`;
        },
        tw_shop: async (req, resp) => {
          let appName = dd.appName;
          const escapeHtml = (text: string): string => {
            const map: Record<string, string> = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#039;',
            };
            return text.replace(/[&<>"']/g, m => map[m] || m);
          };
          if (req.query.appName) {
            appName = req.query.appName;
          }
          const products = await db.query(
            `SELECT *
             FROM \`${dd.appName}\`.t_manager_post
             WHERE JSON_EXTRACT(content, '$.type') = 'product';
            `,
            []
          );
          const domain = (
            await db.query(
              `select \`domain\`
               from \`${saasConfig.SAAS_NAME}\`.app_config
               where appName = ?`,
              [appName]
            )
          )[0]['domain'];
          let printData = products
            .map((product: any) => {
              return product.content.variants
                .map((variant: any) => {
                  return html`
                    <Product>
                      <SKU>${variant.sku}</SKU>
                      <Name>${product.content.title}</Name>
                      <Description>${dd.appName} - ${product.content.title}</Description>
                      <URL> ${`https://` + domain + '/products/' + product.content.title}</URL>
                      <Price>${variant.compare_price ?? variant.sale_price}</Price>
                      <LargeImage> ${variant.preview_image ?? ''}</LargeImage>
                      <SalePrice>${variant.sale_price}</SalePrice>
                      <Category>${product.content.collection.join('')}</Category>
                    </Product>
                  `;
                })
                .join('');
            })
            .join('');
          return xmlFormatter(`<Product>${printData}</Product>`, {
            indentation: '  ', // 使用兩個空格進行縮進
            filter: node => node.type !== 'Comment', // 選擇性過濾節點
            collapseContent: true, // 折疊內部文本
          });
        },
      };
    })
  );
}

async function getSeoSiteMap(appName: string, req: any) {
  const sqlData = await Private_config.getConfig({
    appName: appName,
    key: 'sitemap_webhook',
  });
  if (!sqlData[0] || !sqlData[0].value) {
    return undefined;
  }
  const html = String.raw;
  return await db.queryLambada(
    {
      database: appName,
    },
    async db => {
      (db as any).execute = (db as any).query;
      const functionValue: { key: string; data: () => any }[] = [
        {
          key: 'db',
          data: () => {
            return db;
          },
        },
        {
          key: 'req',
          data: () => {
            return req;
          },
        },
      ];
      const evalString = `
                return {
                execute:(${functionValue
                  .map(d2 => {
                    return d2.key;
                  })
                  .join(',')})=>{
                try {
                ${sqlData[0].value.value.replace(
                  /new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i,
                  'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })'
                )}
                }catch (e) { console.log(e) } } }
            `;
      const myFunction = new Function(evalString);
      return await myFunction().execute(functionValue[0].data(), functionValue[1].data());
    }
  );
}

function formatDateToISO(date: Date) {
  return `${date.toISOString().substring(0, date.toISOString().length - 5)}+00:00`;
}
