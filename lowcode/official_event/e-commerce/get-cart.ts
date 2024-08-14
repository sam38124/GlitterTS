import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.pd_from = object.pd_from ?? 'local';
            object.pd_data = object.pd_data ?? {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let view: any = [
                                    EditorElem.select({
                                        title: '商品來源',
                                        gvc: gvc,
                                        def: object.pd_from,
                                        array: [
                                            { title: '本地購物車', value: 'local' },
                                            { title: '自定義', value: 'custom' },
                                        ],
                                        callback: (text) => {
                                            object.pd_from = text;
                                            gvc.notifyDataChange(id);
                                        },
                                    }),
                                ];
                                if (object.pd_from === 'custom') {
                                    view.push(TriggerEvent.editer(gvc, widget, object.pd_data, { title: '設定商品來源', hover: false, option: [] }));
                                }
                                return view.join('');
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        (object.pd_from === 'custom'
                            ? () => {
                                  return TriggerEvent.trigger({
                                      gvc: gvc,
                                      widget: widget,
                                      clickEvent: object.pd_data,
                                      subData: subData,
                                  });
                              }
                            : ApiShop.getCart)().then(async (res: any) => {
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
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0;
                                    }) as any,
                                } as any);
                            }
                            const voucher = await ApiShop.getVoucherCode();
                            const rebate = (await ApiShop.getRebateValue()) || 0;
                            const distributionCode = localStorage.getItem('distributionCode') ?? '';
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                code: voucher as string,
                                use_rebate: GlobalUser.token && parseInt(rebate as string, 10),
                                distribution_code: distributionCode,
                            }).then((res) => {
                                if (res.result) {
                                    resolve(res.response.data);
                                } else {
                                    resolve([]);
                                }
                            });
                        });
                    });
                },
            };
        },
    };
});
