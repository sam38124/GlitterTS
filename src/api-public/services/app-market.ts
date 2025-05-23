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
import exception from '../../modules/exception';

const mime = require('mime');


interface AppData {
  id: number;
  app_id:string;
  name: string;
  image: string;
  link: string;
  rate: number;
  rate_count: number;
  description: string;
  tag: string[];
  price: number;
  download_count:number;
  update_time:string;
  create_time:string;
  expiration_time:string;
}


export class MarketService {
  public app;
  public token: IToken | undefined;


  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  async getAppList(){
    try {
      const app_list:AppData[] = [
        {
          id: 1,
          name: 'ShopNex',
          image: 'https://example.com/images/shopnex.jpg',
          link: 'https://www.shopnex.com',
          rate: 3.5,
          rate_count: 557,
          description: 'An all-in-one e-commerce platform with AI-powered tools.',
          tag: ['e-commerce', 'AI', 'business'],
          price: 638,
          download_count: 3457,
          update_time: '2023-05-13T10:30:00',
          create_time: '2023-04-15T08:45:00',
          app_id: 'app_1',
          expiration_time: '2023-06-13T10:30:00'
        },
        {
          id: 2,
          name: 'QuickShop',
          image: 'https://example.com/images/quickshop.jpg',
          link: 'https://www.quickshop.com',
          rate: 3.2,
          rate_count: 7338,
          description: 'A fast and easy platform to set up online stores.',
          tag: ['shopping', 'fast', 'platform'],
          price: 951,
          download_count: 7284,
          update_time: '2023-05-12T14:22:00',
          create_time: '2023-03-10T09:12:00',
          app_id: 'app_2',
          expiration_time: '2023-06-12T14:22:00'
        },
        {
          id: 3,
          name: 'ShopMaster',
          image: 'https://example.com/images/shopmaster.jpg',
          link: 'https://www.shopmaster.com',
          rate: 4.4,
          rate_count: 1675,
          description: 'ShopMaster helps you manage all your online sales in one place.',
          tag: ['management', 'e-commerce', 'business'],
          price: 48,
          download_count: 4523,
          update_time: '2023-05-11T16:50:00',
          create_time: '2023-02-28T11:33:00',
          app_id: 'app_3',
          expiration_time: '2023-06-10T16:50:00'
        },
        {
          id: 4,
          name: 'EasyCart',
          image: 'https://example.com/images/easycart.jpg',
          link: 'https://www.easycart.com',
          rate: 4.7,
          rate_count: 2558,
          description: 'EasyCart is an intuitive shopping cart solution for businesses.',
          tag: ['shopping', 'cart', 'business'],
          price: 284,
          download_count: 5121,
          update_time: '2023-05-10T09:45:00',
          create_time: '2023-01-10T13:20:00',
          app_id: 'app_4',
          expiration_time: '2023-06-09T09:45:00'
        },
        {
          id: 5,
          name: 'MarketPro',
          image: 'https://example.com/images/marketpro.jpg',
          link: 'https://www.marketpro.com',
          rate: 3.7,
          rate_count: 5630,
          description: 'MarketPro is a comprehensive marketing automation tool for online stores.',
          tag: ['marketing', 'automation', 'e-commerce'],
          price: 1672,
          download_count: 6142,
          update_time: '2023-05-09T18:30:00',
          create_time: '2022-12-05T15:10:00',
          app_id: 'app_5',
          expiration_time: '2023-06-08T18:30:00'
        },
        {
          id: 6,
          name: 'EasyShop',
          image: 'https://example.com/images/easyshop.jpg',
          link: 'https://www.easyshop.com',
          rate: 4.0,
          rate_count: 5041,
          description: 'A simple and intuitive shopping app for all your needs.',
          tag: ['shopping', 'simple', 'easy'],
          price: 79,
          download_count: 3591,
          update_time: '2023-05-08T14:10:00',
          create_time: '2022-10-30T12:05:00',
          app_id: 'app_6',
          expiration_time: '2023-06-07T14:10:00'
        },
        {
          id: 7,
          name: 'ShopifyPlus',
          image: 'https://example.com/images/shopifyplus.jpg',
          link: 'https://www.shopifyplus.com',
          rate: 4.5,
          rate_count: 6995,
          description: 'Advanced e-commerce platform for growing businesses.',
          tag: ['e-commerce', 'enterprise', 'business'],
          price: 2948,
          download_count: 4823,
          update_time: '2023-05-07T16:00:00',
          create_time: '2022-09-25T10:30:00',
          app_id: 'app_7',
          expiration_time: '2023-06-06T16:00:00'
        },
        {
          id: 8,
          name: 'CartQuick',
          image: 'https://example.com/images/cartquick.jpg',
          link: 'https://www.cartquick.com',
          rate: 4.5,
          rate_count: 3409,
          description: 'Boost your sales with quick and easy cart management.',
          tag: ['sales', 'cart', 'boost'],
          price: 51,
          download_count: 1742,
          update_time: '2023-05-06T12:10:00',
          create_time: '2022-08-17T09:00:00',
          app_id: 'app_8',
          expiration_time: '2023-06-05T12:10:00'
        },
        {
          id: 9,
          name: 'SwiftBuy',
          image: 'https://example.com/images/swiftbuy.jpg',
          link: 'https://www.swiftbuy.com',
          rate: 3.9,
          rate_count: 2347,
          description: 'A fast, user-friendly online shopping experience.',
          tag: ['shopping', 'fast', 'user-friendly'],
          price: 190,
          download_count: 2510,
          update_time: '2023-05-05T11:30:00',
          create_time: '2022-07-22T10:25:00',
          app_id: 'app_9',
          expiration_time: '2023-06-04T11:30:00'
        },
        {
          id: 10,
          name: 'PayMaster',
          image: 'https://example.com/images/paymaster.jpg',
          link: 'https://www.paymaster.com',
          rate: 3.6,
          rate_count: 5730,
          description: 'Manage your payments and sales efficiently.',
          tag: ['payment', 'management', 'business'],
          price: 241,
          download_count: 3982,
          update_time: '2023-05-04T17:50:00',
          create_time: '2022-06-10T13:15:00',
          app_id: 'app_10',
          expiration_time: '2023-06-03T17:50:00'
        },
        {
          id: 11,
          name: 'FastTrack',
          image: 'https://example.com/images/fasttrack.jpg',
          link: 'https://www.fasttrack.com',
          rate: 3.6,
          rate_count: 3841,
          description: 'A rapid e-commerce platform for fast-growing businesses.',
          tag: ['e-commerce', 'growth', 'business'],
          price: 481,
          download_count: 3027,
          update_time: '2023-05-03T15:40:00',
          create_time: '2022-05-25T11:00:00',
          app_id: 'app_11',
          expiration_time: '2023-06-02T15:40:00'
        },
        {
          id: 12,
          name: 'GlobalMarket',
          image: 'https://example.com/images/globalmarket.jpg',
          link: 'https://www.globalmarket.com',
          rate: 4.9,
          rate_count: 840,
          description: 'Global marketplace for a wide range of products.',
          tag: ['marketplace', 'global', 'e-commerce'],
          price: 913,
          download_count: 1729,
          update_time: '2023-05-02T14:00:00',
          create_time: '2022-04-19T12:45:00',
          app_id: 'app_12',
          expiration_time: '2023-06-01T14:00:00'
        }
      ];
      return app_list;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'get Market App List Error:' + e, null);
    }
  }
  async getInstallAppList(){
    try {
      const app_list:AppData[] = [
        {
          id: 1,
          name: 'ShopNex',
          image: 'https://example.com/images/shopnex.jpg',
          link: 'https://www.shopnex.com',
          rate: 3.5,
          rate_count: 557,
          description: 'An all-in-one e-commerce platform with AI-powered tools.',
          tag: ['e-commerce', 'AI', 'business'],
          price: 638,
          download_count: 3457,
          update_time: '2023-05-13T10:30:00',
          create_time: '2023-04-15T08:45:00',
          app_id: 'app_1',
          expiration_time: '2023-06-13T10:30:00'
        },
        {
          id: 3,
          name: 'ShopMaster',
          image: 'https://example.com/images/shopmaster.jpg',
          link: 'https://www.shopmaster.com',
          rate: 4.4,
          rate_count: 1675,
          description: 'ShopMaster helps you manage all your online sales in one place.',
          tag: ['management', 'e-commerce', 'business'],
          price: 48,
          download_count: 4523,
          update_time: '2023-05-11T16:50:00',
          create_time: '2023-02-28T11:33:00',
          app_id: 'app_3',
          expiration_time: '2023-06-10T16:50:00'
        },
        {
          id: 6,
          name: 'EasyShop',
          image: 'https://example.com/images/easyshop.jpg',
          link: 'https://www.easyshop.com',
          rate: 4.0,
          rate_count: 5041,
          description: 'A simple and intuitive shopping app for all your needs.',
          tag: ['shopping', 'simple', 'easy'],
          price: 79,
          download_count: 3591,
          update_time: '2023-05-08T14:10:00',
          create_time: '2022-10-30T12:05:00',
          app_id: 'app_6',
          expiration_time: '2023-06-07T14:10:00'
        },
        {
          id: 10,
          name: 'PayMaster',
          image: 'https://example.com/images/paymaster.jpg',
          link: 'https://www.paymaster.com',
          rate: 3.6,
          rate_count: 5730,
          description: 'Manage your payments and sales efficiently.',
          tag: ['payment', 'management', 'business'],
          price: 241,
          download_count: 3982,
          update_time: '2023-05-04T17:50:00',
          create_time: '2022-06-10T13:15:00',
          app_id: 'app_10',
          expiration_time: '2023-06-03T17:50:00'
        },
        {
          id: 12,
          name: 'GlobalMarket',
          image: 'https://example.com/images/globalmarket.jpg',
          link: 'https://www.globalmarket.com',
          rate: 4.9,
          rate_count: 840,
          description: 'Global marketplace for a wide range of products.',
          tag: ['marketplace', 'global', 'e-commerce'],
          price: 913,
          download_count: 1729,
          update_time: '2023-05-02T14:00:00',
          create_time: '2022-04-19T12:45:00',
          app_id: 'app_12',
          expiration_time: '2023-06-01T14:00:00'
        }
      ];

      return app_list;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'get Market App List Error:' + e, null);
    }
  }
  async getPublishtdAppList(){
    try {
      const app_list:AppData[] = [
        {
          id: 2,
          name: 'QuickShop',
          image: 'https://example.com/images/quickshop.jpg',
          link: 'https://www.quickshop.com',
          rate: 3.2,
          rate_count: 7338,
          description: 'A fast and easy platform to set up online stores.',
          tag: ['shopping', 'fast', 'platform'],
          price: 951,
          download_count: 7284,
          update_time: '2023-05-12T14:22:00',
          create_time: '2023-03-10T09:12:00',
          app_id: 'app_2',
          expiration_time: '2023-06-12T14:22:00'
        },
        {
          id: 4,
          name: 'EasyCart',
          image: 'https://example.com/images/easycart.jpg',
          link: 'https://www.easycart.com',
          rate: 4.7,
          rate_count: 2558,
          description: 'EasyCart is an intuitive shopping cart solution for businesses.',
          tag: ['shopping', 'cart', 'business'],
          price: 284,
          download_count: 5121,
          update_time: '2023-05-10T09:45:00',
          create_time: '2023-01-10T13:20:00',
          app_id: 'app_4',
          expiration_time: '2023-06-09T09:45:00'
        },
        {
          id: 5,
          name: 'MarketPro',
          image: 'https://example.com/images/marketpro.jpg',
          link: 'https://www.marketpro.com',
          rate: 3.7,
          rate_count: 5630,
          description: 'MarketPro is a comprehensive marketing automation tool for online stores.',
          tag: ['marketing', 'automation', 'e-commerce'],
          price: 1672,
          download_count: 6142,
          update_time: '2023-05-09T18:30:00',
          create_time: '2022-12-05T15:10:00',
          app_id: 'app_5',
          expiration_time: '2023-06-08T18:30:00'
        },
        {
          id: 7,
          name: 'ShopifyPlus',
          image: 'https://example.com/images/shopifyplus.jpg',
          link: 'https://www.shopifyplus.com',
          rate: 4.5,
          rate_count: 6995,
          description: 'Advanced e-commerce platform for growing businesses.',
          tag: ['e-commerce', 'enterprise', 'business'],
          price: 2948,
          download_count: 4823,
          update_time: '2023-05-07T16:00:00',
          create_time: '2022-09-25T10:30:00',
          app_id: 'app_7',
          expiration_time: '2023-06-06T16:00:00'
        },
      ];

      return app_list;
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('BAD_REQUEST', 'get Market App List Error:' + e, null);
    }
  }
}
