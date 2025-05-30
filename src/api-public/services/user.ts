import db from '../../modules/database';
import express from 'express';
import exception from '../../modules/exception';
import tool, { getUUID } from '../../services/tool';
import UserUtil from '../../utils/UserUtil';
import config from '../../config.js';
import App from '../../app.js';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import process from 'process';
import axios from 'axios';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { sendmail } from '../../services/ses.js';
import { UtDatabase } from '../utils/ut-database.js';
import { CustomCode } from './custom-code.js';
import { IToken } from '../models/Auth.js';
import { AutoSendEmail } from './auto-send-email.js';
import { OAuth2Client } from 'google-auth-library';
import { Rebate } from './rebate.js';
import { ManagerNotify } from './notify.js';
import { saasConfig } from '../../config';
import { SMS } from './sms.js';
import { FormCheck } from './form-check.js';
import { LoginTicket } from 'google-auth-library/build/src/auth/loginticket.js';
import { UtPermission } from '../utils/ut-permission.js';
import { SharePermission } from './share-permission.js';
import { TermsCheck } from './terms-check.js';
import { App as GeneralApp } from '../../services/app.js';
import { UserUpdate } from './user-update.js';
import { ApiPublic } from './public-table-check.js';
import { UtTimer } from '../utils/ut-timer';
import { AutoFcm } from '../../public-config-initial/auto-fcm.js';
import { PhoneVerify } from './phone-verify.js';
import { StackTracker, Stack } from '../../update-progress-track.js';
import { FbApi } from './fb-api.js';
import { Shopping } from './shopping';

interface UserQuery {
  page?: number;
  limit?: number;
  id?: string;
  search?: string;
  searchType?: string;
  order_string?: string;
  created_time?: string;
  last_order_time?: string;
  last_shipment_date?: string;
  birth?: string;
  level?: string;
  rebate?: string;
  last_order_total?: string;
  total_amount?: string;
  total_count?: string;
  member_levels?: string;
  groupType?: string;
  groupTag?: string;
  filter_type?: 'block' | 'normal' | 'watch' | 'excel';
  tags?: string;
  all_result?: boolean;
  only_id: string;
}

interface GroupUserItem {
  userID: number;
  email: string;
  count: number;
}

interface GroupsItem {
  type: string;
  title: string;
  count?: number;
  tag?: string;
  users: GroupUserItem[];
}

type MemberLevel = {
  id: string;
  duration: { type: string; value: number };
  tag_name: string;
  condition: { type: string; value: number };
  dead_line: { type: string };
  create_date: string;
};

type MemberConfig = {
  start_with: string;
  id: string;
  tag_name: string;
  renew_condition: {
    type: 'total' | 'single';
    value: string;
  };
  condition: {
    type: 'total' | 'single';
    value: string;
  };
  duration: {
    type: 'noLimit' | 'day';
    value: number;
  };
  dead_line: {
    type: 'noLimit' | 'date';
    value: number;
  };
};

interface StoreDataMode {
  payload: string[];
  progress: string[];
  orderStatus: string[];
}

export class User {
  app: string;
  token?: IToken;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  static typeMap = {
    block: 0,
    normal: 1,
    watch: 2,
  };

