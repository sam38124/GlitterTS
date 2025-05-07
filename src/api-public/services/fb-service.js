"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
exports.getFacebookPages = getFacebookPages;
exports.getFacebookPagePicture = getFacebookPagePicture;
exports.getFacebookPageLiveVideo = getFacebookPageLiveVideo;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const process_1 = __importDefault(require("process"));
const private_config_js_1 = require("../../services/private_config.js");
const mime = require('mime');
class FacebookService {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getOauth(obj) {
        const client_id = process_1.default.env.fb_auth_client_id;
        const client_secret = process_1.default.env.fb_auth_client_secret;
        const redirect_uri = 'https://08e5ebd30cf4.ngrok.app/shopnex/shopnex-fb-oauth';
        const accessUrl = `https://graph.facebook.com/v22.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${obj.code}`;
        fetch(accessUrl)
            .then(response => response.json())
            .then(async (data) => {
            const accessToken = data.access_token;
            const tokenType = data.token_type;
            const expiresIn = data.expires_in;
            const appName = this.app;
            const expiryDate = new Date(Date.now() + expiresIn * 1000);
            const passData = {
                accessToken: accessToken,
                tokenType: tokenType,
                expiresIn: expiryDate,
            };
            await new private_config_js_1.Private_config(this.token).setConfig({
                appName: appName,
                key: 'fb_auth_token',
                value: passData,
            });
            return true;
        })
            .catch(error => {
            console.error('Error fetching access token:', error);
            return false;
        });
    }
    async getAuthPage() {
        const tokenData = (await private_config_js_1.Private_config.getConfig({
            appName: this.app,
            key: 'fb_auth_token',
        }))[0].value;
        const pages = await getFacebookPages(tokenData.accessToken);
        const picturePromises = pages.map(async (page) => {
            const picture = await getFacebookPagePicture(page.id);
            const live_video = await getFacebookPageLiveVideo(page.id, page.access_token);
            return Object.assign(Object.assign({}, page), { picture, live_video });
        });
        const pagesWithPictures = await Promise.all(picturePromises);
        return pagesWithPictures.map((page) => {
            return {
                name: page.name,
                id: page.id,
                access_token: page.access_token,
                picture: page.picture,
                live_video: page.live_video,
            };
        });
    }
    async launchFacebookLive(liveData) {
        const startFacebookLive = async (pageId, accessToken) => {
            const apiUrl = `https://graph.facebook.com/v22.0/${pageId}/live_videos?status=LIVE_NOW`;
            const liveVideoParams = {
                title: "工程師測試",
                description: "工程師測試",
                status: "LIVE_NOW",
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
            }
            catch (error) {
                console.error("建立 Facebook 直播時發生錯誤：", error);
            }
        };
        const pageId = liveData.id;
        const accessToken = liveData.access_token;
        await startFacebookLive(pageId, accessToken);
    }
    async getLiveComments(scheduled_id, liveID, accessToken, after) {
        const appName = this.app;
        async function getScheduledData() {
            try {
                return await database_js_1.default.query(`
          SELECT * 
          FROM \`${appName}\`.\`t_live_purchase_interactions\`
          WHERE id = ?
        `, [scheduled_id]);
            }
            catch (error) {
                console.error("取得粉絲專頁圖片時發生錯誤：", error);
                throw error;
            }
        }
        const url = `https://graph.facebook.com/v22.0/${liveID}/comments?access_token=${accessToken}${after ? `&after=${after}` : ``}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
            }
            const pagesResponse = await response.json();
            const scheduledData = await getScheduledData();
            console.log("pagesResponse -- ", pagesResponse);
            console.log("scheduledData -- ", scheduledData);
            console.log("scheduled_id -- ", scheduled_id);
            pagesResponse.data.forEach((comment) => {
            });
            return pagesResponse;
        }
        catch (error) {
            console.error("取得直播留言時發生錯誤：", error);
            throw error;
        }
    }
}
exports.FacebookService = FacebookService;
async function getFacebookPages(accessToken) {
    const url = `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
        }
        const pagesResponse = await response.json();
        return pagesResponse.data;
    }
    catch (error) {
        console.error("取得粉絲專頁清單時發生錯誤：", error);
        throw error;
    }
}
async function getFacebookPagePicture(id) {
    const url = `https://graph.facebook.com/v22.0/${id}/picture`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
        }
        return response.url;
    }
    catch (error) {
        console.error("取得粉絲專頁圖片時發生錯誤：", error);
        throw error;
    }
}
async function getFacebookPageLiveVideo(id, accessToken) {
    const url = `https://graph.facebook.com/v22.0/${id}/live_videos?fields=id,status,broadcast_start_time,title&access_token=${accessToken}&broadcast_status=["LIVE"]`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Facebook API 回應失敗: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("取得粉絲專頁圖片時發生錯誤：", error);
        throw error;
    }
}
//# sourceMappingURL=fb-service.js.map