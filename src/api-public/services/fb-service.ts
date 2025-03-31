import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { sendmail } from '../../services/ses.js';
import { AutoSendEmail } from './auto-send-email.js';
import config from '../../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Mail } from './mail';
import { App } from '../../services/app.js';
import Tool from '../../modules/tool.js';
import { Chat } from './chat';
import { User } from './user';
import Logger from '../../modules/logger';
import s3bucket from '../../modules/AWSLib';
import process from 'process';
import { Private_config } from '../../services/private_config.js';

const mime = require('mime');

interface Config {
  method: 'post' | 'get';
  url: string;
  headers: Record<string, string>;
  data: any;
}

//定義留言的介面
interface Comment {
  "created_time": string,
  "from": {
    "name": string,
    "id": string
  },
  "message": string,
  "id": string
}

// 定義粉絲專頁數據的類型
export interface PageData {
  name: string;
  id: string;
  access_token: string;
  picture?: string;
}

// 定義回應格式的類型
export interface PagesResponse {
  data: PageData[];
}
/**
 * FacebookService
 * 用於處理與 Facebook Graph API 相關的業務邏輯，例如取得 OAuth 資訊、
 * 獲取粉絲專頁資料、啟動直播、取得直播留言等。
 */
export class FacebookService {
  //應用名稱或應用代號
  public app: string;
  //這裡的Token是指shopnex的Token
  public token: IToken;

