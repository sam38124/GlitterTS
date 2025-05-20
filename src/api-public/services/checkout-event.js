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
exports.CheckoutEvent = void 0;
const ut_timer_js_1 = require("../utils/ut-timer.js");
const user_js_1 = require("./user.js");
const rebate_js_1 = require("./rebate.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const private_config_js_1 = require("../../services/private_config.js");
const shipment_config_js_1 = require("../config/shipment-config.js");
const stock_js_1 = require("./stock.js");
const shopee_js_1 = require("./shopee.js");
const recommend_js_1 = require("./recommend.js");
const glitter_finance_js_1 = require("../models/glitter-finance.js");
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const order_event_js_1 = require("./order-event.js");
const notify_js_1 = require("./notify.js");
const auto_fcm_js_1 = require("../../public-config-initial/auto-fcm.js");
const auto_send_email_js_1 = require("./auto-send-email.js");
const invoice_js_1 = require("./invoice.js");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const financial_service_js_1 = __importStar(require("./financial-service.js"));
const sms_js_1 = require("./sms.js");
const line_message_js_1 = require("./line-message.js");
const shopping_js_1 = require("./shopping.js");
class CheckoutEvent {
    constructor(app, token) {
        this.app = app;
        this.token = token;
        this.shopping = new shopping_js_1.Shopping(this.app, this.token);
    }
    getPaymentSetting() {
        return JSON.parse(JSON.stringify((0, glitter_finance_js_1.onlinePayArray)()));
    }
    async toCheckout(data, type = 'add', replace_order_id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        try {
            const utTimer = new ut_timer_js_1.UtTimer('TO-CHECKOUT');
            const checkPoint = utTimer.checkPoint;
            const userClass = new user_js_1.User(this.app);
            const rebateClass = new rebate_js_1.Rebate(this.app);
            let checkoutPayment = (_a = data.user_info) === null || _a === void 0 ? void 0 : _a.payment;
            let scheduledData;
            data.line_items = (_b = (data.line_items || data.lineItems)) !== null && _b !== void 0 ? _b : [];
            data.isExhibition = data.checkOutType === 'POS' && ((_d = (_c = data.pos_store) === null || _c === void 0 ? void 0 : _c.includes('exhibition_')) !== null && _d !== void 0 ? _d : false);
            if (replace_order_id) {
                const orderData = (await database_js_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
               AND status = 0;
            `, [replace_order_id]))[0];
                if (!orderData) {
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: Cannot find this orderID', null);
                }
                await database_js_1.default.query(`DELETE
           FROM \`${this.app}\`.t_checkout
           WHERE cart_token = ?
             AND status = 0;
          `, [replace_order_id]);
                const { lineItems, user_info, code, customer_info, use_rebate } = orderData.orderData;
                data.line_items = lineItems;
                data.email = orderData.email;
                data.user_info = user_info;
                data.code = code;
                data.customer_info = customer_info;
                data.use_rebate = use_rebate;
            }
            if (data.order_id && type === 'POS') {
                const order = (await database_js_1.default.query(`SELECT *
             FROM \`${this.app}\`.t_checkout
             WHERE cart_token = ?
            `, [data.order_id]))[0];
                if (order) {
                    for (const b of order.orderData.lineItems) {
                        const pdDqlData = (await this.shopping.getProduct({
                            page: 0,
                            limit: 50,
                            id: b.id,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                            whereStore: data.checkOutType === 'POS' ? data.pos_store : undefined,
                        })).data;
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd) => dd.spec.join('-') === b.spec.join('-'));
                        await updateStock(variant, b.deduction_log);
                        await this.shopping.updateVariantsWithSpec(variant, b.id, b.spec);
                        await database_js_1.default.query(`UPDATE \`${this.app}\`.t_manager_post
               SET content = ?
               WHERE id = ?
              `, [JSON.stringify(pd), pdDqlData.id]);
                    }
                }
            }
            async function updateStock(variant, deductionLog) {
                Object.keys(deductionLog).forEach(key => {
                    try {
                        variant.stockList[key].count += deductionLog[key];
                    }
                    catch (e) {
                        console.error(`Error updating stock for variant ${variant.id}:`, e);
                    }
                });
            }
            if (data.checkOutType === 'POS') {
                this.token = undefined;
            }
            const hasAuthentication = (data) => {
                return ((this.token && this.token.userID) ||
                    data.email ||
                    (data.user_info && data.user_info.email) ||
                    (data.user_info && data.user_info.phone));
            };
            if (type !== 'preview' && !hasAuthentication(data)) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Error: No email and phone', null);
            }
            const checkOutType = (_e = data.checkOutType) !== null && _e !== void 0 ? _e : 'manual';
            const getUserDataAsync = async (type, token, data) => {
                if (type === 'preview' &&
                    !((token === null || token === void 0 ? void 0 : token.userID) || (data.user_info && data.user_info.email) || (data.user_info && data.user_info.phone))) {
                    return {};
                }
                if ((token === null || token === void 0 ? void 0 : token.userID) && !['split', 'POS'].includes(type) && !['split', 'POS'].includes(checkOutType)) {
                    return await userClass.getUserData(`${token.userID}`, 'userID');
                }
                return ((data.user_info.email && (await userClass.getUserData(data.user_info.email, 'email_or_phone'))) ||
                    (data.user_info.phone && (await userClass.getUserData(data.user_info.phone, 'email_or_phone'))) ||
                    {});
            };
            checkPoint('check user auth');
            const userData = await getUserDataAsync(type, this.token, data);
            if (data.customer_info) {
                const newCustomerInfo = (_f = (await userClass.getUserData(data.email || data.customer_info.email, 'email_or_phone'))) !== null && _f !== void 0 ? _f : {
                    userData: {}
                };
                data.customer_info = Object.assign(Object.assign({}, data.customer_info), newCustomerInfo.userData);
            }
            data.email = ((_g = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _g === void 0 ? void 0 : _g.email) || ((_h = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _h === void 0 ? void 0 : _h.phone) || '';
            if (!data.email || data.email === 'no-email') {
                data.email =
                    ((_j = data.user_info) === null || _j === void 0 ? void 0 : _j.email) && data.user_info.email !== 'no-email'
                        ? data.user_info.email
                        : ((_k = data.user_info) === null || _k === void 0 ? void 0 : _k.phone) || '';
            }
            if (!data.email && type !== 'preview') {
                data.email = 'no-email';
            }
            const appStatus = await rebateClass.mainStatus();
            if (appStatus && userData && data.use_rebate && data.use_rebate > 0) {
                const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                const sum = userRebate ? userRebate.point : 0;
                if (sum < data.use_rebate) {
                    data.use_rebate = 0;
                }
            }
            else {
                data.use_rebate = 0;
            }
            checkPoint('check rebate');
            const shipment = await this.shopping.getShipmentRefer(data.user_info);
            const shipment_setting = await (async () => {
                try {
                    const config = await private_config_js_1.Private_config.getConfig({
                        appName: this.app,
                        key: 'logistics_setting',
                    });
                    if (!config) {
                        return {
                            support: [],
                            shipmentSupport: [],
                        };
                    }
                    return config[0].value;
                }
                catch (e) {
                    return [];
                }
            })();
            checkPoint('set shipment');
            shipment_setting.custom_delivery = shipment_setting.custom_delivery
                ? await Promise.all(shipment_setting.custom_delivery.map(async (form) => {
                    const config = await userClass.getConfigV2({
                        user_id: 'manager',
                        key: `form_delivery_${form.id}`,
                    });
                    form.form = config.list || [];
                    return form;
                })).then(dataArray => dataArray)
                : [];
            shipment_setting.support = (_l = shipment_setting.support) !== null && _l !== void 0 ? _l : [];
            const languageInfo = (_o = (_m = shipment_setting.language_data) === null || _m === void 0 ? void 0 : _m[data.language]) === null || _o === void 0 ? void 0 : _o.info;
            shipment_setting.info = languageInfo !== null && languageInfo !== void 0 ? languageInfo : shipment_setting.info;
            const carData = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: (_r = (_p = data.email) !== null && _p !== void 0 ? _p : (_q = data.user_info) === null || _q === void 0 ? void 0 : _q.email) !== null && _r !== void 0 ? _r : '',
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                goodsWeight: 0,
                use_rebate: data.use_rebate || 0,
                orderID: data.order_id || `${Date.now()}`,
                shipment_support: shipment_setting.support,
                shipment_info: shipment_setting.info,
                shipment_selector: [
                    ...shipment_config_js_1.ShipmentConfig.list.map(dd => ({
                        name: dd.title,
                        value: dd.value,
                    })),
                    ...((_s = shipment_setting.custom_delivery) !== null && _s !== void 0 ? _s : []).map((dd) => ({
                        form: dd.form,
                        name: dd.name,
                        value: dd.id,
                        system_form: dd.system_form,
                    })),
                ].filter(option => shipment_setting.support.includes(option.value)),
                use_wallet: 0,
                method: (_t = data.user_info) === null || _t === void 0 ? void 0 : _t.method,
                user_email: (_x = (_v = (_u = userData === null || userData === void 0 ? void 0 : userData.account) !== null && _u !== void 0 ? _u : data.email) !== null && _v !== void 0 ? _v : (_w = data.user_info) === null || _w === void 0 ? void 0 : _w.email) !== null && _x !== void 0 ? _x : '',
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                custom_receipt_form: data.custom_receipt_form,
                orderSource: checkOutType === 'POS' ? 'POS' : '',
                code_array: data.code_array,
                give_away: data.give_away,
                user_rebate_sum: 0,
                language: data.language,
                pos_info: data.pos_info,
                client_ip_address: data.client_ip_address,
                fbc: data.fbc,
                fbp: data.fbp,
                editRecord: [],
            };
            if (!((_y = data.user_info) === null || _y === void 0 ? void 0 : _y.name) && userData && userData.userData) {
                const { name, phone } = userData.userData;
                carData.user_info = Object.assign(Object.assign({}, carData.user_info), { name,
                    phone });
            }
            const add_on_items = [];
            const gift_product = [];
            const saveStockArray = [];
            function getVariant(prod, item) {
                var _a;
                if (prod.product_category === 'kitchen') {
                    let price = 0;
                    let show_understocking = false;
                    let stock = Infinity;
                    if (prod.specs.length) {
                        price = item.spec.reduce((total, spec, index) => {
                            const dpe = prod.specs[index].option.find((dd) => dd.title === spec);
                            if (dpe) {
                                const currentStock = Number(dpe.stock) || Infinity;
                                stock = Math.min(stock, currentStock);
                                if (dpe.stock !== undefined) {
                                    show_understocking = true;
                                }
                                return total + (Number(dpe.price) || 0);
                            }
                            return total;
                        }, 0);
                    }
                    else {
                        price = Number(prod.price) || 0;
                        show_understocking = Boolean((_a = prod.stock) !== null && _a !== void 0 ? _a : '');
                        stock = Number(prod.stock) || 0;
                    }
                    if (stock === Infinity) {
                        show_understocking = false;
                    }
                    return {
                        sku: '',
                        spec: [],
                        type: 'variants',
                        stock,
                        v_width: 0,
                        product_id: prod.id,
                        sale_price: price,
                        origin_price: 0,
                        compare_price: 0,
                        preview_image: prod.preview_image && prod.preview_image[0],
                        shipment_type: 'none',
                        show_understocking: String(show_understocking),
                    };
                }
                else {
                    return prod.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                }
            }
            const store_info = await userClass.getConfigV2({ key: 'store-information', user_id: 'manager' });
            data.line_items = await Promise.all(data.line_items.map(async (item) => {
                var _a, _b, _c, _d, _e;
                const getProductData = (await this.shopping.getProduct({
                    page: 0,
                    limit: 1,
                    id: `${item.id}`,
                    status: 'inRange',
                    channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                    whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
                    setUserID: `${(userData === null || userData === void 0 ? void 0 : userData.userID) || ''}`,
                })).data;
                if (getProductData) {
                    const content = getProductData.content;
                    const variant = getVariant(content, item);
                    const count = Number(item.count);
                    if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') &&
                        !isNaN(count) &&
                        count > 0) {
                        const isPOS = checkOutType === 'POS';
                        const isPreOrderStore = store_info.pre_order_status;
                        const isUnderstockingVisible = variant.show_understocking !== 'false';
                        const isManualType = type === 'manual' || type === 'manual-preview';
                        if (isPOS && isUnderstockingVisible && !data.isExhibition) {
                            variant.stock = ((_b = (_a = variant.stockList) === null || _a === void 0 ? void 0 : _a[data.pos_store]) === null || _b === void 0 ? void 0 : _b.count) || 0;
                        }
                        if (variant.stock < item.count && isUnderstockingVisible && !isManualType) {
                            if (isPOS || isPreOrderStore) {
                                item.pre_order = true;
                            }
                            else {
                                item.count = variant.stock;
                            }
                        }
                        if (variant && item.count > 0) {
                            const sale_price = (() => {
                                if (checkOutType === 'POS' && item.custom_price) {
                                    return item.custom_price;
                                }
                                else {
                                    return variant.sale_price;
                                }
                            })();
                            const origin_price = (() => {
                                if (checkOutType === 'POS' && item.custom_price) {
                                    return variant.sale_price;
                                }
                                else {
                                    return variant.origin_price;
                                }
                            })();
                            Object.assign(item, {
                                specs: content.specs,
                                language_data: content.language_data,
                                product_category: content.product_category,
                                preview_image: variant.preview_image || content.preview_image[0],
                                title: content.title,
                                sale_price: sale_price,
                                variant_sale_price: variant.sale_price,
                                origin_price: origin_price,
                                collection: content.collection,
                                sku: variant.sku,
                                stock: variant.stock,
                                show_understocking: variant.show_understocking,
                                stockList: variant.stockList,
                                weight: parseInt(variant.weight || '0', 10),
                                designated_logistics: (_c = content.designated_logistics) !== null && _c !== void 0 ? _c : { type: 'all', list: [] },
                                product_customize_tag: content.product_customize_tag || [],
                            });
                            const shipmentValue = (() => {
                                if (!variant.shipment_type || variant.shipment_type === 'none')
                                    return 0;
                                if (variant.shipment_type === 'weight') {
                                    return item.count * variant.weight;
                                }
                                if (variant.shipment_type === 'volume') {
                                    return item.count * variant.v_length * variant.v_width * variant.v_height;
                                }
                                return 0;
                            })();
                            console.log(`shipmentValue=>`, shipmentValue);
                            item.shipment_obj = {
                                type: variant.shipment_type,
                                value: shipmentValue,
                            };
                            variant.shipment_weight = parseInt(variant.shipment_weight || '0', 10);
                            carData.lineItems.push(item);
                            if (checkOutType == 'group_buy') {
                                if (!scheduledData) {
                                    const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                                    const scheduledDataQuery = `
                        SELECT *
                        FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                    `;
                                    scheduledData = (await database_js_1.default.query(scheduledDataQuery, []))[0];
                                    if (scheduledData) {
                                        const { content } = scheduledData;
                                        const productData = content.item_list.find((pb) => pb.id === item.id);
                                        if (productData) {
                                            const variantData = productData.content.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                                            if (variantData) {
                                                item.sale_price = variantData.live_model.live_price;
                                                carData.total += item.sale_price * item.count;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (type !== 'manual') {
                                if (content.productType.giveaway) {
                                    variant.sale_price = 0;
                                }
                                else {
                                    carData.total += sale_price * item.count;
                                }
                            }
                        }
                        if (!['preview', 'manual-preview'].includes(type) && variant.show_understocking !== 'false') {
                            const remainingStock = Math.max(variant.stock - item.count, 0);
                            variant.stock = remainingStock;
                            if (type === 'POS') {
                                if (data.isExhibition) {
                                    if (data.pos_store) {
                                        await this.shopping.updateExhibitionActiveStock(data.pos_store, variant.variant_id, item.count);
                                    }
                                }
                                else {
                                    variant.deduction_log = { [data.pos_store]: item.count };
                                    variant.stockList[data.pos_store].count -= item.count;
                                    item.deduction_log = variant.deduction_log;
                                }
                            }
                            else {
                                const returnData = new stock_js_1.Stock(this.app, this.token).allocateStock(variant.stockList, item.count);
                                variant.deduction_log = returnData.deductionLog;
                                item.deduction_log = returnData.deductionLog;
                            }
                            saveStockArray.push(() => new Promise(async (resolve, reject) => {
                                var _a;
                                try {
                                    if (data.checkOutType == 'group_buy') {
                                        if (!scheduledData) {
                                            const sql = `WHERE JSON_CONTAINS(content->'$.pending_order', '"${data.temp_cart_id}"'`;
                                            const scheduledDataQuery = `
                                SELECT *
                                FROM \`${this.app}\`.\`t_live_purchase_interactions\` ${sql});
                            `;
                                            scheduledData = (await database_js_1.default.query(scheduledDataQuery, []))[0];
                                        }
                                        if (scheduledData) {
                                            const { content } = scheduledData;
                                            const productData = content.item_list.find((pb) => pb.id === item.id);
                                            if (productData) {
                                                const variantData = productData.content.variants.find((dd) => dd.spec.join('-') === item.spec.join('-'));
                                                if (variantData) {
                                                    const stockService = new stock_js_1.Stock(this.app, this.token);
                                                    const { stockList, deductionLog } = stockService.allocateStock(variantData.stockList, item.count);
                                                    variantData.stockList = stockList;
                                                    item.deduction_log = deductionLog;
                                                    carData.scheduled_id = scheduledData.id;
                                                    await this.shopping.updateVariantsForScheduled(content, scheduledData.id);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (content.shopee_id) {
                                            await new shopee_js_1.Shopee(this.app, this.token).asyncStockToShopee({
                                                product: getProductData,
                                                callback: () => { },
                                            });
                                        }
                                        if (content.product_category === 'kitchen' && ((_a = variant.spec) === null || _a === void 0 ? void 0 : _a.length)) {
                                            variant.spec.forEach((d1, index) => {
                                                const option = content.specs[index].option.find((d2) => d2.title === d1);
                                                if ((option === null || option === void 0 ? void 0 : option.stock) !== undefined) {
                                                    option.stock = parseInt(option.stock, 10) - item.count;
                                                }
                                            });
                                            const store_config = await userClass.getConfigV2({
                                                key: 'store_manager',
                                                user_id: 'manager',
                                            });
                                            item.deduction_log = { [store_config.list[0].id]: item.count };
                                        }
                                        else {
                                            await this.shopping.updateVariantsWithSpec(variant, item.id, item.spec);
                                        }
                                        await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET ?
                             WHERE id = ${getProductData.id}`, [{ content: JSON.stringify(content) }]);
                                    }
                                    resolve(true);
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }));
                        }
                    }
                    Object.assign(item, {
                        is_add_on_items: content.productType.addProduct && !content.productType.product,
                        is_hidden: content.visible === 'false',
                        is_gift: content.productType.giveaway,
                        sale_price: content.productType.giveaway ? 0 : item.sale_price,
                        min_qty: (_d = content.min_qty) !== null && _d !== void 0 ? _d : item.min_qty,
                        max_qty: (_e = content.max_qty) !== null && _e !== void 0 ? _e : item.max_qty,
                    });
                    item.is_add_on_items && add_on_items.push(item);
                    item.is_gift && gift_product.push(item);
                }
                return item;
            })).then(dataArray => dataArray);
            checkPoint('get product info');
            const maxProductMap = new Map();
            let hasMaxProduct = false;
            for (const product of data.line_items) {
                if (product.max_qty && product.max_qty > 0) {
                    maxProductMap.set(product.id, true);
                    hasMaxProduct = true;
                }
            }
            if (hasMaxProduct && data.email !== 'no-email') {
                const cartTokenSQL = `
            SELECT cart_token
            FROM \`${this.app}\`.t_checkout
            WHERE email IN (${[-99, (_z = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _z === void 0 ? void 0 : _z.email, (_0 = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _0 === void 0 ? void 0 : _0.phone]
                    .filter(Boolean)
                    .map(item => database_js_1.default.escape(item))
                    .join(',')})
              AND order_status <> '-1'
        `;
                const soldHistory = await database_js_1.default.query(`
              SELECT *
              FROM \`${this.app}\`.t_products_sold_history
              WHERE product_id IN (${[...maxProductMap.keys()].join(',')})
                AND order_id IN (${cartTokenSQL})
          `, []);
                const purchaseHistory = new Map();
                for (const history of soldHistory) {
                    const pid = Number(history.product_id);
                    purchaseHistory.set(pid, ((_1 = purchaseHistory.get(pid)) !== null && _1 !== void 0 ? _1 : 0) + history.count);
                }
                for (const item of data.line_items) {
                    if (maxProductMap.has(item.id)) {
                        item.buy_history_count = purchaseHistory.get(item.id) || 0;
                    }
                }
            }
            checkPoint('set max product');
            carData.select_shipment_setting = ((_2 = data === null || data === void 0 ? void 0 : data.user_info) === null || _2 === void 0 ? void 0 : _2.shipment)
                ? await userClass.getConfigV2({
                    key: 'shipment_config_' + data.user_info.shipment,
                    user_id: 'manager',
                })
                : {};
            const freeShipmnetNum = (_5 = (_4 = (_3 = carData.select_shipment_setting) === null || _3 === void 0 ? void 0 : _3.cartSetting) === null || _4 === void 0 ? void 0 : _4.freeShipmnetTarget) !== null && _5 !== void 0 ? _5 : 0;
            const isFreeShipment = freeShipmnetNum > 0 && carData.total >= freeShipmnetNum;
            carData.shipment_fee = isFreeShipment
                ? 0
                : this.shopping.getShipmentFee(data.user_info, carData.lineItems, shipment);
            carData.total += carData.shipment_fee;
            const f_rebate = await this.shopping.formatUseRebate(carData.total, carData.use_rebate);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            checkPoint('set carData');
            if (userData && userData.account) {
                const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                carData.user_rebate_sum = (userRebate === null || userRebate === void 0 ? void 0 : userRebate.point) || 0;
            }
            if (data.distribution_code) {
                const linkList = await new recommend_js_1.Recommend(this.app, this.token).getLinkList({
                    page: 0,
                    limit: 99999,
                    code: data.distribution_code,
                    status: true,
                    no_detail: true,
                });
                if (linkList.data.length > 0) {
                    const content = linkList.data[0].content;
                    if (this.shopping.checkDuring(content)) {
                        carData.distribution_info = content;
                    }
                }
            }
            checkPoint('distribution code');
            if (type !== 'manual' && type !== 'manual-preview') {
                carData.lineItems = carData.lineItems.filter(dd => {
                    return !add_on_items.includes(dd) && !gift_product.includes(dd);
                });
                const c_carData = await this.shopping.checkVoucher(structuredClone(carData));
                add_on_items.forEach(dd => {
                    var _a;
                    try {
                        const isAddOnItem = (_a = c_carData.voucherList) === null || _a === void 0 ? void 0 : _a.some(voucher => {
                            return (voucher.reBackType === 'add_on_items' &&
                                voucher.add_on_products.find(d2 => {
                                    return `${dd.id}` === `${d2}`;
                                }));
                        });
                        if (isAddOnItem) {
                            carData.lineItems.push(dd);
                        }
                    }
                    catch (e) {
                        console.error('Error processing add-on items:', e);
                    }
                });
                await this.shopping.checkVoucher(carData);
                checkPoint('check voucher');
                let can_add_gift = [];
                (_6 = carData.voucherList) === null || _6 === void 0 ? void 0 : _6.filter(dd => dd.reBackType === 'giveaway').forEach(dd => can_add_gift.push(dd.add_on_products));
                gift_product.forEach(dd => {
                    const max_count = can_add_gift.filter(d1 => d1.includes(dd.id)).length;
                    if (max_count) {
                        dd.count = max_count;
                        for (let a = 0; a < dd.count; a++) {
                            can_add_gift = can_add_gift.filter(d1 => !d1.includes(dd.id));
                        }
                        carData.lineItems.push(dd);
                    }
                });
                for (const giveawayData of carData.voucherList.filter(dd => dd.reBackType === 'giveaway')) {
                    if (!((_7 = giveawayData.add_on_products) === null || _7 === void 0 ? void 0 : _7.length))
                        continue;
                    const productPromises = giveawayData.add_on_products
                        .map(async (id) => {
                        var _a;
                        const getGiveawayData = await this.shopping.getProduct({
                            page: 0,
                            limit: 1,
                            id: `${id}`,
                            status: 'inRange',
                            channel: checkOutType === 'POS' ? (data.isExhibition ? 'exhibition' : 'pos') : undefined,
                            whereStore: checkOutType === 'POS' ? data.pos_store : undefined,
                        });
                        if ((_a = getGiveawayData === null || getGiveawayData === void 0 ? void 0 : getGiveawayData.data) === null || _a === void 0 ? void 0 : _a.content) {
                            const giveawayContent = getGiveawayData.data.content;
                            giveawayContent.voucher_id = giveawayData.id;
                            return giveawayContent;
                        }
                        return null;
                    })
                        .filter(Boolean);
                    giveawayData.add_on_products = await Promise.all(productPromises);
                }
            }
            const configData = await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            });
            const keyData = (_8 = configData[0]) === null || _8 === void 0 ? void 0 : _8.value;
            if (keyData) {
                carData.payment_info_custom = keyData.payment_info_custom;
            }
            await new Promise(resolve => {
                var _a;
                let n = 0;
                carData.payment_customer_form = (_a = carData.payment_customer_form) !== null && _a !== void 0 ? _a : [];
                keyData.payment_info_custom.map((item, index) => {
                    userClass
                        .getConfigV2({
                        user_id: 'manager',
                        key: `form_finance_${item.id}`,
                    })
                        .then(data => {
                        carData.payment_customer_form[index] = {
                            id: item.id,
                            list: data.list,
                        };
                        n++;
                        if (keyData.payment_info_custom.length === n) {
                            resolve();
                        }
                    });
                });
                if (n === 0) {
                    resolve();
                }
            });
            checkPoint('set payment');
            keyData.cash_on_delivery = (_9 = keyData.cash_on_delivery) !== null && _9 !== void 0 ? _9 : { shipmentSupport: [] };
            carData.payment_info_line_pay = keyData.payment_info_line_pay;
            carData.payment_info_atm = keyData.payment_info_atm;
            keyData.cash_on_delivery.shipmentSupport = (_10 = keyData.cash_on_delivery.shipmentSupport) !== null && _10 !== void 0 ? _10 : [];
            await this.setPaymentSetting({ carData: carData, checkoutPayment: checkoutPayment, keyData: keyData });
            let subtotal = 0;
            carData.lineItems.map(item => {
                var _a;
                if (item.is_gift) {
                    item.sale_price = 0;
                }
                if (!item.is_gift) {
                    subtotal += item.count * (item.sale_price - ((_a = item.discount_price) !== null && _a !== void 0 ? _a : 0));
                }
            });
            if (carData.total < 0 || carData.use_rebate > subtotal) {
                carData.use_rebate = 0;
                carData.total = subtotal + carData.shipment_fee;
            }
            carData.lineItems.map(item => {
                carData.goodsWeight += item.weight * item.count;
            });
            const excludedValuesByTotal = new Set(['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C']);
            const excludedValuesByWeight = new Set(['normal', 'black_cat']);
            const logisticsGroupResult = await userClass.getConfig({ key: 'logistics_group', user_id: 'manager' });
            const logisticsGroup = (_12 = (_11 = logisticsGroupResult[0]) === null || _11 === void 0 ? void 0 : _11.value) !== null && _12 !== void 0 ? _12 : [];
            const isExcludedByTotal = (dd) => {
                return carData.total > 20000 && excludedValuesByTotal.has(dd.value);
            };
            const isExcludedByWeight = (dd) => {
                return carData.goodsWeight > 20 && excludedValuesByWeight.has(dd.value);
            };
            const isIncludedInDesignatedLogistics = (dd) => {
                return carData.lineItems.every(item => {
                    if (item.designated_logistics === undefined || item.designated_logistics.type === 'all') {
                        return true;
                    }
                    for (const group of logisticsGroup) {
                        if (item.designated_logistics.group.includes(group.key) && group.list.includes(dd.value)) {
                            return true;
                        }
                    }
                    return false;
                });
            };
            carData.shipment_selector = carData.shipment_selector
                .filter((dd) => {
                return isIncludedInDesignatedLogistics(dd);
            })
                .map(dd => {
                dd.isExcludedByTotal = isExcludedByTotal(dd);
                dd.isExcludedByWeight = isExcludedByWeight(dd);
                return dd;
            });
            carData.code_array = (carData.code_array || []).filter(code => {
                return (carData.voucherList || []).find(dd => dd.code === code);
            });
            if (Array.isArray(carData.shipment_support)) {
                await Promise.all(carData.shipment_support.map(async (sup) => {
                    return await userClass
                        .getConfigV2({ key: 'shipment_config_' + sup, user_id: 'manager' })
                        .then(r => {
                        return this.getCartFormulaPass(carData, r);
                    })
                        .catch(() => {
                        return true;
                    });
                })).then(dataArray => {
                    var _a;
                    carData.shipment_support = (_a = carData.shipment_support) === null || _a === void 0 ? void 0 : _a.filter((_, index) => dataArray[index]);
                });
            }
            checkPoint('return preview');
            if (type === 'preview' || type === 'manual-preview')
                return { data: carData };
            if (userData && userData.userID) {
                await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
                    order_id: carData.orderID,
                });
                if (carData.voucherList && carData.voucherList.length > 0) {
                    for (const voucher of carData.voucherList) {
                        await this.shopping.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
                    }
                }
                const sum = (await database_js_1.default.query(`SELECT sum(money)
               FROM \`${this.app}\`.t_wallet
               WHERE status in (1, 2)
                 and userID = ?`, [userData.userID]))[0]['sum(money)'] || 0;
                carData.use_wallet = sum < carData.total ? sum : carData.total;
            }
            checkPoint('check user rebate');
            if (type === 'manual' || type === 'split') {
                carData.orderSource = type;
                let tempVoucher = {
                    discount_total: data.voucher.discount_total,
                    end_ISO_Date: '',
                    for: 'all',
                    forKey: [],
                    method: data.voucher.method,
                    overlay: false,
                    rebate_total: data.voucher.rebate_total,
                    reBackType: data.voucher.reBackType,
                    rule: 'min_price',
                    ruleValue: 0,
                    startDate: '',
                    startTime: '',
                    start_ISO_Date: '',
                    status: 1,
                    target: '',
                    targetList: [],
                    title: data.voucher.title,
                    trigger: 'auto',
                    type: 'voucher',
                    value: data.voucher.value,
                    id: data.voucher.id,
                    bind: [],
                    bind_subtotal: 0,
                    times: 1,
                    counting: 'single',
                    conditionType: 'item',
                    includeDiscount: 'before',
                    device: ['normal'],
                    productOffStart: 'price_all',
                    rebateEndDay: '30',
                    macroLimited: 0,
                    microLimited: 0,
                    selectShipment: { type: 'all', list: [] },
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = (_13 = data.total) !== null && _13 !== void 0 ? _13 : 0;
                carData.rebate = tempVoucher.rebate_total;
                if (tempVoucher.reBackType == 'shipment_free' || type == 'split') {
                    carData.shipment_fee = 0;
                }
                if (tempVoucher.reBackType == 'rebate') {
                    let customerData = await userClass.getUserData(data.email || data.user_info.email, 'email_or_phone');
                    if (!customerData) {
                        await userClass.createUser(data.email, tool_js_1.default.randomString(8), {
                            email: data.email,
                            name: data.customer_info.name,
                            phone: data.customer_info.phone,
                        }, {}, true);
                        customerData = await userClass.getUserData(data.email || data.user_info.email, 'email_or_phone');
                    }
                }
                await Promise.all(saveStockArray.map(dd => dd()));
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: data.pay_status,
                    app: this.app,
                });
                new notify_js_1.ManagerNotify(this.app).checkout({ orderData: carData, status: 0 });
                const emailList = new Set([carData.customer_info, carData.user_info].map(dd => dd && dd.email));
                for (const email of emailList) {
                    if (email) {
                        await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                            app: this.app,
                            tag: 'order-create',
                            order_id: carData.orderID,
                            phone_email: email,
                        });
                        auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                    }
                }
                checkPoint('manual order done');
                return {
                    data: carData,
                };
            }
            else if (type === 'POS') {
                carData.orderSource = 'POS';
                if (checkOutType === 'POS' && Array.isArray(data.voucherList)) {
                    const manualVoucher = data.voucherList.find((item) => item.id === 0);
                    if (manualVoucher) {
                        manualVoucher.discount = (_14 = manualVoucher.discount_total) !== null && _14 !== void 0 ? _14 : 0;
                        carData.total -= manualVoucher.discount;
                        carData.discount += manualVoucher.discount;
                        carData.voucherList.push(manualVoucher);
                    }
                }
                const trans = await database_js_1.default.Transaction.build();
                if (data.pre_order) {
                    carData.progress = 'pre_order';
                    carData.orderStatus = '0';
                    const payTotal = data.pos_info.payment
                        .map((dd) => dd.total)
                        .reduce((acc, val) => acc + val, 0);
                    if (carData.total <= payTotal) {
                        data.pay_status = 1;
                    }
                    else {
                        data.pay_status = 3;
                    }
                }
                else if (carData.user_info.shipment === 'now') {
                    carData.orderStatus = '1';
                    carData.progress = 'finish';
                }
                if (data.invoice_select !== 'nouse') {
                    try {
                        carData.invoice = await new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: data.pay_status,
                    app: this.app,
                });
                await trans.commit();
                await trans.release();
                await Promise.all(saveStockArray.map(dd => dd()));
                await this.shopping.releaseCheckout((_15 = data.pay_status) !== null && _15 !== void 0 ? _15 : 0, carData.orderID);
                checkPoint('release pos checkout');
                for (const email of new Set([carData.customer_info, carData.user_info].map(dd => {
                    return dd && dd.email;
                }))) {
                    if (email) {
                        await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                            app: this.app,
                            tag: 'order-create',
                            order_id: carData.orderID,
                            phone_email: email,
                        });
                        auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                    }
                }
                return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
            }
            const id = 'redirect_' + tool_js_1.default.randomString(6);
            const redirect_url = new URL(data.return_url);
            redirect_url.searchParams.set('cart_token', carData.orderID);
            await redis_js_1.default.setValue(id, redirect_url.href);
            if (carData.use_wallet === carData.total) {
                await database_js_1.default.query(`INSERT INTO \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
           values (?, ?, ?, ?, ?);`, [
                    carData.orderID,
                    userData.userID,
                    carData.use_wallet * -1,
                    1,
                    JSON.stringify({
                        note: '使用錢包購物',
                        orderData: carData,
                    }),
                ]);
                carData.method = 'off_line';
                await order_event_js_1.OrderEvent.insertOrder({
                    cartData: carData,
                    status: 1,
                    app: this.app,
                });
                if (carData.use_wallet > 0) {
                    new invoice_js_1.Invoice(this.app).postCheckoutInvoice(carData.orderID, false);
                }
                await Promise.all(saveStockArray.map(dd => dd()));
                checkPoint('insert order & create invoice');
                return {
                    is_free: true,
                    return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                };
            }
            else {
                const keyData = (await private_config_js_1.Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                }))[0].value;
                let kd = (_16 = keyData[carData.customer_info.payment_select]) !== null && _16 !== void 0 ? _16 : {
                    ReturnURL: '',
                    NotifyURL: '',
                };
                switch (carData.customer_info.payment_select) {
                    case 'ecPay':
                    case 'newWebPay':
                        const subMitData = await new financial_service_js_1.default(this.app, {
                            HASH_IV: kd.HASH_IV,
                            HASH_KEY: kd.HASH_KEY,
                            ActionURL: kd.ActionURL,
                            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
                            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                            MERCHANT_ID: kd.MERCHANT_ID,
                            TYPE: carData.customer_info.payment_select,
                        }).createOrderPage(carData);
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select newWebPay');
                        return {
                            form: subMitData,
                        };
                    case 'paypal':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select paypal');
                        return await new financial_service_js_1.PayPal(this.app, kd).checkout(carData);
                    case 'line_pay':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select linepay');
                        return await new financial_service_js_1.LinePay(this.app, kd).createOrder(carData);
                    case 'paynow': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&paynow=true&type=${carData.customer_info.payment_select}`;
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        checkPoint('select paynow');
                        return await new financial_service_js_1.PayNow(this.app, kd).createOrder(carData);
                    }
                    case 'jkopay': {
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=jkopay&return=${id}`;
                        checkPoint('select jkopay');
                        return await new financial_service_js_1.JKO(this.app, kd).createOrder(carData);
                    }
                    default:
                        carData.method = 'off_line';
                        await order_event_js_1.OrderEvent.insertOrder({
                            cartData: carData,
                            status: 0,
                            app: this.app,
                        });
                        await Promise.all(saveStockArray.map(dd => {
                            return dd();
                        }));
                        new notify_js_1.ManagerNotify(this.app).checkout({
                            orderData: carData,
                            status: 0,
                        });
                        for (const phone of new Set([carData.customer_info, carData.user_info].map(dd => {
                            return dd && dd.phone;
                        }))) {
                            let sns = new sms_js_1.SMS(this.app);
                            await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, phone);
                            console.info('訂單簡訊寄送成功');
                        }
                        console.log("carData.customer_info -- ", carData.customer_info);
                        if (carData.customer_info.lineID) {
                            let line = new line_message_js_1.LineMessage(this.app);
                            console.log("here -- OK");
                            await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
                            console.info('訂單line訊息寄送成功');
                        }
                        for (const email of new Set([carData.customer_info, carData.user_info].map(dd => {
                            return dd && dd.email;
                        }))) {
                            if (email) {
                                await auto_fcm_js_1.AutoFcm.orderChangeInfo({
                                    app: this.app,
                                    tag: 'order-create',
                                    order_id: carData.orderID,
                                    phone_email: email,
                                });
                                auto_send_email_js_1.AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language);
                            }
                        }
                        await this.shopping.releaseVoucherHistory(carData.orderID, 1);
                        checkPoint('default release checkout');
                        return {
                            off_line: true,
                            return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                        };
                }
            }
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'ToCheckout Func Error:' + e, null);
        }
    }
    async setPaymentSetting(obj) {
        var _a, _b;
        let { carData, keyData, checkoutPayment } = obj;
        let payment_setting = this.getPaymentSetting().filter((dd) => {
            const k = keyData[dd.key];
            if (!k || !k.toggle || !this.getCartFormulaPass(carData, k))
                return false;
            dd.custome_name = k.custome_name;
            if (carData.orderSource === 'POS') {
                if (dd.key === 'ut_credit_card') {
                    dd.pwd = k['pwd'];
                }
                return dd.type === 'pos';
            }
            return dd.type !== 'pos';
        });
        carData.off_line_support = (_a = keyData.off_line_support) !== null && _a !== void 0 ? _a : {};
        Object.entries(carData.off_line_support).map(([key, value]) => {
            if (!value)
                return;
            if (key === 'cash_on_delivery') {
                carData.off_line_support[key] = this.getCartFormulaPass(carData, keyData[key]);
                if (carData.off_line_support[key]) {
                    payment_setting.push({ key: 'cash_on_delivery', name: '貨到付款' });
                }
            }
            else if (key === 'atm') {
                carData.off_line_support[key] = this.getCartFormulaPass(carData, keyData.payment_info_atm);
                if (carData.off_line_support[key]) {
                    payment_setting.push({ key: 'atm', name: 'atm轉帳' });
                }
            }
            else if (key === 'line') {
                carData.off_line_support[key] = this.getCartFormulaPass(carData, keyData.payment_info_line_pay);
                if (carData.off_line_support[key]) {
                    payment_setting.push({ key: 'line', name: 'line轉帳' });
                }
            }
            else {
                const customPay = keyData.payment_info_custom.find((c) => c.id === key);
                carData.off_line_support[key] = this.getCartFormulaPass(carData, customPay !== null && customPay !== void 0 ? customPay : {});
                if (carData.off_line_support[key]) {
                    payment_setting.push({ key: key, name: customPay.name });
                }
            }
        });
        carData.payment_setting = payment_setting;
        checkoutPayment =
            checkoutPayment || (carData.payment_setting[0] && carData.payment_setting[0].key);
        console.log('checkoutPayment', checkoutPayment);
        console.log('onlinePayArray', glitter_finance_js_1.onlinePayArray);
        carData.shipment_support =
            (_b = (() => {
                if (checkoutPayment === 'cash_on_delivery') {
                    console.log(`shipment_support-cash-delivery`);
                    return keyData.cash_on_delivery;
                }
                else if (this.getPaymentSetting()
                    .map((item) => item.key)
                    .includes(checkoutPayment)) {
                    console.log(`shipment_support-online-pay-${checkoutPayment}`);
                    return keyData[checkoutPayment];
                }
                else if (checkoutPayment === 'atm') {
                    console.log(`shipment_support-atm`);
                    return keyData.payment_info_atm;
                }
                else if (checkoutPayment === 'line') {
                    console.log(`shipment_support-line`);
                    return keyData.payment_info_line_pay;
                }
                else {
                    console.log(`shipment_support-custom`);
                    const customPay = keyData.payment_info_custom.find((c) => c.id === checkoutPayment);
                    return customPay !== null && customPay !== void 0 ? customPay : {};
                }
            })().shipmentSupport) !== null && _b !== void 0 ? _b : [];
    }
    getCartFormulaPass(carData, keyData) {
        const data = keyData.cartSetting;
        if (!data || data.orderFormula === undefined)
            return true;
        const formulaSet = new Set(data.orderFormula);
        const total = carData.total -
            (formulaSet.has('shipment_fee') ? 0 : carData.shipment_fee) +
            (formulaSet.has('discount') || !carData.discount ? 0 : carData.discount) +
            (formulaSet.has('use_rebate') ? 0 : carData.use_rebate);
        return (!data.minimumTotal || total >= data.minimumTotal) && (!data.maximumTotal || total <= data.maximumTotal);
    }
}
exports.CheckoutEvent = CheckoutEvent;
//# sourceMappingURL=checkout-event.js.map