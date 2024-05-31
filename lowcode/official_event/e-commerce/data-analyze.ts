import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.typeArray = object.typeArray && Array.isArray(object.typeArray) ? object.typeArray : [];
            return {
                editor: () => {
                    return EditorElem.checkBox({
                        title: '類型',
                        gvc: gvc,
                        def: object.typeArray,
                        array: [
                            { title: '目前活躍人數', value: 'recent_active_user' },
                            { title: '銷售額', value: 'recent_sales' },
                            { title: '訂單數', value: 'recent_orders' },
                            // { title: '累積造訪人數', value: '' },
                            { title: '今日銷售紀錄', value: 'order_today' },
                            { title: '熱銷商品', value: 'hot_products' },
                            { title: '每日訂單平均消費金額', value: 'order_avg_sale_price' },
                            { title: '每月銷售總額', value: 'sales_per_month_1_year' },
                            { title: '每月訂單總量', value: 'orders_per_month_1_year' },
                        ],
                        callback: (array) => {
                            object.typeArray = array;
                        },
                        type: 'multiple',
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        ApiShop.ecDataAnalyze(object.typeArray).then(async (res) => {
                            resolve(res.result ? res.response : {});
                        });
                    });
                },
            };
        },
    };
});