  constructor(app: string, token: IToken) {
    this.app = app;
    this.token = token;
  }
  /**
   * 取得 Facebook OAuth 的訪問憑證
   * @param obj - 包含 OAuth 驗證碼 (code) 的物件
   * @returns 成功時回傳 true，失敗時回傳 false
   */
  // 實作中會將取得的 access_token 存入應用程式的設定中
  // 並轉換過期時間為易於理解的格式
  async getOauth(obj: { code: string }) {
    const client_id = process.env.fb_auth_client_id;
    const client_secret = process.env.fb_auth_client_secret;
    const redirect_uri = 'https://08e5ebd30cf4.ngrok.app/shopnex/shopnex-fb-oauth';

    const accessUrl = `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${obj.code}`;
    //
    fetch(accessUrl)
      .then(response => response.json())
      .then(async data => {
        // 解析響應並使用 access_token
        const accessToken = data.access_token;
        const tokenType = data.token_type;
        const expiresIn = data.expires_in;

        // 例如，將 token 存入狀態管理
        const appName = this.app;



        // 將 expires_in 轉成人類可讀的時間
        const expiryDate = new Date(Date.now() + expiresIn * 1000);
        const passData = {
          accessToken: accessToken,
          tokenType: tokenType,
          expiresIn: expiryDate,
        };

        await new Private_config(this.token).setConfig({
          appName: appName,
          key: 'fb_auth_token',
          value: passData,
        })


        return true;
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
        return false;
      });
  }
  /**
   * 取得 Facebook 粉絲專頁授權的相關資訊，包括名稱、圖片與目前的直播狀態
   * @returns 包含粉絲專頁資訊的陣列
   */
  // 實作中會從設定中取得 access_token
  // 並使用它來獲取粉絲專頁的基本資訊與圖片 以及操作這個粉絲專頁所需要的access_token
  async getAuthPage(){
    const tokenData = (await Private_config.getConfig({
      appName: this.app,
      key: 'fb_auth_token',
    }))[0].value;

    const pages = await getFacebookPages(tokenData.accessToken);
    // 建立一個包含所有圖片請求的 Promise 陣列
    const picturePromises = pages.map(async (page) => {
      const picture = await getFacebookPagePicture(page.id);
      const live_video = await getFacebookPageLiveVideo(page.id , page.access_token);

      return { ...page, picture ,live_video}; // 返回包含圖片的 page 物件
    });
    // 等待所有 Promise 完成
    const pagesWithPictures = await Promise.all(picturePromises);
    return pagesWithPictures.map((page)=>{
      return {
        name: page.name,
        id: page.id,
        access_token: page.access_token,
        picture: page.picture,
        live_video: page.live_video,
      }
    });
  }
  //暫時用不到 他是開啟直播流 但目前沒後續接直播流的功能
  async launchFacebookLive(liveData:any){
    const startFacebookLive = async (pageId: string, accessToken: string) => {
      const apiUrl = `https://graph.facebook.com/v22.0/${pageId}/live_videos?status=LIVE_NOW`;

      // 這裡的參數可以根據你的需求進行調整
      const liveVideoParams = {
        title: "工程師測試",
        description: "工程師測試",
        status: "LIVE_NOW", // 設置直播立即開始
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(liveVideoParams),
        });

        if (!response.ok) {
          throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("成功建立直播：", result);
      } catch (error) {
        console.error("建立 Facebook 直播時發生錯誤：", error);
      }
    };
    const pageId = liveData.id;
    const accessToken = liveData.access_token;
    await startFacebookLive(pageId, accessToken);
  }

  /**
   * 取得指定直播影片的留言
   * @param scheduled_id 團購那張表的id
   * @param liveID - 直播影片的 ID
   * @param accessToken - Facebook 的訪問憑證
   * @param after - （可選）用於分頁的指標
   * @returns 包含留言資料的物件
   */
  // 使用 liveID 和 accessToken 呼叫 Facebook API 獲取留言
  // 如果提供了 after，則會取得該指標之後的留言
  async getLiveComments(scheduled_id:string, liveID:string ,accessToken:string , after?:string){
    const appName = this.app;
    async function getScheduledData(){
      try {
        return await db.query(`
          SELECT * 
          FROM \`${appName}\`.\`t_live_purchase_interactions\`
          WHERE id = ?
        `,[scheduled_id])
      }catch (error:any) {
        console.error("取得粉絲專頁圖片時發生錯誤：", error);
        throw error;
      }
    }
    const url = `https://graph.facebook.com/v22.0/${liveID}/comments?access_token=${accessToken}${after?`&after=${after}`:``}`;
    try {
      // 發送請求到 Facebook Graph API
      const response = await fetch(url);

      // 檢查 HTTP 狀態碼
      if (!response.ok) {
        throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
      }

      // 解析 JSON
      const pagesResponse: PagesResponse = await response.json();
      const scheduledData = await getScheduledData();

      console.log("pagesResponse -- " , pagesResponse);
      console.log("scheduledData -- " , scheduledData);
      console.log("scheduled_id -- " , scheduled_id);
      // 回傳粉絲專頁資料
      pagesResponse.data.forEach((comment) => {

      })
      return pagesResponse;
    } catch (error) {
      // 處理錯誤並回報
      console.error("取得直播留言時發生錯誤：", error);
      throw error;
    }

  }
}
//透過accessToken 取得這個用戶的所有已授權粉絲團
export async function getFacebookPages(accessToken: string): Promise<PageData[]> {
    const url = `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`;

  try {
    // 發送請求到 Facebook Graph API
    const response = await fetch(url);

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
    }

    // 解析 JSON
    const pagesResponse: PagesResponse = await response.json();

    // 回傳粉絲專頁資料
    return pagesResponse.data;
  } catch (error) {
    // 處理錯誤並回報
    console.error("取得粉絲專頁清單時發生錯誤：", error);
    throw error;
  }
}
//取得這個對應id粉絲團的圖片
export async function getFacebookPagePicture(id: string) {
  const url = `https://graph.facebook.com/v22.0/${id}/picture`;
  try {
    // 發送請求到 Facebook Graph API
    const response = await fetch(url);
    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
    }

    // 回傳粉絲專頁資料
    return response.url;
  } catch (error) {
    // 處理錯誤並回報
    console.error("取得粉絲專頁圖片時發生錯誤：", error);
    throw error;
  }

}
//取得這個對應id粉絲團的正在直播的影片 若要其他狀態 狀態碼在內層
export async function getFacebookPageLiveVideo(id: string , accessToken: string) {
  // 取得直播中 若是需要VOD...等狀態限定 可以更改
  // 清單<列舉 {UNPUBLISHED, LIVE, LIVE_STOPPED, PROCESSING, VOD, SCHEDULED_UNPUBLISHED, SCHEDULED_LIVE, SCHEDULED_EXPIRED, SCHEDULED_CANCELED}>
  const url = `https://graph.facebook.com/v22.0/${id}/live_videos?fields=id,status,broadcast_start_time,title&access_token=${accessToken}&broadcast_status=["LIVE"]`;
  try {
    // 發送請求到 Facebook Graph API
    const response = await fetch(url);

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
    }
    const data = await response.json();
    // 回傳粉絲專頁資料
    return data;
  } catch (error) {
    // 處理錯誤並回報
    console.error("取得粉絲專頁圖片時發生錯誤：", error);
    throw error;
  }

}