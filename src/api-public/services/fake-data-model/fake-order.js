"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeOrder = void 0;
var tool_js_1 = require("../../../modules/tool.js");
var fake_user_js_1 = require("./fake-user.js");
var fake_product_js_1 = require("./fake-product.js");
exports.fakeOrder = (function () {
    var data = [];
    var fakeData_ = fake_product_js_1.fakeProduct;
    var _loop_1 = function (a) {
        var user = getRandomElement(fake_user_js_1.fakeUser);
        var orderID = tool_js_1.default.randomNumber(12);
        var total = 0;
        var lineItems = (function () {
            var data = [];
            for (var a_1 = 0; a_1 < (Math.floor(Math.random() * 5) + 1); a_1++) {
                var pd = fakeData_[Math.floor(Math.random() * 20)];
                total += (pd.sale_price * pd.count);
                data.push(pd);
            }
            return data;
        })();
        data.push([
            orderID, 1, user.userData.email, JSON.stringify({
                "email": user.userData.email,
                "total": total,
                "method": "off_line",
                "rebate": 0,
                "orderID": orderID,
                "discount": 0,
                "progress": (Math.round(Math.random())) ? "wait" : "finish",
                "give_away": [],
                "lineItems": lineItems,
                "user_info": {
                    "name": user.userData.name,
                    "email": user.account,
                    "phone": user.userData.phone,
                    "address": user.userData.address,
                    "shipment": "normal",
                    "send_type": "email",
                    "invoice_type": "me",
                    "shipment_info": "<p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;' id=\"isPasted\">感謝您在 SHOPNEX 購買商品，商品的包裝與配送</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>預計花費約 3 到 6 週，煩請耐心等候！</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>若約定配送日當天未能聯繫到你，因而無法完成配送</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>商家會約定再次配送的時間，您將支付額外的運費。</p>",
                    "invoice_method": "ecpay"
                },
                "code_array": [],
                "editRecord": [],
                "use_rebate": 0,
                "use_wallet": "0",
                "user_email": user.account,
                "orderSource": "",
                "voucherList": [],
                "shipment_fee": 0,
                "customer_info": {
                    "name": user.userData.name,
                    "email": user.account,
                    "phone": user.userData.phone,
                    "payment_select": "cash_on_delivery"
                },
                "shipment_info": "<p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;' id=\"isPasted\">感謝您在 SHOPNEX 購買商品，商品的包裝與配送</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>預計花費約 3 到 6 週，煩請耐心等候！</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>若約定配送日當天未能聯繫到你，因而無法完成配送</p><p style='box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: \"Open Sans\", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>商家會約定再次配送的時間，您將支付額外的運費。</p>",
                "useRebateInfo": {
                    "limit": 101,
                    "point": 0
                },
                "payment_setting": {
                    "TYPE": "newWebPay"
                },
                "user_rebate_sum": 0,
                "custom_form_data": {},
                "off_line_support": {
                    "atm": true,
                    "line": true,
                    "cash_on_delivery": true
                },
                "payment_info_atm": {
                    "text": "<p>當日下單匯款，隔日出貨，後天到貨。</p><p>若有需要統一編號 請提早告知</p><p>------------------------------------------------------------------</p><p>＊採臨櫃匯款者，電匯單上匯款人姓名與聯絡電話請務必填寫。</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>",
                    "bank_code": "812",
                    "bank_name": "台新銀行",
                    "bank_user": "陳女士",
                    "bank_account": "888800004567"
                },
                "shipment_support": [
                    "HILIFEC2C",
                    "FAMIC2C",
                    "normal",
                    "shop",
                    "sas3sesbs2s4s9sb"
                ],
                "shipment_selector": [
                    {
                        "name": "一般宅配",
                        "value": "normal"
                    },
                    {
                        "name": "全家店到店",
                        "value": "FAMIC2C"
                    },
                    {
                        "name": "萊爾富店到店",
                        "value": "HILIFEC2C"
                    },
                    {
                        "name": "實體門市取貨",
                        "value": "shop"
                    },
                    {
                        "form": [
                            {
                                "col": "12",
                                "key": "1727337492436",
                                "page": "input",
                                "type": "form_plugin_v2",
                                "group": "",
                                "title": "dsd",
                                "col_sm": "12",
                                "toggle": true,
                                "appName": "cms_system",
                                "require": "true",
                                "readonly": "write",
                                "formFormat": "{}",
                                "style_data": {
                                    "input": {
                                        "list": [],
                                        "class": "",
                                        "style": "",
                                        "version": "v2"
                                    },
                                    "label": {
                                        "list": [],
                                        "class": "form-label fs-base ",
                                        "style": "",
                                        "version": "v2"
                                    },
                                    "container": {
                                        "list": [],
                                        "class": "",
                                        "style": "",
                                        "version": "v2"
                                    }
                                },
                                "form_config": {
                                    "type": "text",
                                    "title": "",
                                    "input_style": {
                                        "list": [],
                                        "version": "v2"
                                    },
                                    "title_style": {
                                        "list": [],
                                        "version": "v2"
                                    },
                                    "place_holder": ""
                                }
                            }
                        ],
                        "name": "嘉家物流",
                        "value": "sas3sesbs2s4s9sb"
                    }
                ],
                "custom_form_format": [],
                "payment_info_line_pay": {
                    "text": "<p>您選擇了線下Line Pay付款。請完成付款後，提供證明截圖(圖一)，或是照著(圖二)的流程擷取『付款詳細資訊』並上傳，以便我們核款。&nbsp;</p>\n            <p>\n                <br /><img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924978722-Frame%205078.png\" class=\"fr-fic fr-dii\" style=\"width: 215px;\" />&nbsp;<img\n                    src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924973580-Frame%205058.png\"\n                    class=\"fr-fic fr-dii\"\n                    style=\"width: 545px;\"\n                />\n            </p>\n            <p>\n                <br />\n            </p> "
                }
            }), formatDate(getRandomDateInLastYear())
        ]);
    };
    for (var a = 0; a < 500; a++) {
        _loop_1(a);
    }
    return data;
})();
function getRandomElement(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
function getRandomDateInLastYear() {
    var now = new Date();
    var lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    var randomTime = new Date(lastYear.getTime() + Math.random() * (now.getTime() - lastYear.getTime()));
    return randomTime;
}
function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
}