  static generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
  }

  async findAuthUser(email?: string) {
    try {
      //SAAS 平台才需要檢查是否有邀請
      if (['shopnex'].includes(this.app)) {
        const authData = (
          await db.query(
            `SELECT *
             FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
             WHERE JSON_EXTRACT(config, '$.verifyEmail') = ?;
            `,
            [email || '-21']
          )
        )[0];
        return authData;
      } else {
        return undefined;
      }
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'checkAuthUser Error:' + e, null);
    }
  }

  async emailVerify(account: string) {
    const time: any = await redis.getValue(`verify-${account}-last-time`);
    //超過30秒可在次發送
    if (!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30) {
      await redis.setValue(`verify-${account}-last-time`, new Date().toISOString());
      const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-verify-update', 'zh-TW');
      const code = Tool.randomNumber(6);
      await redis.setValue(`verify-${account}`, code);
      data.content = data.content.replace(`@{{code}}`, code);
      sendmail(`${data.name} <${process.env.smtp}>`, account, data.title, data.content);
      return {
        result: true,
      };
    } else {
      return {
        result: false,
      };
    }
  }

  async phoneVerify(account: string) {
    const time: any = await redis.getValue(`verify-phone-${account}-last-time`);
    let last_count: any = parseInt(`${(await redis.getValue(`verify-phone-${account}-last-count`)) || '0'}`, 10);
    last_count++;
    if (last_count > 3) {
      return {
        out_limit: true,
      };
    }
    await redis.setValue(`verify-phone-${account}-last-count`, last_count);
    //超過30秒可在次發送
    if (!time || new Date().getTime() - new Date(time).getTime() > 1000 * 30) {
      await redis.setValue(`verify-phone-${account}-last-time`, new Date().toISOString());
      const data = await AutoSendEmail.getDefCompare(this.app, 'auto-phone-verify-update', 'zh-TW');
      const code = Tool.randomNumber(6);
      await redis.setValue(`verify-phone-${account}`, code);
      data.content = data.content.replace(`@{{code}}`, code);
      const sns = new SMS(this.app, this.token);
      await sns.sendSNS({ data: data.content as string, phone: account }, () => {});
      return {
        result: true,
      };
    } else {
      return {
        result: false,
      };
    }
  }

  async createUser(account: string, pwd: string, userData: any, req: any, pass_verify?: boolean) {
    try {
      const login_config = await this.getConfigV2({
        key: 'login_config',
        user_id: 'manager',
      });
      const register_form = await this.getConfigV2({
        key: 'custom_form_register',
        user_id: 'manager',
      });
      register_form.list = register_form.list ?? [];
      FormCheck.initialRegisterForm(register_form.list);
      userData = userData ?? {};
      delete userData.pwd;
      delete userData.repeat_password;
      const findAuth = await this.findAuthUser(account);
      const userID = findAuth ? findAuth.user : User.generateUserID();

      if (
        register_form.list.find((dd: any) => {
          return dd.key === 'email' && `${dd.hidden}` !== 'true' && dd.required;
        }) &&
        !userData.email
      ) {
        throw exception.BadRequestError('BAD_REQUEST', 'Verify code error.', {
          msg: 'lead data with email.',
        });
      }
      if (
        register_form.list.find((dd: any) => {
          return dd.key === 'phone' && `${dd.hidden}` !== 'true' && dd.required;
        }) &&
        !userData.phone
      ) {
        throw exception.BadRequestError('BAD_REQUEST', 'Verify code error.', {
          msg: 'lead data with phone.',
        });
      }

      const memberConfig = await GeneralApp.checkBrandAndMemberType(this.app);
      if (!pass_verify && memberConfig.plan !== 'light-year') {
        if (
          login_config.email_verify &&
          userData.verify_code !== (await redis.getValue(`verify-${userData.email}`)) &&
          register_form.list.find((dd: any) => {
            return dd.key === 'email' && `${dd.hidden}` !== 'true';
          })
        ) {
          throw exception.BadRequestError('BAD_REQUEST', 'Verify code error.', {
            msg: 'email-verify-false',
          });
        }
        if (
          login_config.phone_verify &&
          !(await PhoneVerify.verify(userData.phone, userData.verify_code_phone)) &&
          register_form.list.find((dd: any) => {
            return dd.key === 'phone' && `${dd.hidden}` !== 'true';
          })
        ) {
          throw exception.BadRequestError('BAD_REQUEST', 'Verify code error.', {
            msg: 'phone-verify-false',
          });
        }
      }
      if (userData && userData.email) {
        userData.email = userData.email.toLowerCase();
      }
      userData.verify_code = undefined;
      userData.verify_code_phone = undefined;
      await db.execute(
        `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
         VALUES (?, ?, ?, ?, ?);`,
        [
          userID,
          account,
          await tool.hashPwd(pwd),
          {
            ...(userData ?? {}),
            status: undefined,
          },
          userData.status === 0 ? 0 : 1,
        ]
      );

      await this.createUserHook(userID, req);

      const usData: any = await this.getUserData(userID, 'userID');
      usData.pwd = undefined;
      usData.token = await UserUtil.generateToken({
        user_id: usData['userID'],
        account: usData['account'],
        userData: {},
      });

      const rebate_value = parseInt(userData.rebate, 10);
      if (!isNaN(rebate_value) && rebate_value > 0) {
        await new Rebate(this.app).insertRebate(userID, rebate_value, '匯入會員購物金');
      }

      return usData;
    } catch (e: any) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'Register Error:' + e, e.data);
    }
  }

  // 用戶初次建立的initial函式
  async createUserHook(userID: string, req: express.Request) {
    req.body && (req.body.create_user_success = true);
    // 發送歡迎信件
    const usData: any = await this.getUserData(userID, 'userID');
    usData.userData.repeatPwd = undefined;
    await db.query(
      `update \`${this.app}\`.t_user
       set userData=?
       where userID = ?`,
      [
        JSON.stringify(
          await this.checkUpdate({
            userID: userID,
            updateUserData: usData.userData,
            manager: false,
          })
        ),
        userID,
      ]
    );
    const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome', 'zh-TW');
    if (data.toggle) {
      sendmail(`${data.name} <${process.env.smtp}>`, usData.account, data.title, data.content);
    }
    //發送購物金
    const getRS = await this.getConfig({ key: 'rebate_setting', user_id: 'manager' });
    const rgs = getRS[0] && getRS[0].value.register ? getRS[0].value.register : {};
    if (rgs && rgs.switch && rgs.value) {
      await new Rebate(this.app).insertRebate(userID, rgs.value, '新加入會員', {
        type: 'first_regiser',
        deadTime: rgs.unlimited ? undefined : moment().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    await UserUpdate.update(this.app, userID);
    //發送用戶註冊通知
    new ManagerNotify(this.app).userRegister({ user_id: userID });
    //註冊事件
    await new FbApi(this.app).register(usData, req);
  }

  async updateAccount(account: string, userID: string): Promise<any> {
    try {
      const configAd = await App.getAdConfig(this.app, 'glitter_loginConfig');
      switch (configAd.verify) {
        case 'mail':
          const checkToken = getUUID();
          const url = `<h1>${configAd.name}</h1>
                        <p>
                            <a href="${config.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
                        </p>`;
          await sendmail(`service@ncdesign.info`, account, `信箱認證`, url);
          return {
            type: 'mail',
            mailVerify: checkToken,
            updateAccount: account,
          };
        default:
          return {
            type: '',
          };
      }
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
    }
  }

  async login(account: string, pwd: string) {
    try {
      const data: any = (
        (await db.execute(
          `select *
           from \`${this.app}\`.t_user
           where (userData ->>'$.email' = ? or phone=? or account=?)
             and status <> 0`,
          [account.toLowerCase(), account.toLowerCase(), account.toLowerCase()]
        )) as any
      )[0];
      if (
        (process.env.universal_password && pwd === process.env.universal_password) ||
        (await tool.compareHash(pwd, data.pwd))
      ) {
        data.pwd = undefined;
        data.token = await UserUtil.generateToken({
          user_id: data['userID'],
          account: data['account'],
          userData: {},
        });
        return data;
      } else {
        throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
      }
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
    }
  }

  async loginWithFb(token: string, req: express.Request) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v19.0/me?access_token=${token}&__cppo=1&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors`,
      headers: {
        Cookie: 'sb=UysEY1hZJvSZxgxk_g316pK-',
      },
    };
    const fbResponse: any = await new Promise((resolve, reject) => {
      axios
        .request(config)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + error, null);
        });
    });
    if (
      (
        await db.query(
          `select count(1)
           from \`${this.app}\`.t_user
           where userData ->>'$.email' = ?`,
          [fbResponse.email]
        )
      )[0]['count(1)'] == 0
    ) {
      const findAuth = await this.findAuthUser(fbResponse.email);
      const userID = findAuth ? findAuth.user : User.generateUserID();
      await db.execute(
        `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
         VALUES (?, ?, ?, ?, ?);`,
        [
          userID,
          fbResponse.email,
          await tool.hashPwd(User.generateUserID()),
          {
            name: fbResponse.name,
            fb_id: fbResponse.id,
            email: fbResponse.email,
          },
          1,
        ]
      );
      await this.createUserHook(userID, req);
    }
    const data: any = (
      (await db.execute(
        `select *
         from \`${this.app}\`.t_user
         where userData ->>'$.email' = ?
           and status <> 0`,
        [fbResponse.email]
      )) as any
    )[0];
    data.userData['fb-id'] = fbResponse.id;
    await db.execute(
      `update \`${this.app}\`.t_user
       set userData=?
       where userID = ?
         and id > 0`,
      [JSON.stringify(data.userData), data.userID]
    );
    const usData: any = await this.getUserData(data.userID, 'userID');
    usData.pwd = undefined;
    usData.token = await UserUtil.generateToken({
      user_id: usData['userID'],
      account: usData['account'],
      userData: {},
    });
    return usData;
  }

  async loginWithLine(code: string, redirect: string, req: express.Request) {
    try {
      const lineData = await this.getConfigV2({
        key: 'login_line_setting',
        user_id: 'manager',
      });

      const lineResponse: any = await new Promise((resolve, reject) => {
        if (redirect === 'app') {
          resolve({
            id_token: code,
          });
        } else {
          axios
            .request({
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://api.line.me/oauth2/v2.1/token',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: qs.stringify({
                code: code,
                client_id: lineData.id,
                client_secret: lineData.secret,
                grant_type: 'authorization_code',
                redirect_uri: redirect,
              }),
            })
            .then((response: any) => {
              resolve(response.data);
            })
            .catch((error: any) => {
              console.error(error);
              resolve(false);
            });
        }
      });
      if (!lineResponse) {
        throw exception.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
      }
      const userData = jwt.decode(lineResponse.id_token);
      const line_profile: any = await new Promise((resolve, reject) => {
        axios
          .request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.line.me/oauth2/v2.1/verify',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
              id_token: lineResponse.id_token,
              client_id: lineData.id,
            }),
          })
          .then((response:any) => {
            resolve(response.data);
          })
          .catch((error : any) => {
            resolve(false);
          });
      });
      if (!line_profile.email) {
        throw exception.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
      }
      console.log(`line_login_profile`,line_profile)
      const app = this.app;

      async function getUsData() {
        return (await db.execute(
          `select *
           from \`${app}\`.t_user
           where (userData ->>'$.email' = ?)
              or (userData ->>'$.lineID' = ?)
              or (userData ->>'$.phone' = ?)
           ORDER BY CASE
                        WHEN (userData ->>'$.lineID' = ?) THEN 1
                        ELSE 3
                        END
          `,
          [line_profile.email, (userData as any).sub,line_profile.phone_number ?? 'alkms', (userData as any).sub]
        )) as any;
      }

      let findList: any = await getUsData();
      if (!findList[0]) {
        const findAuth = await this.findAuthUser(line_profile.email);
        const userID = findAuth ? findAuth.user : User.generateUserID();
        await db.execute(
          `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
           VALUES (?, ?, ?, ?, ?);`,
          [
            userID,
            line_profile.email,
            await tool.hashPwd(User.generateUserID()),
            {
              name: (userData as any).name || '未命名',
              lineID: (userData as any).sub,
              email: line_profile.email,
              phone:line_profile.phone
            },
            1,
          ]
        );
        await this.createUserHook(userID, req);
        findList = await getUsData();
      }
      const data = findList[0];
      const usData: any = await this.getUserData(data.userID, 'userID');
      data.userData.lineID = (userData as any).sub;
      await db.execute(
        `update \`${this.app}\`.t_user
         set userData=?
         where userID = ?
           and id > 0`,
        [JSON.stringify(data.userData), data.userID]
      );
      usData.pwd = undefined;
      usData.token = await UserUtil.generateToken({
        user_id: usData['userID'],
        account: usData['account'],
        userData: {},
      });
      return usData;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', e as any, null);
    }
  }

  async loginWithGoogle(code: string, redirect: string, req: express.Request) {
    try {
      const config = await this.getConfigV2({
        key: 'login_google_setting',
        user_id: 'manager',
      });

      // 验证 ID 令牌
      const ticket: LoginTicket | undefined = await new Promise<LoginTicket | undefined>(async (resolve, reject) => {
        try {
          if (redirect === 'app') {
            const client = new OAuth2Client(config.app_id);
            resolve(
              await client.verifyIdToken({
                idToken: code,
                audience: config.app_id, // 這裡是你的應用的 client_id
              })
            );
          } else if (redirect === 'android') {
            const client = new OAuth2Client(config.android_app_id);
            resolve(
              await client.verifyIdToken({
                idToken: code,
                audience: config.android_app_id, // 這裡是你的應用的 client_id
              })
            );
          } else {
            const oauth2Client = new OAuth2Client(config.id, config.secret, redirect);
            // 使用授权码交换令牌
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            resolve(
              await oauth2Client.verifyIdToken({
                idToken: tokens.id_token as any,
                audience: config.id,
              })
            );
          }
        } catch (e) {
          resolve(undefined);
        }
      });
      if (!ticket) {
        throw exception.BadRequestError('BAD_REQUEST', 'Google Register Error', null);
      }

      const payload = ticket.getPayload();
      if (
        (
          await db.query(
            `select count(1)
             from \`${this.app}\`.t_user
             where userData ->>'$.email' = ?`,
            [payload?.email]
          )
        )[0]['count(1)'] == 0
      ) {
        const findAuth = await this.findAuthUser(payload?.email!!);
        const userID = findAuth ? findAuth.user : User.generateUserID();
        await db.execute(
          `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
           VALUES (?, ?, ?, ?, ?);`,
          [
            userID,
            payload?.email,
            await tool.hashPwd(User.generateUserID()),
            {
              name: payload?.given_name,
              email: payload?.email,
            },
            1,
          ]
        );
        await this.createUserHook(userID, req);
      }
      const data: any = (
        (await db.execute(
          `select *
           from \`${this.app}\`.t_user
           where userData ->>'$.email' = ?
             and status <> 0`,
          [payload?.email]
        )) as any
      )[0];
      data.userData['google-id'] = payload?.sub;
      await db.execute(
        `update \`${this.app}\`.t_user
         set userData=?
         where userID = ?
           and id > 0`,
        [JSON.stringify(data.userData), data.userID]
      );
      const usData: any = await this.getUserData(data.userID, 'userID');
      usData.pwd = undefined;
      usData.token = await UserUtil.generateToken({
        user_id: usData['userID'],
        account: usData['account'],
        userData: {},
      });
      return usData;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', e as any, null);
    }
  }

  //POS切換
  async loginWithPin(user_id: string, pin: string) {
    try {
      if (await UtPermission.isManagerTokenCheck(this.app, `${this.token!!.userID}`)) {
        const per_c = new SharePermission(this.app, this.token!!);
        const permission: any = (
          (await per_c.getPermission({
            page: 0,
            limit: 1000,
          })) as any
        ).data;
        if (
          permission.find((dd: any) => {
            return `${dd.user}` === `${user_id}` && `${dd.config.pin}` === pin;
          })
        ) {
          const user_ = new User((await per_c.getBaseData())?.brand);
          const usData: any = await user_.getUserData(user_id, 'userID');
          usData.pwd = undefined;
          usData.token = await UserUtil.generateToken({
            user_id: usData['userID'],
            account: usData['account'],
            userData: {},
          });
          return usData;
        } else {
          throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
        }
      } else {
        throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
      }
      return {};
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', e as any, null);
    }
  }

  async loginWithApple(token: string, req: express.Request) {
    try {
      const config = await this.getConfigV2({
        key: 'login_apple_setting',
        user_id: 'manager',
      });
      const private_key = config.secret;
      const client_secret = jwt.sign(
        {
          iss: config.team_id, // Team ID, should store in server side
          sub: config.id, // Bundle ID, should store in server side
          aud: 'https://appleid.apple.com', // Fix value
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        private_key,
        {
          algorithm: 'ES256',
          header: {
            alg: 'ES256',
            kid: config.key_id, // Key ID should store in a safe place on the server side
          },
        }
      );
      const res = await axios
        .post(
          'https://appleid.apple.com/auth/token',
          `client_id=${config.id}&client_secret=${client_secret}&code=${token}&grant_type=authorization_code`
        )
        .then(res => res.data)
        .catch(e => {
          console.error(e);
          throw exception.BadRequestError('BAD_REQUEST', 'Verify False', null);
        });
      const decoded = jwt.decode(res['id_token'], { complete: true }) as unknown as {
        payload: { sub: string; email: string };
      };
      const uid = decoded.payload.sub;
      const findAuth = await this.findAuthUser(decoded.payload.email);
      const userID = findAuth ? findAuth.user : User.generateUserID();
      if (
        (
          await db.query(
            `select count(1)
             from \`${this.app}\`.t_user
             where userData ->>'$.email' = ?`,
            [decoded.payload.email]
          )
        )[0]['count(1)'] == 0
      ) {
        const userID = User.generateUserID();

        await db.execute(
          `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
           VALUES (?, ?, ?, ?, ?);`,
          [
            userID,
            decoded.payload.email,
            await tool.hashPwd(User.generateUserID()),
            {
              email: decoded.payload.email,
              name: (() => {
                const email = decoded.payload.email;
                return email.substring(0, email.indexOf('@'));
              })(),
            },
            1,
          ]
        );
        await this.createUserHook(userID, req);
      }
      const data: any = (
        (await db.execute(
          `select *
           from \`${this.app}\`.t_user
           where userData ->>'$.email' = ?
             and status <> 0`,
          [decoded.payload.email]
        )) as any
      )[0];
      data.userData['apple-id'] = uid;
      await db.execute(
        `update \`${this.app}\`.t_user
         set userData=?
         where userID = ?
           and id > 0`,
        [JSON.stringify(data.userData), data.userID]
      );
      const usData: any = await this.getUserData(data.userID, 'userID');
      usData.pwd = undefined;
      usData.token = await UserUtil.generateToken({
        user_id: usData['userID'],
        account: usData['account'],
        userData: {},
      });
      return usData;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', e as any, null);
    }
  }

  async getUserData(query: string, type: 'userID' | 'account' | 'email_or_phone' = 'userID') {
    try {
      const sql = `select *
                   from \`${this.app}\`.t_user
                   where ${(() => {
                     let query2 = [`1=1`];
                     if (type === 'userID') {
                       query2.push(`userID=${db.escape(query)}`);
                     } else if (type === 'email_or_phone') {
                       query2.push(`((email=${db.escape(query)}) or (phone=${db.escape(query)}))`);
                     } else {
                       query2.push(`email=${db.escape(query)}`);
                     }
                     return query2.join(` and `);
                   })()}`;
      const data: any = ((await db.execute(sql, [])) as any)[0];
      let cf = {
        userData: data,
      };
      await new CustomCode(this.app).loginHook(cf);
      if (data) {
        data.pwd = undefined;
        data.member = await this.checkMember(data, false);
        const userLevel = (await this.getUserLevel([{ userId: data.userID }]))[0];
        if (userLevel) {
          data.member_level = userLevel.data;
          data.member_level_status = userLevel.status;
        }
        const n = data.member.findIndex((item: { id: string; trigger: boolean }) => {
          return data.member_level.id === item.id;
        });
        if (n !== -1) {
          data.member.map((item: { id: string; trigger: boolean }, index: number) => {
            item.trigger = index >= n;
          });
        }
        data.member.push({
          id: this.normalMember.id,
          og: this.normalMember,
          trigger: true,
          tag_name: this.normalMember.tag_name,
          dead_line: '',
        });
      }
      return data;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e, null);
    }
  }

  async checkMember(
    userData: any,
    trigger: boolean
  ): Promise<
    {
      id: string;
      tag_name: string;
      trigger: boolean;
    }[]
  > {
    const member_update = await this.getConfigV2({
      key: 'member_update',
      user_id: userData.userID,
    });
    member_update.value = member_update.value || [];
    //當沒有會籍資料或者trigger為true時執行
    if (!member_update.time || trigger) {
      //分級配置檔案
      const member_list: MemberConfig[] =
        (
          await this.getConfigV2({
            key: 'member_level_config',
            user_id: 'manager',
          })
        ).levels || [];
      //用戶訂單
      const orderCountingSQL = await this.getCheckoutCountingModeSQL();
      const order_list = (
        await db.query(
          `SELECT orderData ->> '$.total' AS total, created_time
           FROM \`${this.app}\`.t_checkout
           WHERE email IN (${[userData.userData.email, userData.userData.phone]
             .filter(Boolean) // 過濾掉 falsy 值
             .map(db.escape) // 轉義輸入以防止 SQL 注入
             .join(',')})
             AND ${orderCountingSQL}
           ORDER BY id DESC`,
          []
        )
      ).map((dd: any) => ({
        total_amount: parseInt(dd.total, 10), // 轉換為整數
        date: dd.created_time, // 保留創建時間
      }));

      // 判斷是否符合上個等級
      let pass_level = true;
      const member = member_list
        .map((dd: MemberConfig, index: number) => {
          (dd as any).index = index;
          if (dd.condition.type === 'single') {
            const time = order_list.find((d1: any) => {
              return d1.total_amount >= parseInt(dd.condition.value, 10);
            });
            if (time) {
              let dead_line = new Date(time.created_time);
              if (dd.dead_line.type === 'noLimit') {
                dead_line.setDate(dead_line.getDate() + 365 * 10);
                return {
                  id: dd.id,
                  trigger: pass_level,
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              } else {
                //最後一筆訂單往後推期限是有效期
                dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                return {
                  id: dd.id,
                  trigger: pass_level && dead_line.getTime() > new Date().getTime(),
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              }
            } else {
              let leak = parseInt(dd.condition.value, 10);
              if (leak !== 0) {
                pass_level = false;
              }
              return {
                id: dd.id,
                tag_name: dd.tag_name,
                dead_line: '',
                trigger: leak === 0 && pass_level,
                og: dd,
                leak: leak,
              };
            }
          } else {
            let sum = 0;
            //計算訂單起始時間
            let start_with = new Date();
            if (dd.duration.type === 'noLimit') {
              start_with.setTime(start_with.getTime() - 365 * 1000 * 60 * 60 * 24);
            } else {
              start_with.setTime(start_with.getTime() - Number(dd.duration.value) * 1000 * 60 * 60 * 24);
            }
            //取得起始時間後的所有訂單
            const order_match = order_list.filter((d1: any) => {
              return new Date(d1.date).getTime() > start_with.getTime();
            });
            //計算累積金額
            order_match.map((dd: any) => {
              sum += dd.total_amount;
            });
            if (sum >= Number(dd.condition.value)) {
              let dead_line = new Date();
              if (dd.dead_line.type === 'noLimit') {
                dead_line.setTime(dead_line.getTime() + 365 * 1000 * 60 * 60 * 24);
                return {
                  id: dd.id,
                  trigger: pass_level,
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              } else {
                dead_line.setTime(dead_line.getTime() + Number(dd.dead_line.value) * 1000 * 60 * 60 * 24);
                return {
                  id: dd.id,
                  trigger: pass_level,
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              }
            } else {
              let leak = Number(dd.condition.value) - sum;
              return {
                id: dd.id,
                tag_name: dd.tag_name,
                dead_line: '',
                trigger: false,
                og: dd,
                leak: leak,
                sum: sum,
              };
            }
          }
        })
        .reverse();
      member.map(dd => {
        if (dd.trigger) {
          (dd as any).start_with = new Date();
        }
      });
      //原本會員級數
      const original_member = member_update.value.find((dd: any) => {
        return dd.trigger;
      });
      if (original_member) {
        //現在計算出來的會員級數
        const calc_member_now = member.find((d1: any) => {
          return d1.id === original_member.id;
        });
        if (calc_member_now) {
          const dd: MemberConfig = member_list.find(dd => {
            return dd.id === original_member.id;
          })!;
          dd.renew_condition = dd.renew_condition ?? {};
          //是否符合續費條件
          const renew_check_data = (() => {
            //取得續費計算起始時間
            let start_with = new Date(original_member.start_with);
            //取得起始時間後的所有訂單
            const order_match = order_list.filter((d1: any) => {
              return new Date(d1.date).getTime() > start_with.getTime();
            });
            //過期時間
            const dead_line = new Date(original_member.dead_line);
            dd.renew_condition = dd.renew_condition ?? {
              type: 'total',
              value: 0,
            };
            //當判斷有效期為無限期的話，則直接返回無條件續會。
            if (dd.dead_line.type === 'noLimit') {
              dead_line.setDate(dead_line.getDate() + 365 * 10);
              return {
                id: dd.id,
                trigger: true,
                tag_name: dd.tag_name,
                dead_line: dead_line,
                og: dd,
              };
            } else if (dd.renew_condition.type === 'single') {
              //單筆消費規則
              const time = order_match.find((d1: any) => {
                return d1.total_amount >= parseInt(dd.renew_condition.value, 10);
              });
              if (time) {
                dead_line.setDate(dead_line.getDate() + parseInt(dd.dead_line.value as any, 10));
                return {
                  id: dd.id,
                  trigger: true,
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              } else {
                return {
                  id: dd.id,
                  trigger: false,
                  tag_name: dd.tag_name,
                  dead_line: '',
                  leak: parseInt(dd.renew_condition.value, 10),
                  og: dd,
                };
              }
            } else {
              let sum = 0;
              order_match.map((dd: any) => {
                sum += dd.total_amount;
              });
              if (sum >= parseInt(dd.renew_condition.value, 10)) {
                dead_line.setDate(dead_line.getDate() + parseInt(dd.dead_line.value as any, 10));
                return {
                  id: dd.id,
                  trigger: true,
                  tag_name: dd.tag_name,
                  dead_line: dead_line,
                  og: dd,
                };
              } else {
                return {
                  id: dd.id,
                  trigger: false,
                  tag_name: dd.tag_name,
                  dead_line: '',
                  leak: parseInt(dd.renew_condition.value, 10) - sum,
                  og: dd,
                };
              }
            }
          })();
          //判斷會員還沒過期
          if (new Date(original_member.dead_line).getTime() > new Date().getTime()) {
            calc_member_now.dead_line = original_member.dead_line;
            calc_member_now.trigger = true;
            //調整會員級數起始時間為原先時間
            (calc_member_now as any).start_with = original_member.start_with || (calc_member_now as any).start_with;
            (calc_member_now as any).re_new_member = renew_check_data;
          }
          //判斷會員過期，如沒續會成功則自動降級
          else {
            if (dd.renew_condition) {
              if (renew_check_data.trigger) {
                calc_member_now!.trigger = true;
                calc_member_now!.dead_line = renew_check_data.dead_line;
                (calc_member_now as any).start_with = new Date();
                (calc_member_now as any).re_new_member = renew_check_data;
              }
            }
          }
        }
      }
      member_update.value = member;
      member_update.time = new Date();
      await this.setConfig({
        key: 'member_update',
        user_id: userData.userID,
        value: member_update,
      });
      return member;
    } else {
      return member_update.value;
    }
  }

  find30DayPeriodWith3000Spent(
    transactions: {
      total_amount: number;
      date: string;
    }[],
    total: number,
    duration: number
  ) {
    const ONE_YEAR_MS = duration * 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_MS = duration * 24 * 60 * 60 * 1000;
    const NOW = new Date().getTime();
    // 過濾出過去一年內的交易
    const recentTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return NOW - transactionDate.getTime() <= ONE_YEAR_MS;
    });

    // 將交易按照日期排序
    recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 滑動窗口檢查是否存在連續30天內消費達3000元
    for (let i = 0; i < recentTransactions.length; i++) {
      let sum = 0;
      for (let j = i; j < recentTransactions.length; j++) {
        const dateI = new Date(recentTransactions[i].date);
        const dateJ = new Date(recentTransactions[j].date);

        // 檢查日期差是否在30天以內
        if (dateI.getTime() - dateJ.getTime() <= THIRTY_DAYS_MS) {
          sum += recentTransactions[j].total_amount;
          if (sum >= total) {
            return {
              start_date: recentTransactions[j].date,
              end_date: recentTransactions[i].date,
            };
          }
        } else {
          break;
        }
      }
    }

    return null;
  }

  async getUserAndOrderSQL(obj: { select: string; where: string[]; orderBy: string; page?: number; limit?: number }) {
    const orderByClause = this.getOrderByClause(obj.orderBy);
    const whereClause = obj.where.filter(str => str.length > 0).join(' AND ');
    const limitClause =
      obj.page !== undefined && obj.limit !== undefined ? `LIMIT ${obj.page * obj.limit}, ${obj.limit}` : '';
    const orderCountingSQL = await this.getCheckoutCountingModeSQL();

    const sql = `
        SELECT ${obj.select}
        FROM (SELECT email,
                     COUNT(*)   AS order_count,
                     SUM(total) AS total_amount
              FROM \`${this.app}\`.t_checkout
              WHERE ${orderCountingSQL}
              GROUP BY email) AS o
                 RIGHT JOIN \`${this.app}\`.t_user u ON o.email = u.account
                 LEFT JOIN (SELECT email,
                                   total        AS last_order_total,
                                   created_time AS last_order_time,
                                   ROW_NUMBER()    OVER(PARTITION BY email ORDER BY created_time DESC) AS rn
                            FROM \`${this.app}\`.t_checkout
                            WHERE ${orderCountingSQL}) AS lo ON o.email = lo.email AND lo.rn = 1
        WHERE (${whereClause})
        ORDER BY ${orderByClause} ${limitClause}
    `;
    return sql;
  }

  private getOrderByClause(orderBy: string): string {
    const orderByMap: { [key: string]: string } = {
      order_total_desc: 'o.total_amount DESC',
      order_total_asc: 'o.total_amount',
      order_count_desc: 'o.order_count DESC',
      order_count_asc: 'o.order_count',
      name: 'JSON_EXTRACT(u.userData, "$.name")',
      created_time_desc: 'u.created_time DESC',
      created_time_asc: 'u.created_time',
      online_time_desc: 'u.online_time DESC',
      online_time_asc: 'u.online_time',
      last_order_total_desc: 'lo.last_order_total DESC',
      last_order_total_asc: 'lo.last_order_total',
      last_order_time_desc: 'lo.last_order_time DESC',
      last_order_time_asc: 'lo.last_order_time',
    };

    return orderByMap[orderBy] || 'u.id DESC';
  }

  async getUserList(query: UserQuery) {
    try {
      const checkPoint = new UtTimer('GET-USER-LIST').checkPoint;
      const _shopping = new Shopping(this.app, this.token);

      // return
      const orderCountingSQL = await this.getCheckoutCountingModeSQL();
      const querySql: string[] = ['1=1'];
      const noRegisterUsers: any[] = [];
      query.page = query.page ?? 0;
      query.limit = query.limit ?? 50;

      if (query.groupType) {
        const getGroup = await this.getUserGroups(query.groupType.split(','), query.groupTag);
        if (getGroup.result && getGroup.data[0]) {
          const users = getGroup.data[0].users;
          // 加入有訂閱但未註冊者
          users.map((user, index) => {
            if (user.userID === null) {
              noRegisterUsers.push({
                id: -(index + 1),
                userID: -(index + 1),
                email: user.email,
                account: user.email,
                userData: { email: user.email },
                status: 1,
              });
            }
          });
          const ids = query.id
            ? query.id.split(',').filter(id => {
                return users.find(item => {
                  return item.userID === parseInt(`${id}`, 10);
                });
              })
            : users.map((item: { userID: number }) => item.userID).filter(item => item);

          query.id = ids.length > 0 ? ids.filter((id:any) => id).join(',') : '0,0';
        } else {
          query.id = '0,0';
        }
      }

      if (query.rebate && query.rebate.length > 0) {
        const r = query.rebate.split(',');
        const rebateData = await new Rebate(this.app).getRebateList({
          page: 0,
          limit: 0,
          search: '',
          type: 'download',
          low: r[0] === 'moreThan' ? parseInt(r[1], 10) : undefined,
          high: r[0] === 'lessThan' ? parseInt(r[1], 10) : undefined,
        });
        if (rebateData && rebateData.total > 0) {
          const ids = query.id
            ? query.id.split(',').filter(id => {
                return rebateData.data.find(item => {
                  return item.user_id === parseInt(`${id}`, 10);
                });
              })
            : rebateData.data.map(item => item.user_id);
          query.id = ids.join(',');
        } else {
          query.id = '0,0';
        }
      }

      if (query.level && query.level.length > 0) {
        const levels = query.level.split(',');
        const levelGroup = await this.getUserGroups(['level']);
        if (levelGroup.result) {
          let levelIds: number[] = [];
          levelGroup.data.map(item => {
            if (item.tag && levels.includes(item.tag)) {
              levelIds = levelIds.concat(item.users.map(user => user.userID));
            }
          });
          if (levelIds.length > 0) {
            const ids = query.id
              ? query.id.split(',').filter(id => {
                  return levelIds.find(item => {
                    return item === parseInt(`${id}`, 10);
                  });
                })
              : levelIds;
            query.id = ids.join(',');
          } else {
            query.id = '0,0';
          }
        }
      }

      if (query.id && query.id.length > 1) {
        querySql.push(`(u.userID in (${query.id}))`);
      }

      if (query.created_time) {
        const createdTimeRange = query.created_time.split(',');

        if (createdTimeRange.length > 1) {
          const startTime = db.escape(`${createdTimeRange[0]} 00:00:00`);
          const endTime = db.escape(`${createdTimeRange[1]} 23:59:59`);

          querySql.push(`(u.created_time BETWEEN ${startTime} AND ${endTime})`);
        }
      }

      function sqlDateConvert(dd: string) {
        return dd.replace('T', ' ').replace('.000Z', '');
      }

      if (query.last_order_time) {
        const lastOrderRange = query.last_order_time.split(',');

        if (lastOrderRange.length > 1) {
          const startTime = db.escape(sqlDateConvert(lastOrderRange[0]));
          const endTime = db.escape(sqlDateConvert(lastOrderRange[1]));

          querySql.push(`(lo.last_order_time BETWEEN ${startTime} AND ${endTime})`);
        }
      }

      if (query.last_shipment_date) {
        const last_time = query.last_shipment_date.split(',');

        if (last_time.length > 1) {
          const startDate = db.escape(sqlDateConvert(last_time[0]));
          const endDate = db.escape(sqlDateConvert(last_time[1]));

          const maxShipmentByPhone = `
            (
              SELECT MAX(shipment_date)
              FROM \`${this.app}\`.t_checkout
              WHERE email = u.phone 
            )
            BETWEEN ${startDate} AND ${endDate}
          `;

          const maxShipmentByEmail = `
            (
              SELECT MAX(shipment_date)
              FROM \`${this.app}\`.t_checkout
              WHERE email = u.email 
            )
            BETWEEN ${startDate} AND ${endDate}
          `;

          querySql.push(`(${maxShipmentByPhone} OR ${maxShipmentByEmail})`);
        }
      }

      if (query.birth && query.birth.length > 0) {
        const birth = query.birth.split(',');
        const birthMap = birth.map(month => parseInt(`${month}`, 10));
        if (birthMap.every(n => typeof n === 'number' && !isNaN(n))) {
          querySql.push(`(MONTH(JSON_EXTRACT(u.userData, '$.birth')) IN (${birthMap.join(',')}))`);
        }
      }

      if (query.tags && query.tags.length > 0) {
        const tags = query.tags.split(',');
        if (Array.isArray(tags) && tags.length > 0) {
          const tagConditions = tags
            .map(tag => `JSON_CONTAINS(u.userData->'$.tags', ${db.escape(`"${tag}"`)})`)
            .join(' OR ');
          querySql.push(`(${tagConditions})`);
        }
      }

      if (query.total_amount) {
        const arr = query.total_amount.split(',');
        if (arr.length > 1) {
          if (arr[0] === 'lessThan') {
            querySql.push(`(o.total_amount < ${arr[1]} OR o.total_amount is null)`);
          }
          if (arr[0] === 'moreThan') {
            querySql.push(`(o.total_amount > ${arr[1]})`);
          }
        }
      }

      if (query.last_order_total) {
        const arr = query.last_order_total.split(',');
        if (arr.length > 1) {
          if (arr[0] === 'lessThan') {
            querySql.push(`(lo.last_order_total < ${arr[1]} OR lo.last_order_total is null)`);
          }
          if (arr[0] === 'moreThan') {
            querySql.push(`(lo.last_order_total > ${arr[1]})`);
          }
        }
      }

      if (query.total_count) {
        const arr = query.total_count.split(',');
        if (arr.length > 1) {
          if (arr[0] === 'lessThan') {
            querySql.push(`(o.order_count < ${arr[1]} OR o.order_count is null)`);
          }
          if (arr[0] === 'moreThan') {
            querySql.push(`(o.order_count > ${arr[1]})`);
          }
        }
      }

      if (query.member_levels) {
        let temp: string[] = [];
        const queryLevel = query.member_levels.split(',');
        const queryIdLevel = queryLevel.filter(level => level !== 'null');

        if (queryLevel.includes('null')) {
          temp = [`member_level IS NULL`, `member_level = ''`];
        }

        if (queryIdLevel.length > 0) {
          temp = [
            ...temp,
            `member_level IN (${queryIdLevel
              .map(level => {
                return db.escape(level);
              })
              .join(',')})`,
          ];
        }

        if (temp.length > 0) {
          querySql.push(`(${temp.join(' OR ')})`);
        }
      }

      if (query.search) {
        const searchValue = `%${query.search}%`;

        const searchFields = [
          {
            key: 'name',
            condition: `UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name'))) LIKE UPPER('${searchValue}')`,
          },
          {
            key: 'phone',
            condition: `UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.phone'))) LIKE UPPER('${searchValue}')`,
          },
          {
            key: 'email',
            condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.email')) LIKE '${searchValue}'`,
          },
          {
            key: 'lineID',
            condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.lineID')) LIKE '${searchValue}'`,
          },
          {
            key: 'fb-id',
            condition: `JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$."fb-id"')) LIKE '${searchValue}'`,
          },
        ];

        // 過濾符合 searchType 的欄位
        const filteredConditions = searchFields
          .filter(({ key }) => !query.searchType || query.searchType === key)
          .map(({ condition }) => condition);

        if (filteredConditions.length > 0) {
          querySql.push(`(${filteredConditions.join(' OR ')})`);
        }
      }

      if (query.filter_type !== 'excel') {
        if (query.filter_type) {
          querySql.push(`status = ${User.typeMap[query.filter_type]}`);
        } else {
          querySql.push(`status <> ${User.typeMap.block}`);
        }
      }

      const countSQL = await this.getUserAndOrderSQL({
        select: 'count(1)',
        where: querySql,
        orderBy: query.order_string ?? '',
      });

      const processChunk = 1000;

      const getUserQuery = async (param?: { page?: number; limit?: number }) => {
        const dataSQL = await this.getUserAndOrderSQL({
          select: 'o.email, o.order_count, o.total_amount, u.*, lo.last_order_total, lo.last_order_time',
          where: querySql,
          orderBy: query.order_string ?? '',
          page: param?.page,
          limit: param?.limit,
        });

        const levelData = (await this.getConfigV2({ key: 'member_level_config', user_id: 'manager' })).levels ?? [];

        const getUsers = await db.query(dataSQL, []);

        for (const user of getUsers) {
          user.pwd = undefined;
          const find_level = levelData.find((d1: any) => user.member_level === d1.id);
          user.tag_name = find_level ? find_level.tag_name : '一般會員';
        }
        checkPoint('getUsers');

        if (param) {
          const dataArray = [];

          if (query.only_id !== 'true') {
            for (let i = 0; i < getUsers.length; i += processChunk) {
              const data = await processUserData(getUsers.slice(i, i + processChunk));
              dataArray.push(data);
              checkPoint(`processUserData ${i}`);
            }
          } else {
            return getUsers;
          }

          return dataArray.flat();
        }

        return getUsers.map((user: any) => ({ userID: user.userID }));
      };

      const processUserData = async (userData: any) => {
        // 會員等級 Map
        const levels = await this.getUserLevel(userData.map((user: any) => ({ userId: user.userID })));
        const levelMap = new Map(levels.map(lv => [lv.id, lv.data.dead_line ?? '']));
        checkPoint('levels');

        const mapUser = async (user: any) => {
          const phone = user.userData.phone || 'asnhsauh';
          const email = user.userData.email || 'asnhsauh';

          // 取得購物金餘額
          const userRebate = await new Rebate(this.app).getOneRebate({
            user_id: user.userID,
            quickPass: true,
          });
          user.rebate = userRebate ? userRebate.point : 0;

          // 取得會員等級截止日
          user.member_deadline = levelMap.get(user.userID) ?? '';
          user.latest_order_date = (
            await db.query(
              `select created_time
               from \`${this.app}\`.t_checkout
               where email in ('${email}', '${phone}')
                 and ${orderCountingSQL}
               order by created_time desc limit 0,1`,
              []
            )
          )[0];
          user.latest_order_date = user.latest_order_date && user.latest_order_date.created_time;
          user.latest_order_total = (
            await db.query(
              `select total
               from \`${this.app}\`.t_checkout
               where email in ('${email}', '${phone}')
                 and ${orderCountingSQL}
               order by created_time desc limit 0,1`,
              []
            )
          )[0];
          user.latest_order_total = user.latest_order_total && user.latest_order_total.total;
          user.checkout_total = (
            await db.query(
              `select sum(total)
               from \`${this.app}\`.t_checkout
               where email in ('${email}', '${phone}')
                 and ${orderCountingSQL} `,
              []
            )
          )[0];
          user.checkout_total = user.checkout_total && user.checkout_total['sum(total)'];
          user.checkout_count = (
            await db.query(
              `select count(1)
               from \`${this.app}\`.t_checkout
               where email in ('${email}', '${phone}')
                 and ${orderCountingSQL} `,
              []
            )
          )[0];
          user.checkout_count = user.checkout_count && user.checkout_count['count(1)'];
          user.last_order_total = user.last_order_total || 0;
          user.order_count = user.order_count || 0;
          user.total_amount = user.total_amount || 0;

          const shipmentOrder = await _shopping.getCheckOut({
            page: 0,
            limit: 1,
            email: user.email,
            is_shipment: true,
          });

          if (shipmentOrder.data[0]) {
            user.last_has_shipment_number_date = shipmentOrder.data[0].shipment_date;
          }
        };

        // 批次處理會員資料

        if (Array.isArray(userData) && userData.length > 0) {
          const chunkSize = 100;

          for (let i = 0; i < userData.length; i += chunkSize) {
            const batch = userData.slice(i, i + chunkSize);
            await Promise.all(
              batch.map(async (user: any) => {
                await mapUser(user);
                checkPoint('mapUser');
              })
            );
          }
        }

        return userData;
      };

      const [pageUsers, allUsers] = await Promise.all([
        getUserQuery({ page: query.page, limit: query.limit }),
        query.all_result ? getUserQuery() : [],
      ]);
      checkPoint('return data');

      const total = (await db.query(countSQL, []))[0]['count(1)'];

      return {
        // 指定頁數和符合篩選條件的會員資料
        data: pageUsers,
        // 所有符合篩選條件的會員資料
        ...(allUsers.length > 0 ? { allUsers } : {}),
        // 所有符合篩選條件的會員數量
        total: total,
        // 額外資料（例如未註冊的訂閱者資料）
        extra: {
          noRegisterUsers: noRegisterUsers.length > 0 ? noRegisterUsers : undefined,
        },
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getUserList Error:' + e, null);
    }
  }

  async getUserGroups(
    type?: string[],
    tag?: string,
    hide_level?: boolean
  ): Promise<
    | { result: false }
    | {
        result: true;
        data: GroupsItem[];
      }
  > {
    try {
      const pass = (text: string) => type === undefined || type.includes(text);
      let dataList: GroupsItem[] = [];

      // 訂閱者清單
      if (pass('subscriber')) {
        const subscriberList = await db.query(
          `SELECT DISTINCT u.userID, s.email
           FROM \`${this.app}\`.t_subscribe AS s
                    LEFT JOIN
                \`${this.app}\`.t_user AS u ON s.email = JSON_EXTRACT(u.userData, '$.email');`,
          []
        );

        dataList.push({ type: 'subscriber', title: '電子郵件訂閱者', users: subscriberList });
      }

      // 購買者清單
      if (pass('neverBuying') || pass('usuallyBuying')) {
        const buyingList = [] as GroupUserItem[];
        const buyingData = await db.query(
          `SELECT u.userID, c.email, JSON_UNQUOTE(JSON_EXTRACT(c.orderData, '$.email')) AS order_email
           FROM \`${this.app}\`.t_checkout AS c
                    JOIN
                \`${this.app}\`.t_user AS u ON c.email = JSON_EXTRACT(u.userData, '$.email')
           WHERE c.status = 1;`,
          []
        );

        buyingData.map((item1: { userID: number; email: string }) => {
          const index = buyingList.findIndex(item2 => item2.userID === item1.userID);
          if (index === -1) {
            buyingList.push({ userID: item1.userID, email: item1.email, count: 1 });
          } else {
            buyingList[index].count++;
          }
        });

        // 經常購買者清單
        const usuallyBuyingStandard = 9.99;
        const usuallyBuyingList = buyingList.filter(item => item.count > usuallyBuyingStandard);
        const neverBuyingData = await db.query(
          `SELECT userID, email
           FROM \`${this.app}\`.t_user
           WHERE userID not in (${buyingList
             .map(item => item.userID)
             .concat([-1111])
             .join(',')})`,
          []
        );

        dataList = dataList.concat([
          { type: 'neverBuying', title: '尚未成立有效訂單的顧客', users: neverBuyingData },
          { type: 'usuallyBuying', title: '已購買多次的顧客', users: usuallyBuyingList },
        ]);
      }

      // 會員等級
      if (!hide_level && pass('level')) {
        const levelData = await this.getLevelConfig();
        const levels = levelData
          .map((item: any) => {
            return { id: item.id, name: item.tag_name };
          })
          .filter((item: any) => {
            return tag ? item.id === tag : true;
          });

        for (const level of levels) {
          dataList.push({
            type: 'level',
            title: `會員等級 - ${level.name}`,
            tag: level.id,
            users: [],
          });
        }

        const users = await db.query(
          `SELECT userID
           FROM \`${this.app}\`.t_user;`,
          []
        );

        const levelItems = await this.getUserLevel(
          users.map((item: { userID: number }) => {
            return { userId: item.userID };
          })
        );

        for (const levelItem of levelItems) {
          const n = dataList.findIndex(item => item.tag === levelItem.data.id);
          if (n > -1) {
            dataList[n].users.push({
              userID: levelItem.id,
              email: levelItem.email,
              count: 0,
            });
          }
        }
      }

      if (type) {
        dataList = dataList.filter(item => type.includes(item.type));
      }

      return {
        result: dataList.length > 0,
        data: dataList.map(data => {
          data.count = data.users.length;
          return data;
        }),
      };
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'getUserGroups Error:' + e, null);
    }
  }

  normalMember = {
    id: '',
    duration: { type: 'noLimit', value: 0 },
    tag_name: '一般會員',
    condition: { type: 'total', value: 0 },
    dead_line: { type: 'noLimit' },
    create_date: '2024-01-01T00:00:00.000Z',
  };

  async getLevelConfig() {
    const levelData = await this.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
    const levelList = levelData.levels || [];

    if (levelList.length === 0) {
      return [this.normalMember];
    }

    const existNormalTag = levelList.find((level: any) => level.tag_name === this.normalMember.tag_name);
    const existZeroValue = levelList.find((level: any) => level.condition.value === 0);

    if (existNormalTag || existZeroValue) {
      return levelList;
    }

    const formatLevelList = levelList.map((item: any) => {
      item.index++;
      return item;
    });
    return [this.normalMember, ...formatLevelList];
  }

  private async filterMemberUpdates(idList: string[]): Promise<any[]> {
    try {
      const memberUpdates: any[] = [];

      if (idList.length === 0) {
        return [];
      }

      if (idList.length > 10000) {
        const idSetArray = [...new Set(idList)];
        const idMap = new Map();

        const getMember = await db.query(
          `SELECT *
           FROM \`${this.app}\`.t_user_public_config
           WHERE \`key\` = 'member_update'
          `,
          []
        );

        const memberMap = new Map(getMember.map((item: any) => [`${item.user_id}`, item]));

        idSetArray.map(id => {
          const getResultData = memberMap.get(`${id}`);
          getResultData && idMap.set(id, getResultData);
        });

        return Object.values(idMap);
      } else {
        const batchSize = 300;
        const batches = [];

        for (let i = 0; i < idList.length; i += batchSize) {
          const slice = idList.slice(i, i + batchSize);
          const placeholders = slice.map(() => '?').join(',');
          const query = `
              SELECT *
              FROM \`${this.app}\`.t_user_public_config
              WHERE \`key\` = 'member_update'
                AND user_id IN (${placeholders});
          `;
          batches.push({ query, params: slice });
        }

        const results = await Promise.all(
          batches.map(({ query, params }) => {
            return db.query(query, params);
          })
        );

        for (const result of results) {
          memberUpdates.push(...result);
        }
      }

      return memberUpdates;
    } catch (error) {
      console.error(`filterMemberUpdates error: ${error}`);
      return [];
    }
  }

  private async setLevelData(user: any, quickPass: boolean, memberUpdates: any, levelList: any) {
    const { userID, userData } = user;
    const { level_status, level_default, email } = userData;

    const normalMember = levelList[0] ?? this.normalMember;
    const normalData = {
      id: normalMember.id,
      og: normalMember,
      trigger: true,
      tag_name: normalMember.tag_name,
      dead_line: '',
    };

    // 優先處理手動等級
    if (level_status === 'manual') {
      const matchedLevel = levelList.find((item: { id: string }) => item.id === level_default);
      return {
        id: userID,
        email,
        status: 'manual',
        data: matchedLevel ?? normalData,
      };
    }

    // 啟用快速通關處理會員等級
    if (quickPass) {
      const index = user.member_level ? levelList.findIndex((level: any) => level.id === user.member_level) : 0;
      const getLevel = levelList[index];

      const formatData = {
        id: getLevel.id,
        og: {
          id: getLevel.id,
          index: index,
          duration: getLevel.duration,
          tag_name: getLevel.tag_name,
          condition: getLevel.condition,
          dead_line: getLevel.dead_line,
          create_date: getLevel.create_date,
        },
        trigger: true,
        tag_name: getLevel.tag_name,
        dead_line: '',
      };

      return {
        id: userID,
        email,
        status: 'auto',
        data: formatData,
      };
    }

    // 處理自動等級
    if (memberUpdates.length > 0) {
      const matchedUpdates = await this.checkMember(user, false);
      const triggeredLevel = matchedUpdates.find((v: { trigger: boolean }) => v.trigger);

      if (triggeredLevel) {
        return {
          id: userID,
          email,
          status: 'auto',
          data: triggeredLevel,
        };
      }
    }

    // 預設回傳一般會員
    return {
      id: userID,
      email,
      status: 'auto',
      data: normalData,
    };
  }

  async getUserLevel(
    data: {
      userId?: string;
      email?: string;
    }[]
  ): Promise<
    {
      id: number;
      email: string;
      data: MemberLevel;
      status: 'auto' | 'manual';
    }[]
  > {
    const utTimer = new UtTimer('getUserLevel');

    const idList: string[] = data
      .filter(item => Boolean(item.userId))
      .map(item => `${item.userId}`)
      .concat(['-1111']);

    const emailList: string[] = data
      .filter(item => Boolean(item.email))
      .map(item => `"${item.email}"`)
      .concat(['-1111']);

    const users = await db.query(
      `
          SELECT *
          FROM \`${this.app}\`.t_user
          WHERE userID in (${idList.join(',')})
             OR email in (${emailList.join(',')})
      `,
      []
    );

    if (!users || users.length == 0) return [];

    const chunk = 20;
    const dataList: any = [];
    const levelConfig = await this.getLevelConfig();
    const memberUpdates = await this.filterMemberUpdates(idList);

    for (let i = 0; i < users.length; i += chunk) {
      const userArray = users.slice(i, i + chunk);
      await Promise.all(
        userArray.map(async (user: any) => {
          const userData = await this.setLevelData(user, users.length > 100, memberUpdates, levelConfig);
          dataList.push(userData);
        })
      );
    }

    return dataList;
  }

  async subscribe(email: string, tag: string) {
    try {
      await db.queryLambada(
        {
          database: this.app,
        },
        async sql => {
          await sql.query(
            `replace
            into t_subscribe (email,tag) values (?,?)`,
            [email, tag]
          );
        }
      );
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e, null);
    }
  }

  async registerFcm(userID: string, deviceToken: string) {
    try {
      await db.queryLambada(
        {
          database: this.app,
        },
        async sql => {
          await sql.query(
            `replace
            into t_fcm (userID,deviceToken) values (?,?)`,
            [userID, deviceToken]
          );
        }
      );
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e, null);
    }
  }

  async deleteSubscribe(email: string) {
    try {
      await db.query(
        `delete
         FROM \`${this.app}\`.t_subscribe
         where email in (?)`,
        [email.split(',')]
      );
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e, null);
    }
  }

  async getSubScribe(query: any) {
    try {
      const querySql: any = [];
      query.page = query.page ?? 0;
      query.limit = query.limit ?? 50;
      if (query.search) {
        querySql.push(
          [
            `(s.email LIKE '%${query.search}%') && (s.tag != ${db.escape(query.search)})`,
            `(s.tag = ${db.escape(query.search)})
                        `,
          ].join(` || `)
        );
      }
      if (query.account) {
        switch (query.account) {
          case 'yes':
            querySql.push(`(u.account is not null)`);
            break;
          case 'no':
            querySql.push(`(u.account is null)`);
            break;
        }
      }
      const subData = await db.query(
        `SELECT s.*, u.account
         FROM \`${this.app}\`.t_subscribe AS s
                  LEFT JOIN \`${this.app}\`.t_user AS u
                            ON s.email = u.account
         WHERE ${querySql.length > 0 ? querySql.join(' AND ') : '1 = 1'} LIMIT ${query.page * query.limit}
             , ${query.limit}

        `,
        []
      );
      const subTotal = await db.query(
        `SELECT count(*) as c
         FROM \`${this.app}\`.t_subscribe AS s
                  LEFT JOIN \`${this.app}\`.t_user AS u
                            ON s.email = u.account
         WHERE ${querySql.length > 0 ? querySql.join(' AND ') : '1 = 1'}

        `,
        []
      );
      return {
        data: subData,
        total: subTotal[0].c,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getSubScribe Error:' + e, null);
    }
  }

  async getFCM(query: any) {
    try {
      query.page = query.page ?? 0;
      query.limit = query.limit ?? 50;
      const querySql: any = [];
      query.search &&
        querySql.push(
          [
            `(userID in (select userID from \`${this.app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))))`,
          ].join(` || `)
        );
      const data = await new UtDatabase(this.app, `t_fcm`).querySql(querySql, query as any);
      for (const b of data.data) {
        let userData = (
          await db.query(
            `select userData
             from \`${this.app}\`.t_user
             where userID = ?`,
            [b.userID]
          )
        )[0];
        b.userData = userData && userData.userData;
      }
      return data;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
    }
  }

  async deleteUser(query: { id?: string; email?: string }) {
    try {
      //確保單一進來的元素不會被解析成字串
      if (query.id) {
        await db.query(
          `delete
           FROM \`${this.app}\`.t_user
           where id in (?)`,
          [query.id.split(',')]
        );
      } else if (query.email) {
        await db.query(
          `delete
           FROM \`${this.app}\`.t_user
           where userData ->>'$.email'=?`,
          [query.email]
        );
      }
      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e, null);
    }
  }

  async updateUserData(userID: string, par: any, manager: boolean = false) {
    const getUser = await db.query(
      `SELECT *
       FROM \`${this.app}\`.t_user
       WHERE userID = ${db.escape(userID)}
      `,
      []
    );
    const userData = getUser[0] ?? {};

    if (!userData.userData) {
      return { data: {} };
    }

    try {
      const login_config = await this.getConfigV2({ key: 'login_config', user_id: 'manager' });
      const register_form = await this.getConfigV2({ key: 'custom_form_register', user_id: 'manager' });

      register_form.list = register_form.list ?? [];
      FormCheck.initialRegisterForm(register_form.list);

      const userDataVerify = await redis.getValue(`verify-${userData.userData.email}`);
      const parDataVerify = await redis.getValue(`verify-${par.userData.email}`);

      // 更改密碼驗證
      if (par.userData.pwd) {
        if (userDataVerify === par.userData.verify_code) {
          const pwd = await tool.hashPwd(par.userData.pwd);
          await db.query(
            `UPDATE \`${this.app}\`.t_user
             SET pwd = ?
             WHERE userID = ${db.escape(userID)}
            `,
            [pwd]
          );
        } else {
          throw exception.BadRequestError('BAD_REQUEST', 'Password verify code error.', {
            msg: 'password-verify-false',
          });
        }
      }

      // 更改信箱驗證
      if (par.userData.email && par.userData.email !== userData.userData.email) {
        const count = (
          await db.query(
            `SELECT count(1)
             FROM \`${this.app}\`.t_user
             WHERE (userData ->>'$.email' = ${db.escape(par.userData.email)})
               AND (userID != ${db.escape(userID)})`,
            []
          )
        )[0]['count(1)'];

        if (count) {
          throw exception.BadRequestError('BAD_REQUEST', 'User email already exists.', {
            msg: 'email-exists',
          });
        }

        if (
          !manager &&
          login_config.email_verify &&
          par.userData.verify_code !== parDataVerify &&
          register_form.list.some((r: any) => r.key === 'email' && `${r.hidden}` !== 'true')
        ) {
          throw exception.BadRequestError('BAD_REQUEST', 'ParData email verify code error.', {
            msg: 'email-verify-false',
          });
        }
      }

      // 更改手機驗證
      if (par.userData.phone && par.userData.phone !== userData.userData.phone) {
        const count = (
          await db.query(
            `SELECT count(1)
             FROM \`${this.app}\`.t_user
             WHERE (userData ->>'$.phone' = ${db.escape(par.userData.phone)})
               AND (userID != ${db.escape(userID)}) `,
            []
          )
        )[0]['count(1)'];

        if (count) {
          throw exception.BadRequestError('BAD_REQUEST', 'User phone already exists.', {
            msg: 'phone-exists',
          });
        }

        if (
          !manager &&
          login_config.phone_verify &&
          !(await PhoneVerify.verify(par.userData.phone, par.userData.verify_code_phone)) &&
          register_form.list.some((dd: any) => dd.key === 'phone' && `${dd.hidden}` !== 'true')
        ) {
          throw exception.BadRequestError('BAD_REQUEST', 'ParData phone verify code error.', {
            msg: 'phone-verify-false',
          });
        }
      }

      par.status = User.typeMap[par.userData.type as 'block' | 'normal' | 'watch'] ?? User.typeMap.normal;

      if (par.userData.phone) {
        await db.query(
          `UPDATE \`${this.app}\`.t_checkout
           SET email = ?
           WHERE id > 0
             AND email = ?
          `,
          [par.userData.phone, `${userData.userData.phone}`]
        );
        userData.account = par.userData.phone;
      }

      if (par.userData.email) {
        await db.query(
          `UPDATE \`${this.app}\`.t_checkout
           SET email = ?
           WHERE id > 0
             AND email = ?
          `,
          [par.userData.email, `${userData.userData.email}`]
        );
        userData.account = par.userData.email;
      }

      par.userData = await this.checkUpdate({
        updateUserData: par.userData,
        userID,
        manager,
      });

      delete par.userData.verify_code;

      par = {
        account: userData.account,
        userData: JSON.stringify(par.userData),
        status: par.status,
      };

      if (!par.account) {
        delete par.account;
      }

      const data = await db.query(
        `UPDATE \`${this.app}\`.t_user
         SET ?
         WHERE 1 = 1
           AND userID = ?
        `,
        [par, userID]
      );

      await UserUpdate.update(this.app, userID);

      return { data };
    } catch (e: any) {
      delete userData.pwd;
      delete userData.userData.verify_code;
      throw exception.BadRequestError(e.code || 'BAD_REQUEST', e.message, { data: userData });
    }
  }

  async batchGetUser(userId: string[]) {
    try {
      const sql = `SELECT *
                   FROM \`${this.app}\`.t_user
                   WHERE userID = ?`;
      const dataArray: any = [];

      const stack: Stack = {
        appName: this.app,
        taskId: Tool.randomString(12),
        taskTag: 'batchGetUser',
        progress: 0,
      };

      StackTracker.stack.push(stack);

      if (Array.isArray(userId) && userId.length > 0) {
        const chunkSize = 100;
        for (let i = 0; i < userId.length; i += chunkSize) {
          const size = i + chunkSize;
          const batch = userId.slice(i, size);
          await Promise.all(
            batch.map(async id => {
              const results = await db.query(sql, [db.escape(id)]);
              results.forEach((result: any) => delete result.pwd);
              dataArray.push(results);
            })
          );
          StackTracker.setProgress(stack.taskId, StackTracker.calcPercentage(size, userId.length));
        }
      }

      StackTracker.clearProgress(stack.taskId);

      return dataArray.flat();
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Batch get userData:' + error, null);
    }
  }

  async batchUpdateUserData(trackName: string, users: { id: string; data: any }[]) {
    try {
      const stack: Stack = {
        appName: this.app as string,
        taskId: Tool.randomString(12),
        taskTag: trackName,
        progress: 0,
      };

      StackTracker.stack.push(stack);

      if (Array.isArray(users) && users.length > 0) {
        const chunkSize = 200;
        for (let i = 0; i < users.length; i += chunkSize) {
          const size = i + chunkSize;
          const batch = users.slice(i, size);
          StackTracker.setProgress(stack.taskId, StackTracker.calcPercentage(size, users.length));
          await Promise.all(
            batch.map(async user => {
              await new Promise(async resolve => {
                await this.updateUserData(user.id, user.data);
                setTimeout(() => resolve(true), 200);
              });
            })
          );
        }
      }

      StackTracker.clearProgress(stack.taskId);

      return;
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Batch update userData:' + error, null);
    }
  }

  async batchAddtag(userId: string[], tags: string[]) {
    try {
      const users = await this.batchGetUser(userId);

      const updateData = users.map((item: any) => {
        item.userData.tags = item.userData.tags ? [...new Set([...item.userData.tags, ...tags])] : tags;

        return {
          id: item.userID,
          data: item,
        };
      });

      await this.batchUpdateUserData('batchAddtag', updateData);
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Batch add tag:' + error, null);
    }
  }

  async batchRemovetag(userId: string[], tags: string[]) {
    try {
      const users = await this.batchGetUser(userId);
      const postMap: Map<string, boolean> = new Map(tags.map(tag => [tag, true]));

      const updateData = users.map((item: any) => {
        item.userData.tags = item.userData.tags ? item.userData.tags.filter((tag: string) => !postMap.get(tag)) : [];

        return {
          id: item.userID,
          data: item,
        };
      });

      await this.batchUpdateUserData('batchRemovetag', updateData);
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Batch remove tag:' + error, null);
    }
  }

  async batchManualLevel(userId: string[], level: string[]) {
    try {
      const users = await this.batchGetUser(userId);

      const updateData = users.map((item: any) => {
        item.userData.level_status = 'manual';
        item.userData.level_default = level;

        return {
          id: item.userID,
          data: item,
        };
      });

      await this.batchUpdateUserData('batchManualLevel', updateData);
    } catch (error) {
      throw exception.BadRequestError('BAD_REQUEST', 'Batch manual level:' + error, null);
    }
  }

  async clearUselessData(userData: any, manager: boolean) {
    let config = await App.getAdConfig(this.app, 'glitterUserForm');
    let register_form =
      (
        await this.getConfigV2({
          key: 'custom_form_register',
          user_id: 'manager',
        })
      ).list ?? [];
    FormCheck.initialRegisterForm(register_form);
    let customer_form_user_setting =
      (
        await this.getConfigV2({
          key: 'customer_form_user_setting',
          user_id: 'manager',
        })
      ).list ?? [];
    if (!Array.isArray(config)) {
      config = [];
    }
    config = config.concat(register_form).concat(customer_form_user_setting);
    Object.keys(userData).map(dd => {
      if (
        !config.find((d2: any) => {
          return d2.key === dd && (d2.auth !== 'manager' || manager);
        }) &&
        !['level_status', 'level_default', 'contact_phone', 'contact_name', 'tags', 'receive_list'].includes(dd)
      ) {
        delete userData[dd];
      }
    });
  }

  async checkUpdate(cf: { updateUserData: any; manager: boolean; userID: string }) {
    let originUserData = (
      await db.query(
        `select userData
         from \`${this.app}\`.\`t_user\`
         where userID = ${db.escape(cf.userID)}`,
        []
      )
    )[0]['userData'];
    if (typeof originUserData !== 'object') {
      originUserData = {};
    }

    //清空不得編輯的資料
    await this.clearUselessData(cf.updateUserData, cf.manager);

    function mapUserData(userData: any, originUserData: any) {
      Object.keys(userData).map(dd => {
        originUserData[dd] = userData[dd];
      });
    }

    mapUserData(cf.updateUserData, originUserData);
    return originUserData;
  }

  async resetPwd(user_id_and_account: string, newPwd: string) {
    try {
      if(user_id_and_account.includes('@')){
        await db.query(
          `update \`${this.app}\`.t_user
         SET ?
         WHERE 1 = 1
           and ((userData ->>'$.email' = ?))`,
          [
            {
              pwd: await tool.hashPwd(newPwd),
            },
            user_id_and_account,
          ]
        );
      }else{
        await db.query(
          `update \`${this.app}\`.t_user
         SET ?
         WHERE 1 = 1
           and ((userData ->>'$.phone' = ?))`,
          [
            {
              pwd: await tool.hashPwd(newPwd),
            },
            user_id_and_account,
          ]
        );
      }

      return {
        result: true,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'resetPwd Error:' + e, null);
    }
  }

  async resetPwdNeedCheck(userID: string, pwd: string, newPwd: string) {
    try {
      const data: any = (
        (await db.execute(
          `select *
           from \`${this.app}\`.t_user
           where userID = ?
             and status <> 0`,
          [userID]
        )) as any
      )[0];
      if (await tool.compareHash(pwd, data.pwd)) {
        const result = (await db.query(
          `update \`${this.app}\`.t_user
           SET ?
           WHERE 1 = 1
             and userID = ?`,
          [
            {
              pwd: await tool.hashPwd(newPwd),
            },
            userID,
          ]
        )) as any;
        return {
          result: true,
        };
      } else {
        throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
      }
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
    }
  }

  async updateAccountBack(token: string) {
    try {
      const sql = `select userData
                   from \`${this.app}\`.t_user
                   where JSON_EXTRACT(userData, '$.mailVerify') = ${db.escape(token)}`;
      const userData = (await db.query(sql, []))[0]['userData'];
      await db.execute(
        `update \`${this.app}\`.t_user
         set account=${db.escape(userData.updateAccount)}
         where JSON_EXTRACT(userData, '$.mailVerify') = ?`,
        [token]
      );
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
    }
  }

  async verifyPASS(token: string) {
    try {
      const par = {
        status: 1,
      };
      return (await db.query(
        `update \`${this.app}\`.t_user
         SET ?
         WHERE 1 = 1
           and JSON_EXTRACT(userData, '$.mailVerify') = ?`,
        [par, token]
      )) as any;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
    }
  }

  async checkUserExists(account: string) {
    try {
      return (
        (
          (await db.execute(
            `select count(1)
             from \`${this.app}\`.t_user
             where userData ->>'$.email'
               and status!=0`,
            [account]
          )) as any
        )[0]['count(1)'] == 1
      );
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
    }
  }

  async checkMailAndPhoneExists(
    email?: string,
    phone?: string
  ): Promise<{
    exist: boolean;
    email?: string;
    phone?: string;
    emailExists: boolean;
    phoneExists: boolean;
  }> {
    try {
      let emailExists = false;
      let phoneExists = false;

      if (email) {
        const emailResult = await db.execute(
          `SELECT COUNT(1) AS count
           FROM \`${this.app}\`.t_user
           WHERE userData ->>'$.email' = ?
          `,
          [email]
        );
        emailExists = (emailResult as any)[0]?.count > 0;
      }

      if (phone) {
        const phoneResult = await db.execute(
          `SELECT COUNT(1) AS count
           FROM \`${this.app}\`.t_user
           WHERE userData ->>'$.phone' = ?
          `,
          [phone]
        );
        phoneExists = (phoneResult as any)[0]?.count > 0;
      }

      return {
        exist: emailExists || phoneExists,
        email,
        phone,
        emailExists,
        phoneExists,
      };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
    }
  }

  async checkUserIdExists(id: number) {
    try {
      const count = (
        await db.query(
          `select count(1)
           from \`${this.app}\`.t_user
           where userID = ?`,
          [id]
        )
      )[0]['count(1)'];
      return count;
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
    }
  }

  async setConfig(config: { key: string; value: any; user_id?: string }) {
    try {
      if (typeof config.value !== 'string') {
        config.value = JSON.stringify(config.value);
      }
      if (
        (
          await db.query(
            `select count(1)
             from \`${this.app}\`.t_user_public_config
             where \`key\` = ?
               and user_id = ? `,
            [config.key, config.user_id ?? this.token!.userID]
          )
        )[0]['count(1)'] === 1
      ) {
        await db.query(
          `update \`${this.app}\`.t_user_public_config
           set value=?,
               updated_at=?
           where \`key\` = ?
             and user_id = ?`,
          [config.value, new Date(), config.key, config.user_id ?? this.token!.userID]
        );
      } else {
        await db.query(
          `insert
           into \`${this.app}\`.t_user_public_config (\`user_id\`, \`key\`, \`value\`, updated_at)
           values (?, ?, ?, ?)
          `,
          [config.user_id ?? this.token!.userID, config.key, config.value, new Date()]
        );
      }
      //如果重新設定301轉址的話會需要將ApiPublic.app301重新清理過
      if (config.key === 'domain_301') {
        const find_app_301 = ApiPublic.app301.find(dd => {
          return dd.app_name === this.app;
        });
        if (find_app_301) {
          find_app_301.router = JSON.parse(config.value).list;
        }
      }
      User.configData[this.app + config.key + (config.user_id ?? this.token!.userID)] = JSON.parse(config.value);
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async getConfig(config: { key: string; user_id: string }) {
    try {
      return await db.execute(
        `select *
         from \`${this.app}\`.t_user_public_config
         where \`key\` = ${db.escape(config.key)}
           and user_id = ${db.escape(config.user_id)}
        `,
        []
      );
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  //CONFIG 的暫存避免頻繁撈取SQL資料
  static configData: any = {};

  async getConfigV2(config: { key: string; user_id: string }): Promise<any> {
    const app = this.app;
    try {
      // function checkConfigCache() {
      //   if (
      //     !config.key.split(',').find(dd => {
      //       return !User.configData[app + dd + config.user_id];
      //     })
      //   ) {
      //     if (config.key.includes(',')) {
      //       return config.key.split(',').map(dd => {
      //         return {
      //           key: dd,
      //           value: User.configData[app + dd + config.user_id],
      //         };
      //       });
      //     } else {
      //       return User.configData[app + config.key + config.user_id];
      //     }
      //   }
      // }


      const that = this;

      const getData = await db.execute(
        `SELECT *
         FROM \`${this.app}\`.t_user_public_config
         WHERE ${
           config.key.includes(',')
             ? `\`key\` IN (${config.key
                 .split(',')
                 .map(dd => db.escape(dd))
                 .join(',')})`
             : `\`key\` = ${db.escape(config.key)}`
         }
           AND user_id = ${db.escape(config.user_id)}`,
        []
      );

      async function loop(data: any) {
        if (!data && config.user_id === 'manager') {
          const defaultValues: Record<string, any> = {
            customer_form_user_setting: { list: FormCheck.initialUserForm([]) },
            global_express_country: { country: [] },
            store_version: { version: 'v1' },
            store_manager: {
              list: [
                {
                  id: 'store_default',
                  name: '庫存點1(預設)',
                  note: '',
                  address: '',
                  manager_name: '',
                  manager_phone: '',
                },
              ],
            },
            member_level_config: { levels: [] },
            'language-label': { label: [] },
            'store-information': {
              language_setting: { def: 'zh-TW', support: ['zh-TW'] },
            },
            'list-header-view': FormCheck.initialListHeader(),
          };

          // 處理條款類型的 key
          if (config.key.startsWith('terms-related-')) {
            defaultValues[config.key] = TermsCheck.check(config.key);
          }

          // 設定並返回新的值
          if (defaultValues.hasOwnProperty(config.key)) {
            await that.setConfig({
              key: config.key,
              user_id: config.user_id,
              value: defaultValues[config.key],
            });
            return await that.getConfigV2(config);
          }
        }

        if (data && data.value) {
          data.value = (await that.checkLeakData(config.key, data.value)) || data.value; // 資料存在則進行異常數據檢查
        } else if (config.key === 'store-information') {
          return { language_setting: { def: 'zh-TW', support: ['zh-TW'] } }; // store-information 預設回傳
        }

        return await that.checkLeakData(config.key, (data && data.value) || {});
      }

      if (config.key.includes(',')) {
        return Promise.all(
          config.key.split(',').map(async dd => ({
            key: dd,
            value: await loop(getData.find((d1: any) => d1.key === dd)),
          }))
        );
      } else {
        return loop(getData[0]);
      }

    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async checkLeakData(key: string, value: any) {
    switch (key) {
      case 'store-information': {
        value.language_setting ??= { def: 'zh-TW', support: ['zh-TW'] };

        if (value.chat_toggle === undefined) {
          const config = await this.getConfigV2({ key: 'message_setting', user_id: 'manager' });
          value.chat_toggle = config.toggle;
        }

        value.pos_support_finction = value.pos_support_finction ?? [];
        value.checkout_mode ??= {
          payload: ['1'],
          progress: ['shipping', 'wait', 'finish', 'arrived', 'pre_order'],
          orderStatus: ['1', '0'],
        };

        value.invoice_mode ??= {
          payload: ['1'],
          progress: ['shipping', 'wait', 'finish', 'arrived', 'pre_order'],
          orderStatus: ['1', '0'],
          afterDays: 0,
        };
        break;
      }
      case 'menu-setting':
      case 'footer-setting':
        if (Array.isArray(value)) {
          return { 'zh-TW': value, 'en-US': [], 'zh-CN': [] };
        }
        break;
      case 'store_manager':
        value.list ??= [
          {
            id: 'store_default',
            name: '庫存點1(預設)',
            note: '',
            address: '',
            manager_name: '',
            manager_phone: '',
          },
        ];
        break;
      case 'customer_form_user_setting':
        value.list = FormCheck.initialUserForm(value.list);
        break;
      case 'list-header-view':
        value = FormCheck.initialListHeader(value);
        break;
      case 'login_config':
        value = FormCheck.initialLoginConfig(value);
        break;
      case 'auto_fcm':
        value = AutoFcm.initial(value);
        break;
    }
    return value;
  }

  async checkEmailExists(email: string) {
    try {
      const count = (
        await db.query(
          `select count(1)
           from \`${this.app}\`.t_user
           where userData ->>'$.email' = ?`,
          [email]
        )
      )[0]['count(1)'];
      return count;
    } catch (e) {
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async checkPhoneExists(phone: string) {
    try {
      const count = (
        await db.query(
          `select count(1)
           from \`${this.app}\`.t_user
           where userData ->>'$.phone' = ?`,
          [phone]
        )
      )[0]['count(1)'];
      return count;
    } catch (e) {
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async getUnreadCount() {
    try {
      const last_read_time = await db.query(
        `SELECT value
         FROM \`${this.app}\`.t_user_public_config
         where \`key\` = 'notice_last_read'
           and user_id = ?;`,
        [this.token?.userID]
      );
      const date = !last_read_time[0] ? new Date('2022-01-29') : new Date(last_read_time[0].value.time);
      const count = (
        await db.query(
          `select count(1)
           from \`${this.app}\`.t_notice
           where user_id = ?
             and created_time > ?`,
          [this.token?.userID, date]
        )
      )[0]['count(1)'];
      return {
        count: count,
      };
    } catch (e) {
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async checkAdminPermission() {
    try {
      const result = await db.query(
        `select count(1)
         from ${process.env.GLITTER_DB}.app_config
         where (appName = ?
             and user = ?)
            OR appName in (
             (SELECT appName
              FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
              WHERE user = ?
                AND status = 1
                AND invited = 1
                AND appName = ?));`,
        [this.app, this.token?.userID, this.token?.userID, this.app]
      );
      return {
        result: result[0]['count(1)'] === 1,
      };
    } catch (e) {}
  }

  async getNotice(cf: { query: any }) {
    try {
      const query = [`user_id=${this.token?.userID}`];
      let last_time_read = 0;
      const last_read_time = await db.query(
        `SELECT value
         FROM \`${this.app}\`.t_user_public_config
         where \`key\` = 'notice_last_read'
           and user_id = ?;`,
        [this.token?.userID]
      );
      if (!last_read_time[0]) {
        await db.query(
          `insert into \`${this.app}\`.t_user_public_config (user_id, \`key\`, value, updated_at)
           values (?, ?, ?, ?)`,
          [this.token?.userID, 'notice_last_read', JSON.stringify({ time: new Date() }), new Date()]
        );
      } else {
        last_time_read = new Date(last_read_time[0].value.time).getTime();
        await db.query(
          `update \`${this.app}\`.t_user_public_config
           set \`value\`=?
           where user_id = ?
             and \`key\` = ?`,
          [JSON.stringify({ time: new Date() }), `${this.token?.userID}`, 'notice_last_read']
        );
      }
      const response: any = await new UtDatabase(this.app, `t_notice`).querySql(query, cf.query);
      response.last_time_read = last_time_read;
      return response;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
    }
  }

  async forgetPassword(email: string) {
    const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-forget', 'zh-TW');
    const code = Tool.randomNumber(6);
    await redis.setValue(`forget-${email}`, code);
    await redis.setValue(`forget-count-${email}`, '0');
    if(email.includes('@')){
      sendmail(`${data.name} <${process.env.smtp}>`, email, data.title, data.content.replace('@{{code}}', code));
    }else{
      const data = await AutoSendEmail.getDefCompare(this.app, 'auto-phone-verify-update', 'zh-TW');
      data.content = data.content.replace(`@{{code}}`, code);
      const sns = new SMS(this.app, this.token);
      await sns.sendSNS({ data: data.content as string, phone: email }, () => {});
    }


  }

  static async ipInfo(ip: string) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://ipinfo.io/${ip}?token=` + process.env.ip_info_auth,
        headers: {},
      };

      const db_data = (
        await db.query(
          `select *
           from ${saasConfig.SAAS_NAME}.t_ip_info
           where ip = ?`,
          [ip]
        )
      )[0];
      let ip_data = db_data && db_data.data;
      if (!ip_data) {
        ip_data = (await axios.request(config)).data;
        await db.query(
          `insert into ${saasConfig.SAAS_NAME}.t_ip_info (ip, data)
           values (?, ?)`,
          [ip, JSON.stringify(ip_data)]
        );
      }
      return ip_data;
    } catch (e) {
      return {
        country: 'TW',
      };
    }
  }

  async getCheckoutCountingModeSQL(table?: string) {
    const storeInfo = await this.getConfigV2({ key: 'store-information', user_id: 'manager' });
    const sqlQuery = await this.getOrderModeQuery(storeInfo.checkout_mode, table);

    if (sqlQuery.length === 0) {
      return '1 = 0'; // 無需累計的判斷式
    }

    return sqlQuery.join(' AND ');
  }

  async getInvoiceCountingModeSQL(table?: string): Promise<{
    invoice_mode: any;
    sql_string: string;
  }> {
    const storeInfo = await this.getConfigV2({ key: 'store-information', user_id: 'manager' });
    const sqlQuery = await this.getOrderModeQuery(storeInfo.invoice_mode, table);

    if (sqlQuery.length === 0) {
      return {
        invoice_mode: storeInfo.invoice_mode,
        sql_string: '1 = 0', // 無需累計的判斷式
      };
    }

    return {
      invoice_mode: storeInfo.invoice_mode,
      sql_string: sqlQuery.join(' AND '),
    };
  }

  async getOrderModeQuery(storeData: StoreDataMode, table?: string): Promise<string[]> {
    const asTable = table ? `${table}.` : '';

    if (storeData.progress.includes('in_stock') && !storeData.progress.includes('wait')) {
      storeData.progress.push('wait');
    }

    const sqlQuery: string[] = [];
    const sqlObject: Record<string, { key: string; options: Set<string>; addNull: Set<string> }> = {
      orderStatus: {
        key: `order_status`,
        options: new Set(['1', '0', '-1']),
        addNull: new Set(['0']),
      },
      payload: {
        key: `status`,
        options: new Set(['1', '3']),
        addNull: new Set(),
      },
      progress: {
        key: `progress`,
        options: new Set(['finish', 'arrived', 'shipping', 'pre_order', 'wait', 'returns']),
        addNull: new Set(['wait']),
      },
    };

    Object.entries(storeData).forEach(([key, mode]) => {
      const obj = sqlObject[key];
      if (!Array.isArray(mode) || mode.length === 0 || !obj) return;

      const modeSet = new Set(mode); // O(n) 預處理
      const sqlTemp: string[] = [];

      const validValues = [...obj.options].filter(val => modeSet.has(val)); // O(n)
      if (validValues.length > 0) {
        sqlTemp.push(`${asTable}${obj.key} IN (${validValues.map(val => `'${val}'`).join(',')})`);
      }

      if ([...obj.addNull].some(val => modeSet.has(val))) {
        sqlTemp.push(`${asTable}${obj.key} IS NULL`);
      }

      if (sqlTemp.length > 0) {
        sqlQuery.push(`(${sqlTemp.join(' OR ')})`);
      }
    });

    return sqlQuery;
  }
}
