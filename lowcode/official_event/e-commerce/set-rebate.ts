import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.rebate = object.rebate ?? {};
            object.rebateError = object.rebateError ?? {};
            object.rebateSuccess = object.rebateSuccess ?? {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.rebate, {
                            hover: false,
                            option: [],
                            title: '購物金來源',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateSuccess, {
                            hover: false,
                            option: [],
                            title: '購物金使用成功',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateError, {
                            hover: false,
                            option: [],
                            title: '購物金使用失敗',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise(async (resolve) => {
                        const triggerRebate =
                            (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.rebate,
                                element: element,
                            })) || 0;
                        const defaultRebate = (await ApiShop.getRebateValue()) || 0;
                        const voucherCode = await ApiShop.getVoucherCode();

                        ApiShop.getRebate({}).then(async (reb) => {
                            const remainRebate = reb.response?.sum ?? 0;

                            ApiShop.getCart().then(async (res: any) => {
                                const cartData: {
                                    line_items: {
                                        sku: string;
                                        spec: string[];
                                        stock: number;
                                        sale_price: number;
                                        compare_price: number;
                                        preview_image: string;
                                        title: string;
                                        id: number;
                                        count: number;
                                    }[];
                                    total: number;
                                } = {
                                    line_items: [],
                                    total: 0,
                                };

                                for (const b of Object.keys(res)) {
                                    cartData.line_items.push({
                                        id: b.split('-')[0] as any,
                                        count: res[b] as number,
                                        spec: b.split('-').filter((dd, index) => index !== 0),
                                    } as any);
                                }

                                const rebate = triggerRebate ?? defaultRebate;
                                ApiShop.getCheckout({
                                    line_items: cartData.line_items.map((dd) => {
                                        return {
                                            id: dd.id,
                                            spec: dd.spec,
                                            count: dd.count,
                                        };
                                    }),
                                    code: voucherCode as string,
                                    use_rebate: parseInt(rebate as string, 10),
                                }).then(async (res) => {
                                    const data = res.response?.data;
                                    const useRebate = typeof rebate === 'string' ? parseInt(`${rebate}`, 10) : 0;
                                    const subtotal = data.total - data.shipment_fee + data.use_rebate;

                                    if (subtotal > 0 && useRebate >= 0 && subtotal >= useRebate && remainRebate >= useRebate) {
                                        ApiShop.setRebateValue(`${rebate}`);
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: object.rebateSuccess,
                                            subData: res.response.data,
                                            element: element,
                                        });
                                    } else {
                                        ApiShop.setRebateValue('');
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: object.rebateError,
                                            subData: res.response.data,
                                            element: element,
                                        });
                                    }
                                    resolve(res.response.data);
                                });
                            });
                        });
                    });
                },
            };
        },
    };
});
