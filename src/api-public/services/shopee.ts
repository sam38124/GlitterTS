import { IToken } from '../models/Auth.js';
import db from '../../modules/database.js';
import config, { saasConfig } from '../../config.js';
import axios, { AxiosRequestConfig } from 'axios';
import Logger from '../../modules/logger.js';
import s3bucket from '../../modules/AWSLib.js';
import crypto from 'crypto';
import process from 'process';
import qs from 'qs';
import { Shopping } from './shopping.js';

const mime = require('mime');
type ActiveSchedule = {
  start_ISO_Date?: string;
  end_ISO_Date?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
};

interface Variant {
  save_stock?: string;
  sale_price: number;
  compare_price: number;
  cost: number;
  spec: string[];
  profit: number;
  v_length: number;
  v_width: number;
  v_height: number;
  weight: number;
  shipment_type: 'weight' | 'none' | 'volume';
  sku: string;
  barcode: string;
  stock: number;
  stockList: {};
  preview_image: string;
  show_understocking: string;
  type: string;
}

export interface LanguageData {
  title: string;
  seo: {
    domain: string;
    title: string;
    content: string;
    keywords: string;
  };
}

interface Config extends AxiosRequestConfig {}

export class Shopee {
  public app;
  public token: IToken | undefined;

  public static get path() {
    if (process.env.shopee_beta === 'true') {
      return `https://partner.test-stable.shopeemobile.com`;
    } else {
      return `https://partner.shopeemobile.com`;
    }
  }

  public static get partner_id() {
    if (process.env.shopee_beta === 'true') {
      return process.env.shopee_test_partner_id;
    } else {
      return process.env.shopee_partner_id;
    }
  }

  public static get partner_key() {
    if (process.env.shopee_beta === 'true') {
      return process.env.shopee_test_partner_key;
    } else {
      return process.env.shopee_partner_key;
    }
  }

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  public generateUrl(partner_id: string, api_path: string, timestamp: number) {
    const sign = this.cryptoSign(partner_id, api_path, timestamp);

    return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;
  }

  public generateShopUrl(
    partner_id: string,
    api_path: string,
    timestamp: number,
    access_token: string,
    shop_id: number
  ) {
    const sign = this.cryptoSign(partner_id, api_path, timestamp, access_token, shop_id);

    return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;
    // ?partner_id=1249034&sign=528d448cde17720098c8886aafc973c093af54a489ff4ef80198b39de958d484&timestamp=1736322488
  }

  private cryptoSign(partner_id: string, api_path: string, timestamp: number, access_token?: string, shop_id?: number) {
    const baseString = `${partner_id}${api_path}${timestamp}${access_token ?? ''}${shop_id ?? ''}`;
    const partner_key = Shopee.partner_key;

    return crypto
      .createHmac('sha256', partner_key ?? '')
      .update(baseString)
      .digest('hex');
  }

