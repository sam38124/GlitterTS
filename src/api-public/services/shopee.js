"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopee = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const config_js_1 = __importStar(require("../../config.js"));
const axios_1 = __importDefault(require("axios"));
const logger_js_1 = __importDefault(require("../../modules/logger.js"));
const AWSLib_js_1 = __importDefault(require("../../modules/AWSLib.js"));
const crypto_1 = __importDefault(require("crypto"));
const process_1 = __importDefault(require("process"));
const qs_1 = __importDefault(require("qs"));
const shopping_js_1 = require("./shopping.js");
const mime = require('mime');
class Shopee {
    static get path() {
        if (process_1.default.env.shopee_beta === 'true') {
            return `https://partner.test-stable.shopeemobile.com`;
        }
        else {
            return `https://partner.shopeemobile.com`;
        }
    }
    get partner_id() {
        return (process_1.default.env.shopee_beta === 'true')
            ? (this.type === 'order'
                ? process_1.default.env.shopee_order_test_partner_id
                : process_1.default.env.shopee_test_partner_id)
            : (this.type === 'order'
                ? process_1.default.env.shopee_order_partner_id
                : process_1.default.env.shopee_partner_id);
    }
    get partner_key() {
        return (process_1.default.env.shopee_beta === 'true')
            ? (this.type === 'order'
                ? process_1.default.env.shopee_order_test_partner_key
                : process_1.default.env.shopee_test_partner_key)
            : (this.type === 'order'
                ? process_1.default.env.shopee_order_partner_key
                : process_1.default.env.shopee_partner_key);
    }
    constructor(app, token, type = 'product') {
        this.getDateTime = (n = 0) => {
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
        this.app = app;
        this.token = token;
        this.type = type;
    }
    generateUrl(partner_id, api_path, timestamp) {
        const sign = this.cryptoSign(partner_id, api_path, timestamp);
        return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;
    }
    generateShopUrl(partner_id, api_path, timestamp, access_token, shop_id) {
        const sign = this.cryptoSign(partner_id, api_path, timestamp, access_token, shop_id);
        return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;
    }
    cryptoSign(partner_id, api_path, timestamp, access_token, shop_id) {
        const baseString = `${partner_id}${api_path}${timestamp}${access_token !== null && access_token !== void 0 ? access_token : ''}${shop_id !== null && shop_id !== void 0 ? shop_id : ''}`;
        const partner_key = this.partner_key;
        return crypto_1.default
            .createHmac('sha256', partner_key !== null && partner_key !== void 0 ? partner_key : '')
            .update(baseString)
            .digest('hex');
    }
    generateAuth(redirectUrl) {
        const partner_id = this.partner_id;
        const api_path = '/api/v2/shop/auth_partner';
        const timestamp = Math.floor(Date.now() / 1000);
        const baseString = `${partner_id}${api_path}${timestamp}`;
        const signature = this.cryptoSign(partner_id !== null && partner_id !== void 0 ? partner_id : '', api_path, timestamp);
        return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&redirect=${redirectUrl}&sign=${signature}`;
    }
    async getToken(code, shop_id) {
        var _a;
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = this.partner_id) !== null && _a !== void 0 ? _a : '';
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
            const response = await (0, axios_1.default)(config);
            console.log("response -- ", response);
            const data = await database_js_1.default.execute(`select *
         from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
         where \`app_name\` = '${this.app}'
           and \`key\` = 'shopee_access_token'
        `, []);
            let passData = Object.assign(Object.assign({}, response.data), { expires_at: new Date(Date.now() + 14373 * 1000).toISOString(), created_at: new Date().toISOString(), shop_id: shop_id });
            if (data.length == 0) {
                await database_js_1.default.execute(`
            INSERT INTO \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, \`updated_at\`)
            VALUES (?, ?, ?, ?);
          `, [this.app, 'shopee_access_token', passData, new Date()]);
            }
            else {
                await database_js_1.default.execute(`
            UPDATE \`${config_js_1.saasConfig.SAAS_NAME}\`.\`private_config\`
            SET \`value\` = ?,
                updated_at=?
            where \`app_name\` = '${this.app}'
              and \`key\` = 'shopee_access_token'
          `, [passData, new Date()]);
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('Error Response:', error.response.data);
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
    }
    async getItemList(start, end, index = 0) {
        var _a;
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = this.partner_id) !== null && _a !== void 0 ? _a : '';
        const api_path = '/api/v2/product/get_item_list';
        await this.fetchShopeeAccessToken();
        const data = await database_js_1.default.execute(`select *
       from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
       where \`app_name\` = '${this.app}'
         and \`key\` = 'shopee_access_token'
      `, []);
        const config = {
            method: 'get',
            url: this.generateShopUrl(partner_id, api_path, timestamp, data[0].value.access_token, parseInt(data[0].value.shop_id)),
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
            paramsSerializer: (params) => qs_1.default.stringify(params, { arrayFormat: 'repeat' }),
        };
        try {
            const response = await (0, axios_1.default)(config);
            if (response.data.error.length > 0) {
                return {
                    type: 'error',
                    message: response.data.error,
                };
            }
            console.log("response -- ", response);
            if (response.data.response.total_count == 0) {
                return {
                    type: 'success',
                    data: response.data.response,
                    message: '該時間區間查無商品',
                };
            }
            const itemList = response.data.response.item;
            const productData = await Promise.all(itemList.map(async (item, index) => {
                console.log('here -- OK');
                try {
                    const pd_data = await database_js_1.default.query(`SELECT count(1)
                                             FROM ${this.app}.t_manager_post
                                             WHERE (content ->>'$.type'='product')
                                               AND (content ->>'$.shopee_id' = ${item.item_id});`, []);
                    if (pd_data[0]['count(1)'] > 0) {
                        return null;
                    }
                    else {
                        return await this.getProductDetail(item.item_id);
                    }
                }
                catch (error) {
                    return null;
                }
            }));
            const temp = {};
            temp.data = productData.reverse().filter(dd => {
                return dd;
            });
            temp.collection = [];
            try {
                await new shopping_js_1.Shopping(this.app, this.token).postMulProduct(temp);
                if (response.data.response.has_next_page) {
                    await this.getItemList(start, end, response.data.response.next_offset);
                }
                return {
                    data: temp.data,
                    message: '匯入OK',
                };
            }
            catch (error) {
                console.error(error);
                return {
                    type: 'error',
                    data: temp.data,
                    message: '產品匯入資料庫失敗',
                };
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.log('Try get_item_list error');
                console.error('Error Response:', error.response.data);
                return {
                    type: 'error',
                    error: error.response.data.error,
                    message: error.response.data.message,
                };
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
    }
    async getProductDetail(id, option) {
        var _a;
        const that = this;
        const token = await this.fetchShopeeAccessToken();
        if (!token) {
            return false;
        }
        async function getModel(postMD) {
            var _a;
            const timestamp = Math.floor(Date.now() / 1000);
            const partner_id = (_a = that.partner_id) !== null && _a !== void 0 ? _a : '';
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
                const response = await (0, axios_1.default)(config);
                let tempVariants = [];
                const tier_variation = response.data.response.tier_variation;
                const model = response.data.response.model;
                const specs = tier_variation.map((dd) => {
                    let temp = {
                        title: dd.name,
                        option: [],
                        language_title: {},
                    };
                    dd.option_list.map((option) => {
                        temp.option.push({
                            title: option.option,
                            expand: false,
                            language_title: {},
                        });
                    });
                    return temp;
                });
                postMD.specs = specs;
                model.map(async (data) => {
                    var _a;
                    let newVariants = {
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
                    if (!(option && option.skip_image_load) && ((_a = data === null || data === void 0 ? void 0 : data.image) === null || _a === void 0 ? void 0 : _a.image_url_list.length) > 0) {
                        try {
                            const imageUrl = data.image.image_url_list[0];
                            if (imageUrl) {
                                const buffer = await that.downloadImage(imageUrl);
                                const fileExtension = 'jpg';
                                const fileName = `shopee/${postMD.title}/${new Date().getTime()}_0.${fileExtension}`;
                                newVariants.preview_image = await that.uploadFile(fileName, buffer);
                            }
                            else {
                                console.warn('圖片 URL 列表為空，無法處理');
                                newVariants.preview_image = '';
                            }
                        }
                        catch (error) {
                            console.error('下載或上傳失敗:', error);
                            newVariants.preview_image = '';
                        }
                    }
                    newVariants.shopee_model_id = data.model_id;
                    tempVariants.push(newVariants);
                });
                postMD.variants = tempVariants;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) && error.response) {
                    console.error('Error Response:', error.response.data);
                }
                else {
                    console.error('Unexpected Error:', error.message);
                }
            }
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = this.partner_id) !== null && _a !== void 0 ? _a : '';
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
            const response = await (0, axios_1.default)(config);
            const item = response.data.response.item_list[0];
            let origData = {};
            try {
                origData = await database_js_1.default.query(`SELECT *
                                   FROM \`${this.app}\`.t_manager_post
                                   WHERE (content ->>'$.type'='product')
                                     AND (content ->>'$.shopee_id' = ?);`, [id]);
            }
            catch (e) { }
            let postMD;
            postMD = this.getInitial({});
            if (origData.length > 0) {
                postMD = Object.assign(Object.assign({}, postMD), origData[0]);
            }
            postMD.title = item.item_name;
            if (item.description_info && item.description_info.extended_description.field_list.length > 0) {
                let temp = ``;
                const promises = item.description_info.extended_description.field_list.map(async (item1) => {
                    if (item1.field_type == 'image' && !(option && option.skip_image_load)) {
                        try {
                            const buffer = await this.downloadImage(item1.image_info.image_url);
                            const fileExtension = 'jpg';
                            const fileName = `shopee/${postMD.title}/${new Date().getTime()}_${item1.image_info.image_id}.${fileExtension}`;
                            item1.image_info.s3 = await this.uploadFile(fileName, buffer);
                        }
                        catch (error) {
                            console.error('下載或上傳失敗:', error);
                        }
                    }
                });
                const html = String.raw;
                await Promise.all(promises);
                if (item.description_info && item.description_info.extended_description) {
                    item.description_info.extended_description.field_list.map((item) => {
                        if (item.field_type == 'image' && !(option && option.skip_image_load)) {
                            temp += html ` <div style="white-space: pre-wrap;">
                <img src="${item.image_info.s3}" alt="${item.image_info.image_id}" />
              </div>`;
                        }
                        else if (item.field_type == 'text') {
                            temp += html ` <div style="white-space: pre-wrap;">${item.text}</div>`;
                        }
                    });
                }
                postMD.content = temp;
            }
            if (item.price_info) {
                let newVariants = {
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
            }
            else {
                await getModel(postMD);
            }
            if (item.image.image_url_list.length > 0 && !(option && option.skip_image_load)) {
                postMD.preview_image = await Promise.all(item.image.image_url_list.map(async (imageUrl, index) => {
                    try {
                        const buffer = await this.downloadImage(imageUrl);
                        const fileExtension = 'jpg';
                        const fileName = `shopee/${postMD.title}/${new Date().getTime()}_${index}.${fileExtension}`;
                        const uploadedData = await this.uploadFile(fileName, buffer);
                        return uploadedData;
                    }
                    catch (error) {
                        console.error('下載或上傳失敗:', error);
                        return null;
                    }
                }));
            }
            postMD.shopee_id = id;
            return postMD;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('Error Response:', error.response.data);
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
    }
    async asyncStockToShopee(obj) {
        var _a, _b, _c;
        function callback(response) {
            obj.callback(response);
        }
        if (!obj.access_token || !obj.shop_id) {
            const access = await new Shopee(this.app, this.token).fetchShopeeAccessToken();
            obj.access_token = access.access_token;
            obj.shop_id = access.shop_id;
        }
        if (!obj.product.content.shopee_id) {
            callback();
            return;
        }
        let basicData = {
            item_id: obj.product.content.shopee_id,
            stock_list: [],
        };
        const partner_id = (_a = this.partner_id) !== null && _a !== void 0 ? _a : '';
        const api_path = '/api/v2/product/get_model_list';
        const timestamp = Math.floor(Date.now() / 1000);
        const config = {
            method: 'get',
            url: this.generateShopUrl(partner_id, api_path, timestamp, obj.access_token, parseInt(obj.shop_id)),
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                shop_id: parseInt(obj.shop_id),
                access_token: obj.access_token,
                item_id: obj.product.content.shopee_id,
            },
        };
        try {
            const response = await (0, axios_1.default)(config);
            if (!((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.model)) {
                callback(response.data);
            }
            obj.product.content.variants.map((variant) => {
                let basicStock = {
                    model_id: 0,
                    seller_stock: [
                        {
                            stock: 0,
                        },
                    ],
                };
                let findModel = response.data.response.model.find((item) => {
                    return item.model_name == variant.spec.join(',');
                });
                console.log(`findModel===>`, findModel);
                if (findModel || response.data.response.model.length == 0) {
                    basicStock.model_id = (findModel && findModel.model_id) || 0;
                    basicStock.seller_stock[0].stock = variant.stock;
                    basicData.stock_list.push(basicStock);
                }
            });
            const updateConfig = {
                method: 'post',
                url: this.generateShopUrl(partner_id, '/api/v2/product/update_stock', timestamp, obj.access_token, parseInt(obj.shop_id)),
                params: {
                    shop_id: parseInt(obj.shop_id),
                    access_token: obj.access_token,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(basicData),
            };
            try {
                const response = await (0, axios_1.default)(updateConfig);
                console.log(`update_stock`, JSON.stringify(basicData));
                console.log(`update_stock`, response.data);
                callback(response.data);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error) && error.response) {
                    console.error('Error Response:', error.response.data);
                }
                else {
                    console.error('Unexpected Error:', error.message);
                }
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('Error get_model_list Response:', error.response.data);
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }
    async asyncStockFromShopnex() {
        let origData = {};
        try {
            origData = await database_js_1.default.query(`SELECT *
                                 FROM \`${this.app}\`.t_manager_post
                                 WHERE (content ->>'$.type'='product')
                                   AND (content ->>'$.shopee_id' IS NOT NULL AND content ->>'$.shopee_id' <> '')`, []);
            let temp = await this.fetchShopeeAccessToken();
            return Promise.all(origData.map((product) => new Promise((resolve, reject) => {
                try {
                    this.asyncStockToShopee({
                        product: product,
                        callback: () => {
                            resolve();
                        },
                        access_token: temp.access_token,
                        shop_id: temp.shop_id,
                    });
                }
                catch (e) {
                    reject(e);
                }
            })))
                .then(() => {
                console.log('所有產品的庫存同步完成！');
                return {
                    result: 'OK',
                };
            })
                .catch(error => {
                console.error('同步庫存時發生錯誤:', error);
            });
        }
        catch (e) { }
    }
    async fetchShopeeAccessToken() {
        try {
            const sqlData = await database_js_1.default.execute(`SELECT *
         FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
         WHERE \`app_name\` = '${this.app}'
           AND \`key\` = 'shopee_access_token'`, []);
            const obj = {};
            obj.accessToken = sqlData;
            if (new Date().getTime() >= new Date(sqlData[0].updated_at).getTime() + 3.9 * 3600 * 1000) {
                console.log(`確認要刷新token`);
                const partner_id = this.partner_id;
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
                    const response = await (0, axios_1.default)(config);
                    try {
                        await database_js_1.default.execute(`
              UPDATE \`${config_js_1.saasConfig.SAAS_NAME}\`.\`private_config\`
              SET \`value\`  = ?,
                  updated_at = ?
              where \`app_name\` = '${this.app}'
                and \`key\` = 'shopee_access_token'
            `, [response.data, new Date()]);
                        return response.data;
                    }
                    catch (e) {
                        console.error('refresh private_config shopee_access_token error : ', e.data);
                    }
                }
                catch (e) {
                    console.error('Shopee access token API request failed:', e);
                }
            }
            else {
                return sqlData[0].value;
            }
        }
        catch (e) {
            console.error('Database query for Shopee access token failed:', e);
        }
    }
    async getOrderList(start, end, index = 0) {
        var _a;
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = this.partner_id) !== null && _a !== void 0 ? _a : '';
        const api_path = '/api/v2/order/get_order_list';
        await this.fetchShopeeAccessToken();
        console.log();
        const data = await database_js_1.default.execute(`select *
       from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
       where \`app_name\` = '${this.app}'
         and \`key\` = 'shopee_access_token'
      `, []);
        const config = {
            method: 'get',
            url: this.generateShopUrl(partner_id, api_path, timestamp, data[0].value.access_token, parseInt(data[0].value.shop_id)),
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
            paramsSerializer: (params) => qs_1.default.stringify(params, { arrayFormat: 'repeat' }),
        };
        try {
            const response = await (0, axios_1.default)(config);
            if (response.data.error.length > 0) {
                return {
                    type: 'error',
                    message: response.data.error,
                };
            }
            console.log("order response -- ", response.data);
            if (response.data.response.total_count == 0) {
                return {
                    type: 'success',
                    data: response.data.response,
                    message: '該時間區間查無商品',
                };
            }
            return;
            const itemList = response.data.response.item;
            const productData = await Promise.all(itemList.map(async (item, index) => {
                console.log('here -- OK');
                try {
                    const pd_data = await database_js_1.default.query(`SELECT count(1)
                                             FROM ${this.app}.t_manager_post
                                             WHERE (content ->>'$.type'='product')
                                               AND (content ->>'$.shopee_id' = ${item.item_id});`, []);
                    if (pd_data[0]['count(1)'] > 0) {
                        return null;
                    }
                    else {
                        return await this.getProductDetail(item.item_id);
                    }
                }
                catch (error) {
                    return null;
                }
            }));
            const temp = {};
            temp.data = productData.reverse().filter(dd => {
                return dd;
            });
            temp.collection = [];
            try {
                await new shopping_js_1.Shopping(this.app, this.token).postMulProduct(temp);
                if (response.data.response.has_next_page) {
                    await this.getItemList(start, end, response.data.response.next_offset);
                }
                return {
                    data: temp.data,
                    message: '匯入OK',
                };
            }
            catch (error) {
                console.error(error);
                return {
                    type: 'error',
                    data: temp.data,
                    message: '產品匯入資料庫失敗',
                };
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.log('Try get_item_list error');
                console.error('Error Response:', error.response.data);
                return {
                    type: 'error',
                    error: error.response.data.error,
                    message: error.response.data.message,
                };
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
    }
    getInitial(obj) {
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
    async uploadFile(file_name, fileData) {
        const TAG = `[AWS-S3][Upload]`;
        const logger = new logger_js_1.default();
        const s3bucketName = config_js_1.default.AWS_S3_NAME;
        const s3path = file_name;
        const fullUrl = config_js_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            ContentType: (() => {
                if (config_js_1.default.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                }
                else {
                    return mime.getType(fullUrl.split('.').pop());
                }
            })(),
        };
        return new Promise((resolve, reject) => {
            AWSLib_js_1.default.getSignedUrl('putObject', params, async (err, url) => {
                if (err) {
                    logger.error(TAG, String(err));
                    console.log(err, err.stack);
                    reject(false);
                }
                else {
                    (0, axios_1.default)({
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
    async downloadImage(imageUrl) {
        try {
            const response = await axios_1.default.get(imageUrl, {
                headers: {},
                responseType: 'arraybuffer',
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            console.error('下載圖片時出錯:', error);
            throw error;
        }
    }
}
exports.Shopee = Shopee;
Shopee.getItemProgress = [];
//# sourceMappingURL=shopee.js.map