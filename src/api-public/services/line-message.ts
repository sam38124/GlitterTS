import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { AutoSendEmail } from './auto-send-email.js';
import config from '../../config.js';
import axios from 'axios';
import { App } from '../../services/app.js';
import Tool from '../../modules/tool.js';
import { Chat } from './chat.js';
import { User } from './user.js';
import Logger from '../../modules/logger.js';
import s3bucket from '../../modules/AWSLib.js';
import { Jimp } from 'jimp';
import redis from '../../modules/redis.js';
import process from 'process';
import { ShopnexLineMessage } from './model/shopnex-line-message';

const mime = require('mime');
interface LineResponse {
  // 定義 response 物件的結構，根據實際 API 回應的格式進行調整
  clientid?: string;
  msgid?: string;
  statuscode: number;
  accountPoint?: number;
  Duplicate?: string;
  smsPoint?: number;
  message?: string;
}

export interface ChatRoom {
  chat_id: string;
  type: 'user' | 'group';
  info: any;
  participant: string[];
}

interface Config {
  method: 'post' | 'get';
  url: string;
  headers: Record<string, string>;
  data: any;
}

interface LineData {
  username: string;
  password: string;
  dstaddr: string;
  smbody: string;
  smsPointFlag: number;
}

export class LineMessage {
  public app;
  public token: IToken | undefined;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token ?? undefined;
  }

  async chunkSendLine(userList: any, content: any, id: number, date?: string) {
    try {
      // let msgid = ""

      let check = userList.length;
      await new Promise(resolve => {
        for (const d of userList) {
          this.sendLine({ data: content, lineID: d.lineID }, res => {
            check--;
            if (check === 0) {
              db.query(
                `UPDATE \`${this.app}\`.t_triggers
                                      SET status = ${date ? 0 : 1},
                                          content = JSON_SET(content, '$.name', '${res.msgid}')
                                      WHERE id = ?;`,
                [id]
              );
              resolve(true);
            }
          });
        }
      });
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
    }
  }

  async getLineInf(obj: { lineID: string }, callback: (data: any) => void) {
    try {
      const post = new User(this.app, this.token);

      let tokenData = await post.getConfig({
        key: 'login_line_setting',
        user_id: 'manager',
      });
      let token = `Bearer ${tokenData[0].value.message_token}`;
      const urlConfig: Config = {
        method: 'get',
        url: `https://api.line.me/v2/bot/profile/${obj.lineID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        data: {},
      };
      return new Promise<boolean>((resolve, reject) => {
        axios
          .request(urlConfig)
          .then((response: any) => {
            // let result = response.data.split('\r\n')

            callback(response.data);
            resolve(response.data);
          })
          .catch((error: any) => {
            console.log('error -- ', error.data);
            resolve(false);
          });
      });
    } catch (e: any) {
      throw exception.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
    }
  }

  async sendLine(
    obj: {
      data: {
        text?: string;
        image?: string;
        attachment?: any;
      };
      lineID: string;
    },
    callback: (data: any) => void
  ) {
    obj.data.attachment = obj.data.attachment || '';
    try {
      obj.data.text = obj.data.text ? obj.data.text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : undefined;
      const post = new User(this.app, this.token);
      let tokenData = await post.getConfig({
        key: 'login_line_setting',
        user_id: 'manager',
      });
      let token = `${tokenData[0].value.message_token}`;
      if (obj.data.image) {
        // 你要下載的圖片網址
        const imageUrl = obj.data.image;
        const outputFilePath = 'image_cropped.jpeg';

        // 下載圖片並讀取
        axios
          .get(imageUrl, { responseType: 'arraybuffer' })
          .then((response: any) => Jimp.read(Buffer.from(response.data)))
          .then(async (image: any) => {
            // 進行裁剪操作
            const small = await image.clone().scaleToFit({ w: 240, h: 240 }).getBuffer('image/jpeg');
            const large = await image.clone().scaleToFit({ w: 1024, h: 1024 }).getBuffer('image/jpeg');
            return [small, large];
          })
          .then((base64: any) => {
            // const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            this.uploadFile(`line/${new Date().getTime()}.jpeg`, base64[0]).then(smallUrl => {
              this.uploadFile(`line/${new Date().getTime()}.jpeg`, base64[1]).then(largeUrl => {
                const message = {
                  to: obj.lineID,
                  messages: [
                    {
                      type: 'image',
                      originalContentUrl: largeUrl, // 原圖的 URL，必須是 HTTPS
                      previewImageUrl: smallUrl, // 縮略圖的 URL，必須是 HTTPS
                    },
                  ],
                };
                return new Promise<boolean>((resolve, reject) => {
                  axios
                    .post('https://api.line.me/v2/bot/message/push', message, {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                    })
                    .then((response: any) => {
                      console.log('圖片消息已成功發送:', response.data);
                      callback(response);
                      resolve(response.data);
                    })
                    .catch((error: any) => {
                      console.error('發送圖片消息時發生錯誤:', error.response ? error.response.data : error.message);
                    });
                });
              });
            });
          })
          .catch((err: any) => {
            console.error('處理圖片時發生錯誤:', err);
          });
      } else {
        let postData = {
          to: obj.lineID,
          messages: [
            {
              type: 'text',
              text: obj.data.text,
            },
          ],
        };

        const urlConfig: Config = {
          method: 'post',
          url: 'https://api.line.me/v2/bot/message/push',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify(postData),
        };

        return new Promise<boolean>((resolve, reject) => {
          axios
            .request(urlConfig)
            .then((response: any) => {
              callback(response);
              resolve(response.data);
            })
            .catch((error: any) => {
              console.log(error);
              console.log('error -- ', error.data);
              resolve(false);
            });
        });
      }
    } catch (e: any) {
      throw exception.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
    }
  }

  async deleteSNS(obj: { id: string }, callback: (data: any) => void) {
    try {
      const urlConfig: Config = {
        method: 'post',
        url:
          config.SNS_URL + `/api/mtk/SmCancel?username=${config.SNSAccount}&password=${config.SNSPWD}&msgid=${obj.id}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: [],
      };

      return new Promise<boolean>((resolve, reject) => {
        axios
          .request(urlConfig)
          .then((response: any) => {
            callback(response.data);
            resolve(response.data);
          })
          .catch((error: any) => {
            console.log('error -- ', error);
            resolve(false);
          });
      });
      //
      // var settings = {
      //     "url": "https://smsapi.mitake.com.tw/api/mtk/SmSend",
      //     "method": "POST",
      //     "timeout": 0,
      //     "headers": {
      //         "Content-Type": "application/x-www-form-urlencoded"
      //     },
      //     "data": {
      //         "username": `${config.SNSAccount}`,
      //         "password": `${config.SNSPWD}`,
      //         "dstaddr": `${phone}`,
      //         "smbody": `${data}`
      //     }
      // };
      //
      // $.ajax(settings).done(function (response:any) {
      //     console.log(response);
      // });
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e, null);
    }
  }

  public parseResponse(response: any) {
    const regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
    const match = response.match(regex);
  }

  async getLine(query: {
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
        case 'phone':
          whereList.push(
            `(JSON_SEARCH(content->'$.phone', 'one', '%${query.search ?? ''}%', NULL, '$[*]') IS NOT NULL)`
          );
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

      const whereSQL = `(tag = 'sendLine' OR tag = 'sendLineBySchedule') AND ${whereList.join(' AND ')}`;

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

      let n = 0;
      await new Promise<void>(resolve => {
        for (const email of emails) {
          AutoSendEmail.getDefCompare(this.app, email.content.type, 'zh-TW').then(dd => {
            email.content.typeName = dd && dd.tag_name ? dd.tag_name : '手動發送';
            n++;
          });
        }
        const si = setInterval(() => {
          if (n === emails.length) {
            resolve();
            clearInterval(si);
          }
        }, 300);
      });

      return { data: emails, total: total[0].c };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
    }
  }

  async postLine(data: any): Promise<{ result: boolean; message: string }> {
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
              tag: 'sendLineBySchedule',
              content: JSON.stringify(data),
              trigger_time: formatDateTime(data.sendTime),
              status: 0,
            },
          ]
        );

        // this.chunkSendLine(data.userList , data.content , insertData.insertId , formatDateTime(data.sendTime));
      } else {
        const insertData = await db.query(
          `INSERT INTO \`${this.app}\`.\`t_triggers\`
                                                   SET ?;`,
          [
            {
              tag: 'sendLine',
              content: JSON.stringify(data),
              trigger_time: formatDateTime(),
              status: 0,
            },
          ]
        );
        this.chunkSendLine(
          data.userList,
          {
            text: data.content,
          },
          insertData.insertId
        );
      }
      return { result: true, message: '寄送成功' };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
    }
  }

  async deleteSns(data: any): Promise<{ result: boolean; message: string }> {
    try {
      const emails = await db.query(
        `SELECT *
                 FROM \`${this.app}\`.t_triggers
                 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`,
        []
      );
      await new Promise(resolve => {
        this.deleteSNS({ id: data.id }, res => {
          resolve(true);
        });
      });

      await db.query(
        `UPDATE \`${this.app}\`.t_triggers
                            SET status = 2
                            WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`,
        []
      );
      return { result: true, message: '取消預約成功' };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
    }
  }

  async listenMessage(data: any): Promise<{ result: boolean; message: string }> {
    try {
      const events = data.events;
      //todo 在env上有個line_destination 記得這邊有修改這個log出來的id 隨便發話給機器人就會收到了
      // console.log("data.destination -- " , data.destination);
      if (data.destination == process.env.line_destination) {
        console.log('處理shopnex官方機器人事件');
        for (const event of events) {
          switch (event.type) {
            case 'message':
              let data = await this.getUserProfile('U152cb05f49499386f506867cb6adff96');
              break;

            case 'postback':
              console.log('收到 Postback 事件');
              await ShopnexLineMessage.handlePostbackEvent(event, this.app);
              // let data = await this.getUserProfile("U152cb05f49499386f506867cb6adff96")
              break;

            case 'join':
              console.log('機器人被加入群組/聊天室');
              await ShopnexLineMessage.handleJoinEvent(event, this.app);
              break;

            case 'leave':
              console.log('機器人被移出群組/聊天室');
              break;

            default:
              console.log('未知事件類型:', event.type);
              break;
          }
        }
        return { result: true, message: 'accept message' };
      }

      let message: {
        type: string;
        id: string;
        quoteToken: string;
        text: string;
      } = data.events[0].message;
      let userID = 'line_' + data.events[0].source.userId;
      let chatData: any = {
        chat_id: [userID, 'manager'].sort().join(''),
        type: 'user',
        info: {},
        user_id: userID,
        participant: [userID, 'manager'],
      };
      const post = new User(this.app, this.token);

      let tokenData = await post.getConfig({
        key: 'login_line_setting',
        user_id: 'manager',
      });
      let token = `${tokenData[0].value.message_token}`;

      for (const event of events) {
        if (event.source.type == 'group') {
          await this.getGroupInf(data.events[0].source.groupId);
          //圖文輪播按鍵事件處理，這裡預設是點擊我要購買 或是有人喊商品+1
          if (data.events[0]?.postback?.data) {
            console.log('data.events[0] -- ', JSON.stringify(data.events[0]));
            const replyToken = data.events[0].replyToken;
            await this.createOrderWithLineFlexMessage(data.events[0], '您已經購買了商品');
            return { result: true, message: 'accept message' };
          }

          //
          if (message.text == 'product + 1') {
          }
          if (message.text == 'test') {
            const replyToken = data.events[0].replyToken;
            const multiPageMessage = {
              type: 'flex',
              altText: '這是多頁圖文訊息',
              contents: {
                type: 'carousel',
                contents: [
                  {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.18.59-AnelegantElizabethsolidwoodwardrobewithaclassic,timelessdesign.Thewardrobefeatureshigh-qualitywoodconstructionwithapolishedfinis.webp',
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover',
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '伊麗莎白 實木衣櫃',
                          weight: 'bold',
                          size: 'xl',
                        },
                        {
                          type: 'text',
                          text: '伊麗莎白 實木衣櫃完美結合了實用與美觀，適合多種室內風格，提供黑色、白色及胡桃木色供您選擇。',
                          size: 'sm',
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: 'NT 3500',
                          size: 'sm',
                          color: '#111111',
                          align: 'end',
                        },
                      ],
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'button',
                          style: 'primary',
                          action: {
                            type: 'postback',
                            label: '我要購買商品一',
                            data: JSON.stringify({
                              id: 709,
                              spec: ['深棕', '100cm'],
                              title: '伊麗莎白 實木衣櫃',
                            }), // 自定義的 Postback 資料
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover',
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '溫德米爾 茶几"',
                          weight: 'bold',
                          size: 'xl',
                        },
                        {
                          type: 'text',
                          text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                          size: 'sm',
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: 'NT 5200',
                          size: 'sm',
                          color: '#111111',
                          align: 'end',
                        },
                      ],
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'button',
                          style: 'primary',
                          action: {
                            type: 'postback',
                            label: '我要購買商品二',
                            data: JSON.stringify({
                              id: 710,
                              sku: '',
                              count: 1,
                              spec: ['黑色', '小號'],
                              title: '溫德米爾 茶几',
                              sale_price: 5200,
                            }), // 自定義的 Postback 資料
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover',
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '溫德米爾 茶几2"',
                          weight: 'bold',
                          size: 'xl',
                        },
                        {
                          type: 'text',
                          text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                          size: 'sm',
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: 'NT 5200',
                          size: 'sm',
                          color: '#111111',
                          align: 'end',
                        },
                      ],
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'button',
                          style: 'primary',
                          action: {
                            type: 'postback',
                            label: '我要購買商品二',
                            data: JSON.stringify({
                              id: 710,
                              sku: '',
                              count: 1,
                              spec: ['黑色', '小號'],
                              title: '溫德米爾 茶几',
                              sale_price: 5200,
                            }), // 自定義的 Postback 資料
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'bubble',
                    hero: {
                      type: 'image',
                      url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                      size: 'full',
                      aspectRatio: '20:13',
                      aspectMode: 'cover',
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: '溫德米爾 茶几"',
                          weight: 'bold',
                          size: 'xl',
                        },
                        {
                          type: 'text',
                          text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                          size: 'sm',
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: 'NT 5200',
                          size: 'sm',
                          color: '#111111',
                          align: 'end',
                        },
                      ],
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'button',
                          style: 'primary',
                          action: {
                            type: 'postback',
                            label: '我要購買商品二',
                            data: JSON.stringify({
                              id: 710,
                              sku: '',
                              count: 1,
                              spec: ['黑色', '小號'],
                              title: '溫德米爾 茶几',
                              sale_price: 5200,
                            }), // 自定義的 Postback 資料
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            };
            try {
              await axios.post(
                'https://api.line.me/v2/bot/message/reply',
                {
                  replyToken: replyToken,
                  messages: [multiPageMessage],
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (e: any) {
              console.log('e -- ', e.response.data);
            }
          }

          return { result: true, message: 'accept message' };
        } else if (event.source.type == 'user') {
          //取得用戶資訊
          await this.getLineInf({ lineID: data.events[0].source.userId }, (data: any) => {
            chatData.info = {
              line: {
                name: data.displayName,
                head: data.pictureUrl,
              },
            };
            chatData.info = JSON.stringify(chatData.info);
          });

          let result = await new Chat(this.app).addChatRoom(chatData);
          //若是聊天是未建立 則建立
          if (!result.create) {
            await db.query(
              `
                        UPDATE \`${this.app}\`.\`t_chat_list\`
                        SET ?
                        WHERE ?
                    `,
              [
                {
                  info: chatData.info,
                },
                {
                  chat_id: chatData.chat_id,
                },
              ]
            );
          }
          //根據訊息的型態 做不同處理
          if (message.type == 'image') {
            const post = new User(this.app, this.token);
            let tokenData = await post.getConfig({
              key: 'login_line_setting',
              user_id: 'manager',
            });
            let token = `${tokenData[0].value.message_token}`;
            let imageUrl = await this.getImageContent(message.id, token);
            chatData.message = {
              image: imageUrl,
            };
          } else {
            chatData.message = {
              text: message.text,
            };
          }
          await new Chat(this.app).addMessage(chatData);
        }
        switch (event.type) {
          case 'message':
            console.log('收到訊息事件');
            console.log('event -- ', event);
            break;

          case 'postback':
            console.log('收到 Postback 事件');
            break;

          case 'follow':
            console.log('用戶開始追蹤機器人');
            break;

          case 'unfollow':
            console.log('用戶取消追蹤機器人');
            break;

          case 'join':
            console.log('機器人被加入群組/聊天室');
            break;

          case 'leave':
            console.log('機器人被移出群組/聊天室');
            break;

          case 'memberJoined':
            console.log('新成員加入群組/聊天室');
            break;

          case 'memberLeft':
            console.log('成員離開群組/聊天室');
            break;

          case 'reaction':
            console.log('收到 Reaction 事件');
            break;

          case 'videoPlayComplete':
            console.log('影片播放完畢');
            break;

          case 'unsend':
            console.log('用戶撤回訊息');
            break;

          case 'things':
            console.log('收到 LINE Things 物聯網事件');
            break;

          default:
            console.log('未知事件類型:', event.type);
            break;
        }

        // if (event.type === "join") {
        //     const groupId = event.source.groupId;
        //     const inviterUserId = event.source.userId || "Unknown";
        //
        //     console.log(`機器人加入群組 ${groupId}, 邀請者: ${inviterUserId}`);
        //
        //     // 查詢使用者詳細資訊
        //     if (event.source.userId) {
        //         const userProfile = await this.getUserProfile(event.source.userId , token);
        //         console.log("邀請者資訊:", userProfile);
        //     }
        // }
      }

      return { result: true, message: 'accept message' };
    } catch (e) {
      throw exception.BadRequestError('BAD_REQUEST', 'Error:' + e, null);
    }
  }
  async createOrderWithLineFlexMessage(messageData: any, message: string) {
    console.log('message -- ', messageData);
    function areSpecsEqual(spec1: string[], spec2: string[]): boolean {
      if (spec1.length !== spec2.length) {
        return false;
      }
      // 比較排序後的內容
      const sortedSpec1 = [...spec1].sort();
      const sortedSpec2 = [...spec2].sort();
      return sortedSpec1.every((value, index) => value === sortedSpec2[index]);
    }

    const replyToken = messageData.replyToken;
    const post = new User(this.app, this.token);
    const groupId = messageData.source.groupId;
    const userId = messageData.source.userId || '未知使用者';
    const dataKey = groupId + '-' + userId;
    const cart = await redis.getValue(dataKey);
    const newData = JSON.parse(messageData.postback.data);
    let productData = [];

    let lineItems: {
      id: number;
      spec: string[];
      count: number;
      sale_price: number;
      sku: string;
    }[];
    let tokenData = await post.getConfig({
      key: 'login_line_setting',
      user_id: 'manager',
    });

    if (cart) {
      if (typeof cart === 'string') {
        productData = JSON.parse(cart);
      }
    }
    productData.forEach((data: any) => {
      console.log(data.id, newData.id);
      console.log(data.spec, newData.spec);
      if (data.id == newData.id && areSpecsEqual(data.spec, newData.spec)) {
        data.count = data.count ?? 1;
        data.count++;
      }
    });
    productData.push(JSON.parse(messageData.postback.data));

    await redis.setValue(dataKey, JSON.stringify(productData));
    let token = `${tokenData[0].value.message_token}`;
    // await this.sendMessage(token , userId , message);
    // await axios.post('https://api.line.me/v2/bot/message/reply', {
    //     replyToken: replyToken,
    //     messages: [
    //         {
    //             type: 'text',
    //             text: message,  // 回應訊息
    //         },
    //     ]
    // }, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //     }
    // });
  }

  public async sendCustomerLine(tag: string, order_id: string, lineID: string) {
    const customerMail = await AutoSendEmail.getDefCompare(this.app, tag, 'zh-TW');
    if (customerMail.toggle) {
      await new Promise(async resolve => {
        resolve(
          await this.sendLine(
            {
              data: {
                text: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id),
              },
              lineID: lineID,
            },
            res => {}
          )
        );
      });
    }
  }
  async sendMessage(token: string, userId: string, message: string) {
    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const body = {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
    try {
      const response = await axios.post(url, body, { headers });
      console.log('訊息發送成功:', response.data);
    } catch (error: any) {
      console.error('發送訊息時出錯:', error.response?.data || error.message);
    }
  }
  async getImageContent(messageId: string, accessToken: string): Promise<string> {
    try {
      const response = await axios.get(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'arraybuffer', // 指定回應的資料格式為二進位 (Buffer)
      });
      return await this.uploadFile(`line/${messageId}/${new Date().getTime()}.png`, response.data); // 回傳圖片的 Buffer
    } catch (error) {
      console.error('Failed to get image content:', error);
      throw error;
    }
  }
  async uploadFile(file_name: string, fileData: Buffer) {
    const TAG = `[AWS-S3][Upload]`;
    const logger = new Logger();
    const s3bucketName = config.AWS_S3_NAME;
    const s3path = file_name;
    const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
    const params = {
      Bucket: s3bucketName,
      Key: s3path,
      Expires: 300,
      //If you use other contentType will response 403 error
      ContentType: (() => {
        if (config.SINGLE_TYPE) {
          return `application/x-www-form-urlencoded; charset=UTF-8`;
        } else {
          return mime.getType(<string>fullUrl.split('.').pop());
        }
      })(),
    };
    return new Promise<string>((resolve, reject) => {
      s3bucket.getSignedUrl('putObject', params, async (err: any, url: any) => {
        if (err) {
          logger.error(TAG, String(err));
          // use console.log here because logger.info cannot log err.stack correctly
          console.log(err, err.stack);
          reject(false);
        } else {
          axios({
            method: 'PUT',
            url: url,
            data: fileData,
            headers: {
              'Content-Type': params.ContentType,
            },
          })
            .then(() => {
              console.log(fullUrl);
              resolve(fullUrl);
            })
            .catch(() => {
              console.log(`convertError:${fullUrl}`);
            });
        }
      });
    });
  }
  async getGroupInf(groupId: string) {
    const post = new User(this.app, this.token);
    let tokenData = await post.getConfig({
      key: 'login_line_setting',
      user_id: 'manager',
    });
    let token = `${tokenData[0].value.message_token}`;
    const url = `https://api.line.me/v2/bot/group/${groupId}/summary`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(url, { headers });
      console.log('取得群組資訊:', response.data);
    } catch (error: any) {
      console.error('取得群組資訊錯誤:', error.response?.data || error.message);
    }
  }
  async handleJoinEvent(event: any, token?: string) {
    const replyToken = event.replyToken;
    const groupId = event.source.groupId;

    console.log(`機器人加入群組: ${groupId}`);

    // 透過 Reply API 送出歡迎訊息
    await axios.post(
      'https://api.line.me/v2/bot/message/reply',
      {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: '👋 大家好，我是你的 LINE 機器人！請讓管理員點擊驗證按鈕以啟用機器人功能。',
          },
          {
            type: 'template',
            altText: '請點擊驗證按鈕來完成綁定',
            template: {
              type: 'buttons',
              text: '請點擊驗證按鈕',
              actions: [
                {
                  type: 'postback',
                  label: '驗證群組',
                  data: 'action=verify',
                },
              ],
            },
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}` },
      }
    );
  }

  //判斷餘額是否足夠
  public async checkPoints(message: string, user_count: number) {
    const brandAndMemberType = await App.checkBrandAndMemberType(this.app);
    // 判斷錢包是否有餘額
    const sum =
      (
        await db.query(
          `SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_sms_points
                     WHERE status in (1, 2)
                       and userID = ?`,
          [brandAndMemberType.user_id]
        )
      )[0]['sum(money)'] || 0;
    return sum > this.getUsePoints(message, user_count);
  }

  //點數扣除
  public async usePoints(obj: { message: string; user_count: number; order_id?: string; phone: string }) {
    if (!obj.phone) {
      return 0;
    }
    let total = this.getUsePoints(obj.message, obj.user_count);
    const brandAndMemberType = await App.checkBrandAndMemberType(this.app);
    await db.query(
      `insert into \`${brandAndMemberType.brand}\`.t_sms_points
                        set ?`,
      [
        {
          orderID: obj.order_id || Tool.randomNumber(8),
          money: total * -1,
          userID: brandAndMemberType.user_id,
          status: 1,
          note: JSON.stringify({
            message: obj.message,
            phone: obj.phone,
          }),
        },
      ]
    );
    return total * -1;
  }

  public getUsePoints(text: string, user_count: number) {
    let pointCount = 0;
    const maxSize = 160;
    const longSMS = 153;
    let totalSize = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[\u4e00-\u9fa5\uFF00-\uFFEF]/.test(char)) {
        totalSize += 2;
      } else {
        totalSize += 1;
      }
    }
    if (totalSize < maxSize) {
      pointCount = 1;
    } else {
      pointCount = Math.ceil(totalSize / longSMS);
    }
    return pointCount * 15 * user_count;
  }

  public async getUserProfile(userId: string, token?: string) {
    if (!token) {
      const post = new User(this.app, this.token);
      let tokenData = await post.getConfig({
        key: 'login_line_setting',
        user_id: 'manager',
      });
      token = `${tokenData[0].value.message_token}`;
    }
    const url = `https://api.line.me/v2/bot/profile/${userId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data; // 返回使用者資訊
    } catch (error) {
      console.error('無法獲取使用者資訊:', error);
      return null;
    }
  }
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

function chunkArray(array: any, groupSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
}

function isLater(dateTimeObj: { date: string; time: string }) {
  const currentDateTime = new Date();
  const { date, time } = dateTimeObj;
  const dateTimeString = `${date}T${time}:00`;
  const providedDateTime = new Date(dateTimeString);
  return currentDateTime > providedDateTime;
}