  public generateAuth(redirectUrl: string) {
    const partner_id = Shopee.partner_id;
    const api_path = '/api/v2/shop/auth_partner';
    const timestamp = Math.floor(Date.now() / 1000);

    const baseString = `${partner_id}${api_path}${timestamp}`;
    const signature = this.cryptoSign(partner_id ?? '', api_path, timestamp);
    return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&redirect=${redirectUrl}&sign=${signature}`;
  }

  public async getToken(code: string, shop_id: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const partner_id = Shopee.partner_id ?? '';
    const api_path = '/api/v2/auth/token/get';
    const config = {
      method: 'post',
      url: this.generateUrl(partner_id, api_path, timestamp),
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        code: code,
        partner_id: parseInt(partner_id, 10),
        shop_id: parseInt(shop_id),
      }),
    };

    try {
      const response = await axios(config);

      interface ShopeeAuthToken {
        error: string;
        message: string;
        shop_id: string;
        request_id: string;
        access_token: string; // Shopee 提供的 Access Token
        refresh_token: string; // Shopee 提供的 Refresh Token
        expire_in: number; // 剩餘有效秒數 (Shopee 回傳的 `expire_in`)
        expires_at: string; // Token 到期時間 (ISO 8601 格式)
        created_at: string; // 存入時間 (ISO 8601 格式)
      }

      const data = await db.execute(
        `select *
         from \`${saasConfig.SAAS_NAME}\`.private_config
         where \`app_name\` = '${this.app}'
           and \`key\` = 'shopee_access_token'
        `,
        []
      );
      let passData = {
        ...response.data,
        expires_at: new Date(Date.now() + 14373 * 1000).toISOString(), // 計算到期時間
        created_at: new Date().toISOString(),
        shop_id: shop_id,
      };
      if (data.length == 0) {
        await db.execute(
          `
            INSERT INTO \`${saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, \`updated_at\`)
            VALUES (?, ?, ?, ?);
          `,

          [this.app, 'shopee_access_token', passData, new Date()]
        );
      } else {
        await db.execute(
          `
            UPDATE \`${saasConfig.SAAS_NAME}\`.\`private_config\`
            SET \`value\` = ?,
                updated_at=?
            where \`app_name\` = '${this.app}'
              and \`key\` = 'shopee_access_token'
          `,
          [passData, new Date()]
        );
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
  }

  public static getItemProgress: string[] = [];

