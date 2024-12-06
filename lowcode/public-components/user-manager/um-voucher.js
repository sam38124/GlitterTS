var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class UMVoucher {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            dataList: [],
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }
                else {
                    const isWebsite = document.body.clientWidth > 768;
                    return html `
                        <div class="um-container row mx-auto">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-2" style="min-height: 500px;">
                                <div class="mx-auto orderList pt-3 mb-4 row">
                                    ${(() => {
                        if (vm.dataList.length === 0) {
                            return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                <lottie-player
                                                    style="max-width: 100%;width: 300px;"
                                                    src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                    speed="1"
                                                    loop="true"
                                                    background="transparent"
                                                ></lottie-player>
                                                <span class="mb-5 fs-5">${Language.text('no_coupons_available')}</span>
                                            </div>`;
                        }
                        const header = [
                            {
                                title: Language.text('coupon_name'),
                            },
                            {
                                title: Language.text('coupon_code'),
                            },
                            {
                                title: Language.text('expiration_date'),
                            },
                            {
                                title: '',
                            },
                        ];
                        function formatText(item) {
                            return [
                                item.title,
                                item.code,
                                (() => {
                                    const endText = item.end_ISO_Date ? glitter.ut.dateFormat(new Date(item.end_ISO_Date), 'yyyy/MM/dd') : Language.text('no_expiration');
                                    return `${glitter.ut.dateFormat(new Date(item.start_ISO_Date), 'yyyy/MM/dd')} ~ ${endText}`;
                                })(),
                                html `<div class="d-flex w-100 justify-content-around">
                                                    <div
                                                        class="option px-4 d-flex justify-content-center um-nav-btn um-nav-btn-active me-1"
                                                        onclick="${gvc.event(() => {
                                    UmClass.dialog({
                                        gvc,
                                        tag: 'user-qr-code',
                                        title: Language.text('coupon_details'),
                                        innerHTML: (gvc) => {
                                            return html `
                                                                        <div class="d-flex gap-2 flex-column my-2">
                                                                            ${gvc.map(UMVoucher.getVoucherTextList(gvc, item).map((text) => {
                                                return html ` <div class="${text.length > 0 ? '' : 'gray-line'}">${text}</div>`;
                                            }))}
                                                                        </div>
                                                                    `;
                                        },
                                    });
                                })}"
                                                    >
                                                        ${Language.text('view_details')}
                                                    </div>
                                                    <div
                                                        class="option px-4 d-flex justify-content-center um-nav-btn um-nav-btn-active"
                                                        onclick="${gvc.event(() => {
                                    UmClass.dialog({
                                        gvc,
                                        tag: 'user-qr-code',
                                        title: Language.text('coupon_qr_code'),
                                        innerHTML: (gvc) => {
                                            return gvc.bindView((() => {
                                                const id = glitter.getUUID();
                                                let loading = true;
                                                let img = '';
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        if (loading) {
                                                            return UmClass.spinner('100%');
                                                        }
                                                        else {
                                                            return html ` <div style="text-align: center; vertical-align: middle;">
                                                                                            <img src="${img}" />
                                                                                        </div>`;
                                                        }
                                                    },
                                                    divCreate: {},
                                                    onCreate: () => {
                                                        if (loading) {
                                                            glitter.addMtScript([
                                                                {
                                                                    src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                                                                },
                                                            ], () => {
                                                                const si = setInterval(() => {
                                                                    const qr = window.QRCode;
                                                                    if (qr) {
                                                                        qr.toDataURL(`voucher-${item.code}`, {
                                                                            width: 400,
                                                                            margin: 2,
                                                                        }, (err, url) => {
                                                                            if (err) {
                                                                                console.error(err);
                                                                                return;
                                                                            }
                                                                            img = url;
                                                                            loading = false;
                                                                            gvc.notifyDataChange(id);
                                                                        });
                                                                        clearInterval(si);
                                                                    }
                                                                }, 300);
                                                            }, () => { });
                                                        }
                                                    },
                                                };
                                            })());
                                        },
                                    });
                                })}"
                                                    >
                                                        ${Language.text('show_qr_code')}
                                                    </div>
                                                </div>`,
                            ];
                        }
                        if (isWebsite) {
                            const flexList = [1.2, 1, 1.5, 1.5];
                            return html `
                                                <div class="w-100 d-sm-flex py-4 um-th-bar">
                                                    ${header
                                .map((item, index) => {
                                return html `<div class="um-th" style="flex: ${flexList[index]};">${item.title}</div>`;
                            })
                                .join('')}
                                                </div>
                                                ${vm.dataList
                                .map((item) => {
                                return html `<div class="w-100 d-sm-flex py-5 um-td-bar">
                                                            ${formatText(item.content)
                                    .map((dd, index) => {
                                    return html `<div class="um-td" style="flex: ${flexList[index]}">${dd}</div>`;
                                })
                                    .join('')}
                                                        </div>`;
                            })
                                .join('')}
                                            `;
                        }
                        return html `<div class="w-100 d-sm-none mb-3 s162413">
                                            ${vm.dataList
                            .map((item) => {
                            return html `<div class="um-mobile-area">
                                                        ${formatText(item.content)
                                .map((dd, index) => {
                                if (header[index].title === '') {
                                    return dd;
                                }
                                return html `<div class="um-mobile-text">${header[index].title}: ${dd}</div>`;
                            })
                                .join('')}
                                                    </div>`;
                        })
                            .join('')}
                                        </div> `;
                    })()}
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            divCreate: {
                class: '',
            },
            onCreate: () => {
                if (loadings.view) {
                    gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                        ApiShop.getVoucher({
                            page: 0,
                            limit: 10000,
                            data_from: 'user',
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            if (res.result && res.response.data) {
                                vm.dataList = res.response.data.filter((item) => item.content.trigger === 'code');
                            }
                            else {
                                vm.dataList = [];
                            }
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        }));
                    }, () => { });
                }
            },
        });
    }
    static getVoucherTextList(gvc, voucherData) {
        var _a, _b, _c, _d, _e, _f;
        const glitter = gvc.glitter;
        const productForList = [
            { title: Language.text('all_products'), value: 'all' },
            { title: Language.text('product_categories'), value: 'collection' },
            { title: Language.text('products'), value: 'product' },
        ];
        const translations = {
            'zh-TW': [
                `活動標題：${voucherData.title && voucherData.title.length > 0 ? voucherData.title : '尚無標題'}`,
                `適用商品：${(() => {
                    const forData = productForList.find((item) => item.value === voucherData.for);
                    return forData ? forData.title : '';
                })()}`,
                `輸入代碼：${voucherData.code}`,
                `消費條件：${(() => {
                    if (voucherData.rule === 'min_price')
                        return '最少消費金額';
                    if (voucherData.rule === 'min_count')
                        return '最少購買數量';
                    return '';
                })()}`,
                `條件值：${(() => {
                    if (voucherData.rule === 'min_price')
                        return voucherData.ruleValue + ' 元';
                    if (voucherData.rule === 'min_count')
                        return voucherData.ruleValue + ' 個';
                    return '';
                })()}`,
                `折扣優惠：${(() => {
                    switch (voucherData.reBackType) {
                        case 'rebate':
                            return voucherData.method === 'fixed'
                                ? `${voucherData.value} 點 ${glitter.share.rebateConfig.title}`
                                : `符合條件商品總額的 ${voucherData.value} ％作為 ${glitter.share.rebateConfig.title}`;
                        case 'discount':
                            return voucherData.method === 'fixed' ? `折扣 ${voucherData.value} 元` : `符合條件商品折扣 ${voucherData.value} ％`;
                        case 'shipment_free':
                            return '免運費';
                        default:
                            return '';
                    }
                })()}`,
                voucherData.overlay ? '可以疊加，套用最大優惠' : '不可疊加',
                `啟用時間：${(_a = voucherData.startDate) !== null && _a !== void 0 ? _a : '未設定日期'} ${(_b = voucherData.startTime) !== null && _b !== void 0 ? _b : '尚未設定時間'}`,
                `結束時間：${(() => {
                    var _a, _b;
                    if (!voucherData.endDate)
                        return '無期限';
                    return `${(_a = voucherData.endDate) !== null && _a !== void 0 ? _a : '未設定日期'} ${(_b = voucherData.endTime) !== null && _b !== void 0 ? _b : '尚未設定時間'}`;
                })()}`,
            ],
            'zh-CN': [
                `活动标题：${voucherData.title && voucherData.title.length > 0 ? voucherData.title : '暂无标题'}`,
                `适用商品：${(() => {
                    const forData = productForList.find((item) => item.value === voucherData.for);
                    return forData ? forData.title : '';
                })()}`,
                `输入代码：${voucherData.code}`,
                `消费条件：${(() => {
                    if (voucherData.rule === 'min_price')
                        return '最低消费金额';
                    if (voucherData.rule === 'min_count')
                        return '最低购买数量';
                    return '';
                })()}`,
                `条件值：${(() => {
                    if (voucherData.rule === 'min_price')
                        return voucherData.ruleValue + ' 元';
                    if (voucherData.rule === 'min_count')
                        return voucherData.ruleValue + ' 个';
                    return '';
                })()}`,
                `折扣优惠：${(() => {
                    switch (voucherData.reBackType) {
                        case 'rebate':
                            return voucherData.method === 'fixed'
                                ? `${voucherData.value} 点 ${glitter.share.rebateConfig.title}`
                                : `符合条件商品总额的 ${voucherData.value}％作为 ${glitter.share.rebateConfig.title}`;
                        case 'discount':
                            return voucherData.method === 'fixed' ? `折扣 ${voucherData.value} 元` : `符合条件商品折扣 ${voucherData.value}％`;
                        case 'shipment_free':
                            return '免运费';
                        default:
                            return '';
                    }
                })()}`,
                voucherData.overlay ? '可以叠加，套用最大优惠' : '不可叠加',
                `启用时间：${(_c = voucherData.startDate) !== null && _c !== void 0 ? _c : '未设置日期'} ${(_d = voucherData.startTime) !== null && _d !== void 0 ? _d : '尚未设置时间'}`,
                `结束时间：${(() => {
                    var _a, _b;
                    if (!voucherData.endDate)
                        return '无限期';
                    return `${(_a = voucherData.endDate) !== null && _a !== void 0 ? _a : '未设置日期'} ${(_b = voucherData.endTime) !== null && _b !== void 0 ? _b : '尚未设置时间'}`;
                })()}`,
            ],
            'en-US': [
                `Campaign Title: ${voucherData.title && voucherData.title.length > 0 ? voucherData.title : 'No Title'}`,
                `Applicable Products: ${(() => {
                    const forData = productForList.find((item) => item.value === voucherData.for);
                    return forData ? forData.title : '';
                })()}`,
                `Code: ${voucherData.code}`,
                `Consumption Conditions: ${(() => {
                    if (voucherData.rule === 'min_price')
                        return 'Minimum Spending Amount';
                    if (voucherData.rule === 'min_count')
                        return 'Minimum Purchase Quantity';
                    return '';
                })()}`,
                `Condition Value: ${(() => {
                    if (voucherData.rule === 'min_price')
                        return `${voucherData.ruleValue} USD`;
                    if (voucherData.rule === 'min_count')
                        return `${voucherData.ruleValue} items`;
                    return '';
                })()}`,
                `Discount: ${(() => {
                    switch (voucherData.reBackType) {
                        case 'rebate':
                            return voucherData.method === 'fixed'
                                ? `${voucherData.value} points ${glitter.share.rebateConfig.title}`
                                : `${voucherData.value}% of qualifying items' total as ${glitter.share.rebateConfig.title}`;
                        case 'discount':
                            return voucherData.method === 'fixed' ? `Discount ${voucherData.value} USD` : `Discount ${voucherData.value}% for qualifying items`;
                        case 'shipment_free':
                            return 'Free Shipping';
                        default:
                            return '';
                    }
                })()}`,
                voucherData.overlay ? 'Stackable, applies the maximum discount' : 'Not stackable',
                `Start Time: ${(_e = voucherData.startDate) !== null && _e !== void 0 ? _e : 'Not Set Date'} ${(_f = voucherData.startTime) !== null && _f !== void 0 ? _f : 'Not Set Time'}`,
                `End Time: ${(() => {
                    var _a, _b;
                    if (!voucherData.endDate)
                        return 'No Deadline';
                    return `${(_a = voucherData.endDate) !== null && _a !== void 0 ? _a : 'Not Set Date'} ${(_b = voucherData.endTime) !== null && _b !== void 0 ? _b : 'Not Set Time'}`;
                })()}`,
            ],
        };
        return translations[Language.getLanguage()];
    }
}
window.glitter.setModule(import.meta.url, UMVoucher);
