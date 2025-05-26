import path from 'path';
import admin from 'firebase-admin';
import { ConfigSetting } from '../config';
import db from '../modules/database';
import { WebSocket } from '../services/web-socket.js';
import { CaughtError } from './caught-error.js';
import exception from './exception.js';
import { AutoSendEmail } from '../api-public/services/auto-send-email.js';

export class Firebase {
  public app: string = '';

  constructor(app: string) {
    this.app = app;
  }

  public static async initial() {
    console.log(
      `fireBaseInitial:${admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))}`
    );
    admin.initializeApp(
      {
        credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`)),
      },
      'glitter'
    );
    admin.initializeApp({
      credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`)),
    });
  }

  public static async appRegister(cf: { appID: string; appName: string; type: 'android' | 'ios' }) {
    try {
      if (cf.type === 'ios') {
        // 註冊 iOS 應用
        await admin.projectManagement().createIosApp(cf.appID, cf.appName);
      } else {
        // 註冊 Android 應用
        await admin.projectManagement().createAndroidApp(cf.appID, cf.appName);
      }
    } catch (e) {}
  }

  public static async getConfig(cf: { appID: string; type: 'android' | 'ios'; appDomain: string }) {
    try {
      if (cf.type === 'ios') {
        for (const b of await admin.projectManagement().listIosApps()) {
          if ((await b.getMetadata()).bundleId === cf.appID) {
            await b.setDisplayName(cf.appDomain);
            return await b.getConfig();
          }
        }
      } else {
        for (const b of await admin.projectManagement().listAndroidApps()) {
          if ((await b.getMetadata()).packageName === cf.appID) {
            await b.setDisplayName(cf.appDomain);
            return await b.getConfig();
          }
        }
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  public async sendMessage(cf: {
    token?: string | string[];
    userID?: string;
    title: string;
    tag: string;
    link: string;
    body: string;
    app?: string;
    pass_store?: boolean;
  }) {
    cf.body = cf.body.replace(/<br\s*\/?>/gi, '\n');
    if (cf.userID) {
      WebSocket.noticeChangeMem[cf.userID] &&
        WebSocket.noticeChangeMem[cf.userID].map(d2 => {
          d2.callback({
            type: 'notice_count_change',
          });
        });
    }
    return new Promise(async (resolve, reject) => {
      if (cf.userID) {
        cf.token = (
          await db.query(
            `SELECT deviceToken
                                    FROM \`${cf.app || this.app}\`.t_fcm
                                    where userID = ?;`,
            [cf.userID]
          )
        ).map((dd: any) => {
          return dd.deviceToken;
        });
        const user_cf = (
          (
            await db.query(
              `select \`value\`
                                           from \`${cf.app || this.app}\`.t_user_public_config
                                           where \`key\` = 'notify_setting'
                                             and user_id = ?`,
              [cf.userID]
            )
          )[0] ?? { value: {} }
        ).value;
        if (`${user_cf[cf.tag]}` !== 'false') {
          if (cf.userID && cf.tag && cf.title && cf.body && cf.link && !cf.pass_store) {
            await db.query(
              `insert into \`${cf.app || this.app}\`.t_notice (user_id, tag, title, content, link)
                            values (?, ?, ?, ?, ?)`,
              [cf.userID, cf.tag, cf.title, cf.body, cf.link]
            );
          }
        } else {
          resolve(true);
          return;
        }
      }
      if (typeof cf.token === 'string') {
        cf.token = [cf.token];
      }
      if (Array.isArray(cf.token)) {
        let error_token: string[] = [];
        await Promise.all(
          cf.token.map(token => {
            return new Promise(async (resolve, reject) => {
              try {
                admin.apps
                  .find(dd => {
                    return dd?.name === 'glitter';
                  })!
                  .messaging()
                  .send({
                    notification: {
                      title: cf.title,
                      body: cf.body.replace(/<br>/g, ''),
                    },
                    android: {
                      notification: {
                        sound: 'default',
                      },
                    },
                    apns: {
                      payload: {
                        aps: {
                          sound: 'default',
                        },
                      },
                    },
                    data: {
                      link: `${cf.link || ''}`,
                    },
                    token: token!,
                  })
                  .then((response: any) => {
                    console.log(`成功發送推播：${token}`, response);
                    resolve(true);
                  })
                  .catch((error: any) => {
                    if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
                      error_token.push(token);
                    }
                    resolve(true);
                  });
              } catch (e: any) {
                CaughtError.warning('fcm', `firebase->74`, `${e}`);
                resolve(true);
              }
            });
          })
        );
        if (error_token.length > 0) {
          await db.query(
            `delete 
             FROM \`${cf.app || this.app}\`.t_fcm
             where userID = ? and deviceToken in (${error_token.map(d => db.escape(d)).join(',')});`,
            [cf.userID]
          );
        }
      }
      resolve(true);
    });
  }

  async postFCM(data: any): Promise<{ result: boolean; message: string }> {
    data.msgid = '';
    try {
      if (Boolean(data.sendTime)) {
        if (isLater(data.sendTime)) {
          return { result: false, message: '排定發送的時間需大於現在時間' };
        }
        const insertData = await db.query(
          `INSERT INTO \`${this.app}\`.\`t_triggers\`
           SET ?;`,
          [
            {
              tag: 'sendFCM',
              content: JSON.stringify(data),
              trigger_time: formatDateTime(data.sendTime),
              status: 0,
            },
          ]
        );

        this.chunkSendFcm(data, insertData.insertId, formatDateTime(data.sendTime));
      } else {
        const insertData = await db.query(
          `INSERT INTO \`${this.app}\`.\`t_triggers\`
           SET ?;`,
          [
            {
              tag: 'sendFCM',
              content: JSON.stringify(data),
              trigger_time: formatDateTime(),
              status: 1,
            },
          ]
        );
        this.chunkSendFcm(data, insertData.insertId);
      }
      return { result: true, message: '寄送成功' };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
    }
  }

  async chunkSendFcm(data: any, id: number, date?: string) {
    try {
      let msgid = '';
      for (const b of chunkArray(
        Array.from(
          new Set(
            data.userList.map((dd: any) => {
              return dd.id;
            })
          )
        ),
        10
      )) {
        let check = b.length;

        await new Promise(resolve => {
          for (const d of b) {
            this.sendMessage({
              userID: d as string,
              title: data.title,
              body: data.content,
              tag: 'promote',
              link: data.link,
            });
            // this.sendMessage({ data: data.content, phone: d, date: date }, res => {
            //     check--;
            //     console.log(' res -- ', res);
            //     if (check === 0) {
            //         db.query(
            //           `UPDATE \`${this.app}\`.t_triggers
            //   SET status = ${date ? 0 : 1},
            //       content = JSON_SET(content, '$.name', '${res.msgid}')
            //   WHERE id = ?;`,
            //           [id]
            //         );
            //         resolve(true);
            //     }
            // });
          }
        });
      }
      // await db.query(`UPDATE \`${this.app}\`.t_triggers SET status = ${date?0:1} , content = JSON_SET(content, '$.name', '變數A') WHERE id = ?;`, [ id]);
      // await db.query(`-- UPDATE \`${this.app}\`.t_triggers SET ? WHERE id = ?;`, [{ status: 1 , content : `JSON_SET(content, '$.name', '變數A')`}, id]);
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
    }
  }

  async getFCM(query: {
    type: string;
    page: number;
    limit: number;
    search?: string;
    searchType?: string;
    mailType?: string;
    status?: string;
  }) {
    try {
      const whereList: string[] = ['1 = 1'];
      switch (query.searchType) {
        case 'email':
          // whereList.push(`(JSON_SEARCH(content->'$.email', 'one', '%${query.search ?? ''}%', NULL, '$[*]') IS NOT NULL)`);
          break;
        case 'name':
          whereList.push(`(UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${query.search ?? ''}%'))`);
          break;
        case 'title':
          whereList.push(`(UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${query.search ?? ''}%'))`);
          break;
      }

      if (query.status) {
        whereList.push(`(status in (${query.status}))`);
      }

      if (query.mailType) {
        const maiTypeString = query.mailType.replace(/[^,]+/g, "'$&'");
        whereList.push(`(JSON_EXTRACT(content, '$.type') in (${maiTypeString}))`);
      }

      const whereSQL = `(tag = 'sendFCM') AND ${whereList.join(' AND ')}`;

      const emails = await db.query(
        `SELECT *
         FROM \`${this.app}\`.t_triggers
         WHERE ${whereSQL}
         ORDER BY id DESC
           ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`,
        []
      );

      const total = await db.query(
        `SELECT count(id) as c
         FROM \`${this.app}\`.t_triggers
         WHERE ${whereSQL};`,
        []
      );

      for (const email of emails) {
        email.content.typeName = '手動發送';
      }
      return { data: emails, total: total[0].c };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
    }
  }
}

function isLater(dateTimeObj: { date: string; time: string }) {
  const currentDateTime = new Date();
  const { date, time } = dateTimeObj;
  const dateTimeString = `${date}T${time}:00`;
  const providedDateTime = new Date(dateTimeString);
  return currentDateTime > providedDateTime;
}

function chunkArray(array: any, groupSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
}

function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function formatDateTime(sendTime?: { date: string; time: string }) {
  const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
  const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
  return formatDate(dateObject);
}