  public async getItemList(start: string, end: string, index: number = 0) {
    const timestamp = Math.floor(Date.now() / 1000);
    const partner_id = Shopee.partner_id ?? '';
    const api_path = '/api/v2/product/get_item_list';
    await this.fetchShopeeAccessToken();
    const data = await db.execute(
      `select *
       from \`${saasConfig.SAAS_NAME}\`.private_config
       where \`app_name\` = '${this.app}'
         and \`key\` = 'shopee_access_token'
      `,
      []
    );

    const config = {
      method: 'get',
      url: this.generateShopUrl(
        partner_id,
        api_path,
        timestamp,
        data[0].value.access_token,
        parseInt(data[0].value.shop_id)
      ),
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        shop_id: parseInt(data[0].value.shop_id),
        access_token: data[0].value.access_token,
        offset: index || 0,
        page_size: 10,
        update_time_from: start,
        update_time_to: Math.floor(Date.now() / 1000),
        item_status: ['NORMAL', 'BANNED', 'UNLIST'],
      },
      paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'repeat' }),
    };
    try {
      const response = await axios(config);
      if (response.data.error.length > 0) {
        return {
          type: 'error',
          message: response.data.error,
        };
      }
      console.log("response -- " , response);
      if (response.data.response.total_count == 0) {
        return {
          type: 'success',
          data: response.data.response,
          message: '該時間區間查無商品',
        }
      }
      const itemList: {
        item_id: number;
        item_status: string;
        update_time: number;
      }[] = response.data.response.item;

      const productData = await Promise.all(
        itemList.map(async (item, index: number) => {
          console.log('here -- OK');
          try {
            const pd_data = await db.query(
              `SELECT count(1)
                                             FROM ${this.app}.t_manager_post
                                             WHERE (content ->>'$.type'='product')
                                               AND (content ->>'$.shopee_id' = ${item.item_id});`,
              []
            );
            if (pd_data[0]['count(1)'] > 0) {
              return null;
            } else {
              return await this.getProductDetail(item.item_id); // 返回上傳後的資料
            }
          } catch (error) {
            return null; // 返回 null 以處理失敗的情況
          }
        })
      );
      const temp: any = {};
      temp.data = productData.reverse().filter(dd => {
        return dd;
      });
      temp.collection = [];
      try {
        await new Shopping(this.app, this.token).postMulProduct(temp);
        if (response.data.response.has_next_page) {
          await this.getItemList(start, end, response.data.response.next_offset);
        }
        return {
          data: temp.data,
          message: '匯入OK',
        };
      } catch (error: any) {
        console.error(error);
        //失敗繼續跑匯入
        // if (response.data.response.has_next_page) {
        //     await this.getItemList(start, end, response.data.response.next_offset)
        // }
        return {
          type: 'error',
          data: temp.data,
          message: '產品匯入資料庫失敗',
        };
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Try get_item_list error');
        console.error('Error Response:', error.response.data);

        return {
          type: 'error',
          error: error.response.data.error,
          message: error.response.data.message,
        };
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
  }

  public async getProductDetail(
    id: number,
    option?: {
      skip_image_load: boolean;
    }
  ) {
    const that = this;
    const token = await this.fetchShopeeAccessToken();
    if (!token) {
      return false;
    }

    async function getModel(postMD: {
      template: string;
      visible: string;
      preview_image: any[];
      relative_product: any[];
      active_schedule: { endDate: undefined; startTime: string; endTime: undefined; startDate: string };
      content_array: any[];
      channel: string[];
      collection: any[];
      variants: any[];
      title: string;
      ai_description: string;
      content: string;
      specs: any[];
      language_data: {
        'en-US': {
          content_array: any[];
          title: string;
          seo: { keywords: string; domain: string; title: string; content: string };
          content: string;
        };
        'zh-TW': { title: any; seo: any };
        'zh-CN': {
          content_array: any[];
          title: string;
          seo: { keywords: string; domain: string; title: string; content: string };
          content: string;
        };
      };
      hideIndex: string;
      seo: { keywords: string; domain: string; title: string; content: string };
      productType: { product: boolean; addProduct: boolean; giveaway: boolean };
      content_json: any[];
      status: string;
    }) {
      const timestamp = Math.floor(Date.now() / 1000);
      const partner_id = Shopee.partner_id ?? '';
      const api_path = '/api/v2/product/get_model_list';
      const config = {
        method: 'get',
        url: that.generateShopUrl(partner_id, api_path, timestamp, token.access_token, parseInt(token.shop_id)),
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          shop_id: parseInt(token.shop_id),
          access_token: token.access_token,
          item_id: id,
        },
      };
      try {
        const response = await axios(config);
        let tempVariants: Variant[] = [];
        const tier_variation = response.data.response.tier_variation;
        const model = response.data.response.model;
        const specs: {
          title: string;
          option: {
            title: string;
            expand: false;
            language_title: {};
          }[];
          language_title: {};
        }[] = tier_variation.map((dd: any) => {
          let temp: {
            title: string;
            option: {
              title: string;
              expand: false;
              language_title: {};
            }[];
            language_title: {};
          } = {
            title: dd.name,
            option: [],
            language_title: {},
          };
          dd.option_list.map((option: any) => {
            temp.option.push({
              title: option.option,
              expand: false,
              language_title: {},
            });
          });
          return temp;
        });
        postMD.specs = specs;
        model.map(async (data: any) => {
          let newVariants: Variant = {
            sale_price: data.price_info[0].current_price,
            compare_price: data.price_info[0].original_price,
            cost: 0,
            spec: data.model_name.split(','),
            profit: 0,
            v_length: 0,
            v_width: 0,
            v_height: 0,
            weight: 0,
            shipment_type: 'none',
            sku: data.model_sku,
            barcode: '',
            stock: data.stock_info_v2.summary_info.total_available_stock,
            stockList: {},
            preview_image: '',
            show_understocking: 'true',
            type: 'product',
          };
          if (!(option && option.skip_image_load) && data?.image?.image_url_list.length > 0) {
            try {
              const imageUrl = data.image.image_url_list[0]; // 取得第一個圖片的 URL
              if (imageUrl) {
                const buffer = await that.downloadImage(imageUrl);
                const fileExtension = 'jpg';
                const fileName = `shopee/${postMD.title}/${new Date().getTime()}_0.${fileExtension}`;

                newVariants.preview_image = await that.uploadFile(fileName, buffer); // 只賦值第一個圖片的上傳結果
              } else {
                console.warn('圖片 URL 列表為空，無法處理');
                newVariants.preview_image = '';
              }
            } catch (error) {
              console.error('下載或上傳失敗:', error);
              newVariants.preview_image = ''; // 若發生錯誤，設為 null
            }
          }
          (newVariants as any).shopee_model_id = data.model_id;
          tempVariants.push(newVariants);
        });

        postMD.variants = tempVariants;
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error Response:', error.response.data);
        } else {
          console.error('Unexpected Error:', error.message);
        }
      }
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const partner_id = Shopee.partner_id ?? '';
    const api_path = '/api/v2/product/get_item_base_info';
    const config = {
      method: 'get',
      url: this.generateShopUrl(partner_id, api_path, timestamp, token.access_token, parseInt(token.shop_id)),
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        shop_id: parseInt(token.shop_id),
        access_token: token.access_token,
        item_id_list: id,
      },
    };
    try {
      const response = await axios(config);
      const item = response.data.response.item_list[0];

      //取得是否原本有資料
      let origData: any = {};
      try {
        origData = await db.query(
          `SELECT *
                                   FROM \`${this.app}\`.t_manager_post
                                   WHERE (content ->>'$.type'='product')
                                     AND (content ->>'$.shopee_id' = ?);`,
          [id]
        );
      } catch (e: any) {}
      let postMD: {
        template: string;
        visible: string;
        preview_image: any[];
        relative_product: any[];
        active_schedule: { endDate: undefined; startTime: string; endTime: undefined; startDate: string };
        content_array: any[];
        channel: string[];
        collection: any[];
        variants: any[];
        title: string;
        ai_description: string;
        content: string;
        specs: any[];
        language_data: {
          'en-US': {
            content_array: any[];
            title: string;
            seo: { keywords: string; domain: string; title: string; content: string };
            content: string;
          };
          'zh-TW': { title: any; seo: any };
          'zh-CN': {
            content_array: any[];
            title: string;
            seo: { keywords: string; domain: string; title: string; content: string };
            content: string;
          };
        };
        hideIndex: string;
        seo: { keywords: string; domain: string; title: string; content: string };
        productType: { product: boolean; addProduct: boolean; giveaway: boolean };
        content_json: any[];
        status: string;
      };

      postMD = this.getInitial({});
      if (origData.length > 0) {
        postMD = {
          ...postMD,
          ...origData[0],
        };
      }

      postMD.title = item.item_name;
      // 兩邊商品介紹結構不同
      if (item.description_info && item.description_info.extended_description.field_list.length > 0) {
        let temp = ``;
        const promises = item.description_info.extended_description.field_list.map(async (item1: any) => {
          if (item1.field_type == 'image' && !(option && option.skip_image_load)) {
            try {
              const buffer = await this.downloadImage(item1.image_info.image_url);
              const fileExtension = 'jpg';
              const fileName = `shopee/${postMD.title}/${new Date().getTime()}_${item1.image_info.image_id}.${fileExtension}`;
              item1.image_info.s3 = await this.uploadFile(fileName, buffer);
            } catch (error) {
              console.error('下載或上傳失敗:', error);
              // 你可以根据需求选择是否返回 null 或其他处理方式
            }
          }
        });
        const html = String.raw;
        await Promise.all(promises);
        if (item.description_info && item.description_info.extended_description) {
          item.description_info.extended_description.field_list.map((item: any) => {
            if (item.field_type == 'image' && !(option && option.skip_image_load)) {
              temp += html` <div style="white-space: pre-wrap;">
                <img src="${item.image_info.s3}" alt="${item.image_info.image_id}" />
              </div>`;
            } else if (item.field_type == 'text') {
              temp += html` <div style="white-space: pre-wrap;">${item.text}</div>`;
            }
          });
        }

        postMD.content = temp;
      }

      if (item.price_info) {
        //單規格
        let newVariants: Variant = {
          sale_price: item.price_info[0].current_price,
          compare_price: item.price_info[0].original_price,
          cost: 0,
          spec: [],
          profit: 0,
          v_length: item.dimension.package_length,
          v_width: item.dimension.package_width,
          v_height: item.dimension.package_height,
          weight: item.weight,
          shipment_type: 'none',
          sku: '',
          barcode: '',
          stock: item.stock_info_v2.summary_info.total_available_stock,
          stockList: {},
          preview_image: '',
          show_understocking: 'true',
          type: 'product',
        };
        postMD.variants = [];
        postMD.variants.push(newVariants);
      } else {
        //多規格
        await getModel(postMD);
      }
      if (item.image.image_url_list.length > 0 && !(option && option.skip_image_load)) {
        postMD.preview_image = await Promise.all(
          item.image.image_url_list.map(async (imageUrl: string, index: number) => {
            try {
              const buffer = await this.downloadImage(imageUrl);
              const fileExtension = 'jpg';
              const fileName = `shopee/${postMD.title}/${new Date().getTime()}_${index}.${fileExtension}`;

              const uploadedData = await this.uploadFile(fileName, buffer);
              return uploadedData; // 返回上傳後的資料
            } catch (error) {
              console.error('下載或上傳失敗:', error);
              return null; // 返回 null 以處理失敗的情況
            }
          })
        );
      }

      //把蝦皮的商品id寫回
      (postMD as any).shopee_id = id;
      return postMD;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
  }

  public async asyncStockToShopee(obj: {
    product: any;
    access_token?: string;
    shop_id?: string;
    callback: (response?: any) => void;
  }) {
    console.log(`asyncStockToShopee===>`);
    if (!obj.access_token || !obj.shop_id) {
      const access = await new Shopee(this.app, this.token).fetchShopeeAccessToken();
      obj.access_token = access.access_token;
      obj.shop_id = access.shop_id;
    }
    if (!obj.product.content.shopee_id) {
      //沒有shopee_id的話直接回去
      obj.callback();
      return;
    }
    let basicData: {
      item_id: string;
      stock_list: any[];
    } = {
      item_id: obj.product.content.shopee_id,
      stock_list: [],
    };
    const partner_id = Shopee.partner_id ?? '';
    const api_path = '/api/v2/product/get_model_list';
    const timestamp = Math.floor(Date.now() / 1000);

    const config = {
      method: 'get',
      url: this.generateShopUrl(partner_id, api_path, timestamp, obj.access_token!!, parseInt(obj.shop_id!!)),
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        shop_id: parseInt(obj.shop_id!!),
        access_token: obj.access_token,
        item_id: obj.product.content.shopee_id,
      },
    };
    try {
      const response = await axios(config);
      if (!response.data?.response?.model) {
        obj.callback(response.data);
      }
      //找到兩個名字相同的 把儲存model_id 還有庫存
      obj.product.content.variants.map((variant: any) => {
        let basicStock = {
          model_id: 0,
          seller_stock: [
            {
              stock: 0,
            },
          ],
        };
        let findModel = response.data.response.model.find((item: any) => {
          return item.model_name == variant.spec.join(',');
        });
        console.log(`findModel===>`, findModel);
        if (findModel || response.data.response.model.length == 0) {
          basicStock.model_id = (findModel && findModel.model_id) || 0;
          //shopee 單倉儲的情形
          basicStock.seller_stock[0].stock = variant.stock;
          basicData.stock_list.push(basicStock);
        }
      });
      // 同步這個商品的庫存
      const updateConfig = {
        method: 'post',
        url: this.generateShopUrl(
          partner_id,
          '/api/v2/product/update_stock',
          timestamp,
          obj.access_token!!,
          parseInt(obj.shop_id!!)
        ),
        params: {
          shop_id: parseInt(obj.shop_id!!),
          access_token: obj.access_token,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(basicData),
      };
      try {
        const response = await axios(updateConfig);
        console.log(`update_stock`, JSON.stringify(basicData));
        console.log(`update_stock`, response.data);
        obj.callback(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error Response:', error.response.data);
        } else {
          console.error('Unexpected Error:', error.message);
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error get_model_list Response:', error.response.data);
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
  }

  public async asyncStockFromShopnex(): Promise<any> {
    let origData: any = {};
    try {
      origData = await db.query(
        `SELECT *
                                 FROM \`${this.app}\`.t_manager_post
                                 WHERE (content ->>'$.type'='product')
                                   AND (content ->>'$.shopee_id' IS NOT NULL AND content ->>'$.shopee_id' <> '')`,
        []
      );
      let temp = await this.fetchShopeeAccessToken();
      return Promise.all(
        origData.map(
          (product: any) =>
            new Promise<void>((resolve, reject) => {
              try {
                this.asyncStockToShopee({
                  product: product,
                  callback: () => {
                    resolve(); // 當 `asyncStockToShopee` 執行完畢後標記為完成
                  },
                  access_token: temp.access_token,
                  shop_id: temp.shop_id,
                });
              } catch (e: any) {
                reject(e); // 捕獲錯誤並拒絕該 Promise
              }
            })
        )
      )
        .then(() => {
          console.log('所有產品的庫存同步完成！');
          return {
            result: 'OK',
          };
        })
        .catch(error => {
          console.error('同步庫存時發生錯誤:', error);
        });
    } catch (e: any) {}
  }

  public async fetchShopeeAccessToken(): Promise<any> {
    try {
      const sqlData = await db.execute(
        `SELECT *
         FROM \`${saasConfig.SAAS_NAME}\`.private_config
         WHERE \`app_name\` = '${this.app}'
           AND \`key\` = 'shopee_access_token'`,
        []
      );

      const obj: any = {};
      obj.accessToken = sqlData;
      //如果超過4小時，代表過期了需要刷新
      if (new Date().getTime() >= new Date(sqlData[0].updated_at).getTime() + 3.9 * 3600 * 1000) {
        console.log(`確認要刷新token`);
        const partner_id = Shopee.partner_id!!;
        const api_path = '/api/v2/auth/access_token/get';
        const timestamp = Math.floor(Date.now() / 1000);
        const config = {
          method: 'post',
          url: this.generateUrl(partner_id, api_path, timestamp),
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            shop_id: parseInt(obj.accessToken[0].value.shop_id),
            refresh_token: obj.accessToken[0].value.refresh_token,
            partner_id: parseInt(partner_id),
          }),
        };
        try {
          const response = await axios(config);
          try {
            await db.execute(
              `
              UPDATE \`${saasConfig.SAAS_NAME}\`.\`private_config\`
              SET \`value\`  = ?,
                  updated_at = ?
              where \`app_name\` = '${this.app}'
                and \`key\` = 'shopee_access_token'
            `,
              [response.data, new Date()]
            );
            return response.data;
          } catch (e: any) {
            console.error('refresh private_config shopee_access_token error : ', e.data);
          }
        } catch (e: any) {
          console.error('Shopee access token API request failed:', e);
        }
      } else {
        return sqlData[0].value;
      }
    } catch (e: any) {
      console.error('Database query for Shopee access token failed:', e);
    }
  }

  public async getOrderList(start: string, end: string, index: number = 0) {
    const timestamp = Math.floor(Date.now() / 1000);
    const partner_id = Shopee.partner_id ?? '';
    const api_path = '/api/v2/order/get_order_list';
    await this.fetchShopeeAccessToken();
    console.log();
    const data = await db.execute(
      `select *
       from \`${saasConfig.SAAS_NAME}\`.private_config
       where \`app_name\` = '${this.app}'
         and \`key\` = 'shopee_access_token'
      `,
      []
    );

    const config = {
      method: 'get',
      url: this.generateShopUrl(
        partner_id,
        api_path,
        timestamp,
        data[0].value.access_token,
        parseInt(data[0].value.shop_id)
      ),
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        shop_id: parseInt(data[0].value.shop_id),
        access_token: data[0].value.access_token,
        offset: index || 0,
        page_size: 10,
        update_time_from: start,
        update_time_to: Math.floor(Date.now() / 1000),
        item_status: ['NORMAL', 'BANNED', 'UNLIST'],
      },
      paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'repeat' }),
    };
    try {
      const response = await axios(config);
      if (response.data.error.length > 0) {
        return {
          type: 'error',
          message: response.data.error,
        };
      }
      console.log("order response -- " , response.data);
      if (response.data.response.total_count == 0) {
        return {
          type: 'success',
          data: response.data.response,
          message: '該時間區間查無商品',
        }
      }

      return
      const itemList: {
        item_id: number;
        item_status: string;
        update_time: number;
      }[] = response.data.response.item;

      const productData = await Promise.all(
        itemList.map(async (item, index: number) => {
          console.log('here -- OK');
          try {
            const pd_data = await db.query(
              `SELECT count(1)
                                             FROM ${this.app}.t_manager_post
                                             WHERE (content ->>'$.type'='product')
                                               AND (content ->>'$.shopee_id' = ${item.item_id});`,
              []
            );
            if (pd_data[0]['count(1)'] > 0) {
              return null;
            } else {
              return await this.getProductDetail(item.item_id); // 返回上傳後的資料
            }
          } catch (error) {
            return null; // 返回 null 以處理失敗的情況
          }
        })
      );
      const temp: any = {};
      temp.data = productData.reverse().filter(dd => {
        return dd;
      });
      temp.collection = [];
      try {
        await new Shopping(this.app, this.token).postMulProduct(temp);
        if (response.data.response.has_next_page) {
          await this.getItemList(start, end, response.data.response.next_offset);
        }
        return {
          data: temp.data,
          message: '匯入OK',
        };
      } catch (error: any) {
        console.error(error);
        //失敗繼續跑匯入
        // if (response.data.response.has_next_page) {
        //     await this.getItemList(start, end, response.data.response.next_offset)
        // }
        return {
          type: 'error',
          data: temp.data,
          message: '產品匯入資料庫失敗',
        };
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Try get_item_list error');
        console.error('Error Response:', error.response.data);

        return {
          type: 'error',
          error: error.response.data.error,
          message: error.response.data.message,
        };
      } else {
        console.error('Unexpected Error:', error.message);
      }
    }
  }

  public getInitial(obj: any) {
    function getEmptyLanguageData() {
      return {
        title: '',
        seo: {
          domain: '',
          title: '',
          content: '',
          keywords: '',
        },
        content: '',
        content_array: [],
      };
    }

    return {
      type: 'product',
      title: '',
      ai_description: '',
      language_data: {
        'en-US': getEmptyLanguageData(),
        'zh-CN': getEmptyLanguageData(),
        'zh-TW': {
          title: (obj.defData && obj.defData.title) || '',
          seo: (obj.defData && obj.defData.seo) || {},
        },
      },
      productType: {
        product: true,
        addProduct: false,
        giveaway: false,
      },
      content: '',
      visible: 'true',
      status: 'active',
      collection: [],
      hideIndex: 'false',
      preview_image: [],
      specs: [],
      variants: [],
      seo: {
        title: '',
        content: '',
        keywords: '',
        domain: '',
      },
      relative_product: [],
      template: '',
      content_array: [],
      content_json: [],
      active_schedule: {
        startDate: this.getDateTime().date,
        startTime: this.getDateTime().time,
        endDate: undefined,
        endTime: undefined,
      },
      channel: ['normal', 'pos'],
    };
  }

  private getDateTime = (n = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
  };

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
              resolve(fullUrl);
            })
            .catch(() => {
              console.log(`convertError:${fullUrl}`);
            });
        }
      });
    });
  }

  async downloadImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        headers: {},
        responseType: 'arraybuffer', // 下載二進制資料
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('下載圖片時出錯:', error);
      throw error;
    }
  }
}
