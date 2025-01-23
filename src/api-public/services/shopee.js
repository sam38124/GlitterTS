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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    constructor(app, token) {
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
        const baseString = `${partner_id}${api_path}${timestamp}${access_token !== null && access_token !== void 0 ? access_token : ""}${shop_id !== null && shop_id !== void 0 ? shop_id : ""}`;
        const partner_key = process_1.default.env.shopee_partner_key;
        return crypto_1.default.createHmac('sha256', partner_key !== null && partner_key !== void 0 ? partner_key : "").update(baseString).digest('hex');
    }
    generateAuth(redirectUrl) {
        const partner_id = process_1.default.env.shopee_partner_id;
        const api_path = "/api/v2/shop/auth_partner";
        const timestamp = Math.floor(Date.now() / 1000);
        const baseString = `${partner_id}${api_path}${timestamp}`;
        const signature = this.cryptoSign(partner_id !== null && partner_id !== void 0 ? partner_id : "", api_path, timestamp);
        return `${Shopee.path}${api_path}?partner_id=${partner_id}&timestamp=${timestamp}&redirect=${redirectUrl}&sign=${signature}`;
    }
    async getToken(code, shop_id) {
        var _a;
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = process_1.default.env.shopee_partner_id) !== null && _a !== void 0 ? _a : "";
        const api_path = "/api/v2/auth/token/get";
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
            })
        };
        try {
            const response = await (0, axios_1.default)(config);
            const data = (await database_js_1.default.execute(`select *
                 from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
                 where \`app_name\` = '${this.app}'
                   and \`key\` = 'shopee_access_token'
                `, []));
            response.data.shop_id = shop_id;
            if (data.length == 0) {
                await database_js_1.default.execute(`
                            INSERT INTO \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, \`updated_at\`)
                            VALUES (?, ?, ?, ?);
                    `, [this.app, "shopee_access_token", response.data, new Date()]);
            }
            else {
                await database_js_1.default.execute(`
                            UPDATE \`${config_js_1.saasConfig.SAAS_NAME}\`.\`private_config\`
                            SET \`value\` = ?
                            where \`app_name\` = '${this.app}'
                              and \`key\` = 'shopee_access_token'

                    `, [response.data]);
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
        const partner_id = (_a = process_1.default.env.shopee_partner_id) !== null && _a !== void 0 ? _a : "";
        const api_path = "/api/v2/product/get_item_list";
        const data = (await database_js_1.default.execute(`select *
             from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config
             where \`app_name\` = '${this.app}'
               and \`key\` = 'shopee_access_token'
            `, []));
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
                    type: "error",
                    message: response.data.error
                };
            }
            console.log(`蝦皮回覆:`, response.data);
            const itemList = response.data.response.item;
            const productData = await Promise.all(itemList.map(async (item, index) => {
                try {
                    const productData = await database_js_1.default.query(`SELECT count(1) FROM ${this.app}.t_manager_post WHERE (content->>'$.type'='product') AND (content->>'$.shopee_id' =?);`, [item.item_id]);
                    if (productData[0]['count(1)'] > 0) {
                        return null;
                    }
                    else {
                        return await this.getProductDetail(item.item_id);
                    }
                }
                catch (error) {
                    console.error('下載或上傳失敗:', error);
                    return null;
                }
            }));
            const temp = {};
            temp.data = productData.reverse().filter((dd) => {
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
                    message: '匯入OK'
                };
            }
            catch (error) {
                console.error(error);
                return {
                    type: "error",
                    data: temp.data,
                    message: '產品匯入資料庫失敗'
                };
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.log("Try get_item_list error");
                console.error('Error Response:', error.response.data);
                return {
                    type: "error",
                    error: error.response.data.error,
                    message: error.response.data.message,
                };
            }
            else {
                console.error('Unexpected Error:', error.message);
            }
        }
    }
    async getProductDetail(id) {
        var _a;
        const that = this;
        async function getModel(postMD, origData) {
            var _a;
            const timestamp = Math.floor(Date.now() / 1000);
            const partner_id = (_a = process_1.default.env.shopee_partner_id) !== null && _a !== void 0 ? _a : "";
            const api_path = "/api/v2/product/get_model_list";
            const config = {
                method: 'get',
                url: that.generateShopUrl(partner_id, api_path, timestamp, data[0].value.access_token, parseInt(data[0].value.shop_id)),
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    shop_id: parseInt(data[0].value.shop_id),
                    access_token: data[0].value.access_token,
                    item_id: id
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
                        language_title: {}
                    };
                    dd.option_list.map((option) => {
                        temp.option.push({
                            title: option.option,
                            expand: false,
                            language_title: {}
                        });
                    });
                    return temp;
                });
                postMD.specs = specs;
                model.map(async (data) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    let newVariants = {
                        sale_price: data.price_info[0].current_price,
                        compare_price: data.price_info[0].original_price,
                        cost: 0,
                        spec: data.model_name.split(','),
                        profit: 0,
                        v_length: (_b = (_a = origData === null || origData === void 0 ? void 0 : origData.dimension) === null || _a === void 0 ? void 0 : _a.package_length) !== null && _b !== void 0 ? _b : 0,
                        v_width: (_d = (_c = origData === null || origData === void 0 ? void 0 : origData.dimension) === null || _c === void 0 ? void 0 : _c.package_width) !== null && _d !== void 0 ? _d : 0,
                        v_height: (_f = (_e = origData === null || origData === void 0 ? void 0 : origData.dimension) === null || _e === void 0 ? void 0 : _e.package_height) !== null && _f !== void 0 ? _f : 0,
                        weight: origData === null || origData === void 0 ? void 0 : origData.weight,
                        shipment_type: 'none',
                        sku: data.model_sku,
                        barcode: "",
                        stock: data.stock_info_v2.summary_info.total_available_stock,
                        stockList: {},
                        preview_image: "",
                        show_understocking: "true",
                        type: "product",
                    };
                    if (((_g = data === null || data === void 0 ? void 0 : data.image) === null || _g === void 0 ? void 0 : _g.image_url_list.length) > 0) {
                        try {
                            const imageUrl = data.image.image_url_list[0];
                            if (imageUrl) {
                                const buffer = await that.downloadImage(imageUrl);
                                const fileExtension = "jpg";
                                const fileName = `shopee/${postMD.title}/${new Date().getTime()}_0.${fileExtension}`;
                                newVariants.preview_image = await that.uploadFile(fileName, buffer);
                            }
                            else {
                                console.warn('圖片 URL 列表為空，無法處理');
                                newVariants.preview_image = "";
                            }
                        }
                        catch (error) {
                            console.error('下載或上傳失敗:', error);
                            newVariants.preview_image = "";
                        }
                    }
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
        let data;
        try {
            const sqlData = (await database_js_1.default.execute(`select * from \`${config_js_1.saasConfig.SAAS_NAME}\`.private_config where \`app_name\`='${this.app}' and \`key\` = 'shopee_access_token'
            `, []));
            data = sqlData;
        }
        catch (e) {
            console.log("get private_config shopee_access_token error : ", e);
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const partner_id = (_a = process_1.default.env.shopee_partner_id) !== null && _a !== void 0 ? _a : "";
        const api_path = "/api/v2/product/get_item_base_info";
        const config = {
            method: 'get',
            url: this.generateShopUrl(partner_id, api_path, timestamp, data[0].value.access_token, parseInt(data[0].value.shop_id)),
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                shop_id: parseInt(data[0].value.shop_id),
                access_token: data[0].value.access_token,
                item_id_list: id
            },
        };
        try {
            const response = await (0, axios_1.default)(config);
            const item = response.data.response.item_list[0];
            let origData = {};
            try {
                origData = await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_manager_post WHERE (content->>'$.type'='product') AND (content->>'$.shopee_id' = ?);`, [id]);
            }
            catch (e) {
            }
            let postMD;
            postMD = this.getInitial({});
            if (origData.length > 0) {
                postMD = Object.assign(Object.assign({}, postMD), origData[0]);
            }
            postMD.title = item.item_name;
            if (item.description_info.extended_description.field_list.length > 0) {
                let temp = ``;
                const promises = item.description_info.extended_description.field_list.map(async (item1) => {
                    if (item1.field_type == 'image') {
                        try {
                            const buffer = await this.downloadImage(item1.image_info.image_url);
                            const fileExtension = "jpg";
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
                item.description_info.extended_description.field_list.map((item) => {
                    if (item.field_type == 'image') {
                        temp += html `<div style="white-space: pre-wrap;"><img src="${item.image_info.s3}" alt='${item.image_info.image_id}'></div>`;
                    }
                    else if (item.field_type == 'text') {
                        temp += html `<div style="white-space: pre-wrap;">${item.text}</div>`;
                    }
                });
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
                    sku: "",
                    barcode: "",
                    stock: item.stock_info_v2.summary_info.total_available_stock,
                    stockList: {},
                    preview_image: "",
                    show_understocking: "true",
                    type: "product",
                };
                postMD.variants = [];
                postMD.variants.push(newVariants);
            }
            else {
                await getModel(postMD, data);
            }
            if (item.image.image_url_list.length > 0) {
                postMD.preview_image = await Promise.all(item.image.image_url_list.map(async (imageUrl, index) => {
                    try {
                        const buffer = await this.downloadImage(imageUrl);
                        const fileExtension = "jpg";
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
//# sourceMappingURL=shopee.js.map