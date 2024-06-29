import {ShareDialog} from '../dialog/ShareDialog.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {GVC} from '../glitterBundle/GVController.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {ApiPost} from '../glitter-base/route/post.js';

export class ShoppingProductSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm: {
            id: string;
            status: 'list' | 'add' | 'replace';
            dataList: any;
            query: string;
        } = {
            id: glitter.getUUID(),
            status: 'list',
            dataList: undefined,
            query: '',
        };
        let replaceData: any = '';
        return gvc.bindView(() => {
            return {
                dataList: [{obj: vm, key: 'status'}],
                bind: vm.id,
                view: () => {
                    switch (vm.status) {
                        case 'add':
                            return ShoppingProductSetting.editProduct({vm: vm, gvc: gvc, type: 'add'});
                        case 'list':
                            const filterID = gvc.glitter.getUUID();
                            return BgWidget.container(
                                html`
                                    <div class="d-flex w-100 align-items-center" style="margin-bottom: 24px;">
                                        ${BgWidget.title('商品管理')}
                                        <div class="flex-fill"></div>
                                        ${BgWidget.darkButton(
                                                '新增商品',
                                                gvc.event(() => {
                                                    vm.status = 'add';
                                                })
                                        )}
                                    </div>
                                    ${BgWidget.mainCard(
                                            BgWidget.tableV2({
                                                gvc: gvc,
                                                getData: (vmi) => {
                                                    ApiShop.getProduct({
                                                        page: vmi.page - 1,
                                                        limit: 50,
                                                        search: vm.query || undefined,
                                                    }).then((data) => {
                                                        vmi.pageSize = Math.ceil(data.response.total / 50);
                                                        vm.dataList = data.response.data;

                                                        function getDatalist() {
                                                            return data.response.data.map((dd: any) => {
                                                                return [
                                                                    {
                                                                        key: EditorElem.checkBoxOnly({
                                                                            gvc: gvc,
                                                                            def: !data.response.data.find((dd: any) => {
                                                                                return !dd.checked;
                                                                            }),
                                                                            callback: (result) => {
                                                                                data.response.data.map((dd: any) => {
                                                                                    dd.checked = result;
                                                                                });
                                                                                vmi.data = getDatalist();
                                                                                vmi.callback();
                                                                                gvc.notifyDataChange(filterID);
                                                                            },
                                                                        }),
                                                                        value: EditorElem.checkBoxOnly({
                                                                            gvc: gvc,
                                                                            def: dd.checked,
                                                                            callback: (result) => {
                                                                                dd.checked = result;
                                                                                vmi.data = getDatalist();
                                                                                vmi.callback();
                                                                                gvc.notifyDataChange(filterID);
                                                                            },
                                                                            style: 'height:40px;',
                                                                        }),
                                                                    },
                                                                    {
                                                                        key: '商品',
                                                                        value:
                                                                                html`<img
                                                                                        class="rounded border me-4 "
                                                                                        alt=""
                                                                                        src="${dd.content.preview_image[0] || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}"
                                                                                        style="width:40px;height:40px;"
                                                                                />` + dd.content.title,
                                                                    },
                                                                    {
                                                                        key: '狀態',
                                                                        value:
                                                                                dd.content.status === 'active'
                                                                                        ? `<div class="badge badge-success fs-7">啟用中</div>`
                                                                                        : `<div class="badge bg-secondary fs-7">草稿</div>`,
                                                                    },
                                                                    {
                                                                        key: '售價',
                                                                        value: Math.min(
                                                                                ...dd.content.variants.map((dd: any) => {
                                                                                    return dd.sale_price;
                                                                                })
                                                                        ),
                                                                    },
                                                                    {
                                                                        key: '庫存',
                                                                        value: Math.min(
                                                                                ...dd.content.variants.map((dd: any) => {
                                                                                    return dd.stock;
                                                                                })
                                                                        ),
                                                                    },
                                                                    {
                                                                        key: '類別',
                                                                        value: html`
                                                                            <div class="d-flex align-items-center "
                                                                                 style="height:40px;">
                                                                                ${dd.content.collection
                                                                                        .map((dd: any) => {
                                                                                            return `<div class="badge bg-secondary fs-7">${dd}</div>`;
                                                                                        })
                                                                                        .join(`<div class="mx-1"></div>`)}
                                                                            </div>`,
                                                                    },
                                                                ].map((dd) => {
                                                                    dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                                                    return dd;
                                                                });
                                                            });
                                                        }

                                                        vmi.data = getDatalist();
                                                        vmi.loading = false;
                                                        vmi.callback();
                                                    });
                                                },
                                                rowClick: (data, index) => {
                                                    replaceData = vm.dataList[index].content;
                                                    vm.status = 'replace';
                                                },
                                                filter: html`
                                                    ${BgWidget.searchPlace(
                                                            gvc.event((e, event) => {
                                                                vm.query = e.value;
                                                                gvc.notifyDataChange(vm.id);
                                                            }),
                                                            vm.query,
                                                            '搜尋所有商品'
                                                    )}
                                                    ${gvc.bindView(() => {
                                                        return {
                                                            bind: filterID,
                                                            view: () => {
                                                                if (
                                                                        !vm.dataList ||
                                                                        !vm.dataList.find((dd: any) => {
                                                                            return dd.checked;
                                                                        })
                                                                ) {
                                                                    return ``;
                                                                } else {
                                                                    return [
                                                                        html`<span
                                                                                class="fs-7 fw-bold">操作選項</span>`,
                                                                        html`
                                                                            <button
                                                                                    class="btn btn-danger fs-7 px-2"
                                                                                    style="height:30px;border:none;"
                                                                                    onclick="${gvc.event(() => {
                                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                                        dialog.checkYesOrNot({
                                                                                            text: '是否確認移除所選項目?',
                                                                                            callback: (response) => {
                                                                                                if (response) {
                                                                                                    dialog.dataLoading({visible: true});
                                                                                                    ApiShop.delete({
                                                                                                        id: vm.dataList
                                                                                                                .filter((dd: any) => {
                                                                                                                    return dd.checked;
                                                                                                                })
                                                                                                                .map((dd: any) => {
                                                                                                                    return dd.id;
                                                                                                                })
                                                                                                                .join(`,`),
                                                                                                    }).then((res) => {
                                                                                                        dialog.dataLoading({
                                                                                                            visible: false,
                                                                                                        });
                                                                                                        if (res.result) {
                                                                                                            vm.dataList = undefined;
                                                                                                            gvc.notifyDataChange(vm.id);
                                                                                                        } else {
                                                                                                            dialog.errorMessage({
                                                                                                                text: '刪除失敗',
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            },
                                                                                        });
                                                                                    })}"
                                                                            >
                                                                                批量移除
                                                                            </button>`,
                                                                    ].join(``);
                                                                }
                                                            },
                                                            divCreate: () => {
                                                                return {
                                                                    class: `d-flex align-items-center p-2 py-3 ${
                                                                            !vm.dataList ||
                                                                            !vm.dataList.find((dd: any) => {
                                                                                return dd.checked;
                                                                            })
                                                                                    ? `d-none`
                                                                                    : ``
                                                                    }`,
                                                                    style: `height:40px; gap:10px;`,
                                                                };
                                                            },
                                                        };
                                                    })}
                                                `,
                                            })
                                    )}
                                `,
                                BgWidget.getContainerWidth()
                            );
                        case 'replace':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: replaceData,
                            });
                    }
                },
                divCreate: {
                    class: `w-100 h-100`,
                },
            };
        });
    }

    public static editProduct(obj: { vm: any; gvc: GVC; type?: 'add' | 'replace'; defData?: any }) {
        let postMD: {
            id?: string;
            title: string;
            content: string;
            preview_image: string[];
            hideIndex: string;
            collection: string[];
            status: 'active' | 'draft';
            specs: { title: string; option: any }[];
            variants: variant[];
            seo: {
                title: string;
                content: string;
            };
            template: string;
        } = {
            title: '',
            content: '',
            status: 'active',
            collection: [],
            hideIndex: 'false',
            preview_image: [],
            specs: [],
            variants: [],
            seo: {
                title: '',
                content: '',
            },
            template: '',
        };
        if (obj.type === 'replace') {
            postMD = obj.defData;
        }
        const html = String.raw;
        let oneSpecViewID = ["oneSpec", "oneShipment", "oneSetSku"]
        const gvc = obj.gvc;
        const seoID = gvc.glitter.getUUID();
        const variantsViewID = gvc.glitter.getUUID();
        let createPage: any = {
            page: "add",

        }
        interface variant {
            sale_price:number,
            compare_price : number,
            cost:number,
            spec:string[],
            profit : number,
            v_length:number,
            v_width:number,
            v_height:number,
            weight:number,
            shipment_type : "weight" | "none" | "材積為基準",
            sku:string,
            barcode:string,
            stock:number,
            preview_image:string,
            show_understocking:string,
            type : string,

        }

        function generateCombinations(arrays: string[][]): string[] {
            let results: string[] = [''];

            for (const array of arrays) {
                const newResults: string[] = [];
                for (let prefix of results) {
                    for (const item of array) {
                        if (prefix.length > 0 ){
                            newResults.push(prefix + " - " + item);
                        }else{
                            newResults.push(prefix + item);
                        }

                    }
                }
                results = newResults;
            }

            return results;
        }

        function updateVariants() {
            let newSpecs :any = []
            postMD.specs.map((spec)=>{
                let temp:any = []
                spec.option.map((option:any)=>{
                    temp.push(option.title);
                })
                newSpecs.push(temp);
            });
            let result = generateCombinations(newSpecs);
            let newVariants :variant[] = [];
            result.map((variant)=>{
                let temp : variant = {
                    show_understocking: 'false',
                    type: "variants",
                    sale_price:0,
                    compare_price : 0,
                    cost:0,
                    spec:variant.split(" - "),
                    profit : 0,
                    v_length:0,
                    v_width:0,
                    v_height:0,
                    weight:0,
                    shipment_type : "weight",
                    sku:"",
                    barcode:"",
                    stock:0,
                    preview_image:"https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg"
                }
                newVariants.push(temp);
            });
            postMD.variants = newVariants;
            gvc.notifyDataChange(variantsViewID);
        }

        gvc.addStyle(`                    
            .specInput:focus {
                outline: none;
            }
        `)
        return html`
            <div class="d-flex" style="font-size: 16px;color:#393939">
                ${BgWidget.container(
                        html`
                            <div class="d-flex w-100 align-items-center mb-3">
                                ${BgWidget.goBack(
                                        obj.gvc.event(() => {
                                            obj.vm.status = 'list';
                                        })
                                )}
                                ${BgWidget.title(obj.type === 'replace' ? `編輯商品` : `新增商品`)}
                                <div class="flex-fill"></div>
                                <button
                                        class="btn btn-primary-c"
                                        style="height:38px;font-size: 14px;"
                                        onclick="${obj.gvc.event(() => {
                                            setTimeout(() => {
                                                if (obj.type === 'replace') {
                                                    ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
                                                } else {
                                                    ShoppingProductSetting.postEvent(postMD, obj.gvc, obj.vm);
                                                }
                                            }, 500);
                                        })}"
                                >
                                    ${obj.type === 'replace' ? `儲存並更改` : `儲存並新增`}
                                </button>
                            </div>
                            <div class="d-flex flex-column flex-column-reverse flex-md-row w-100" style="gap:10px;">
                                <div>
                                    ${BgWidget.card(
                                            [
                                                EditorElem.editeInput({
                                                    gvc: obj.gvc,
                                                    title: '商品標題',
                                                    default: postMD.title,
                                                    placeHolder: `請輸入標題`,
                                                    callback: (text) => {
                                                        postMD.title = text;
                                                    },
                                                }),
                                                obj.gvc.bindView(() => {
                                                    const bi = obj.gvc.glitter.getUUID();
                                                    return {
                                                        bind: bi,
                                                        view: () => {
                                                            return [
                                                                EditorElem.h3(html`
                                                                    <div class="d-flex align-items-center">
                                                                        商品內文
                                                                        <button
                                                                                class=" btn ms-2 btn-primary-c ms-2"
                                                                                style="height: 30px;width: 60px;"
                                                                                onclick="${obj.gvc.event(() => {
                                                                                    postMD.content = html`<h3
                                                                                            style="padding: 32px 0px;">
                                                                                        商品資訊</h3>

                                                                                    <p>
                                                                                        优雅家居经典绒面椅将为您的家居空间带来一抹优雅和舒适。</p>

                                                                                    <p>
                                                                                        这款椅子结合了现代舒适和经典风格，为您提供了完美的休憩之地。</p>

                                                                                    <p>
                                                                                        绒面面料舒适柔软，而实木框架确保了椅子的坚固性。</p>

                                                                                    <p>
                                                                                        您可以在这把椅子上放松身体和心灵，无论是阅读一本好书还是与家人共度美好时光。</p>

                                                                                    <p>
                                                                                        它的多用途设计使它适用于各种房间和场合，是一个实用且具有装饰性的家居家具选择。</p>
                                                                                    <hr style="margin-top: 48px;"
                                                                                        color="#E0E0E0"/>

                                                                                    <h3 style="padding: 32px 0px;">
                                                                                        商品材質</h3>

                                                                                    <p>坐面：塑膠</p>
                                                                                    <hr style="margin-top: 48px;"
                                                                                        color="#E0E0E0"/>

                                                                                    <h3 style="padding: 32px 0px;">
                                                                                        商品交期</h3>

                                                                                    <p>
                                                                                        標準交期：家具製造商已備妥家具組件，將在接單後直接組裝出貨，預計交期為
                                                                                        5-6 週。</p>

                                                                                    <p>平均交期：家具製造商無現成家具組件，須再加上製造時間，平均交期為
                                                                                        10 至 12 週。</p>

                                                                                    <p>若逢春節期間、國定假日及雙 11
                                                                                        檔期，交期可能會受到影響，建議提早下單，避免久候。</p>
                                                                                    <hr style="margin-top: 48px;"
                                                                                        color="#E0E0E0"/>

                                                                                    <h3 style="padding: 32px 0px;">
                                                                                        商品規格</h3>

                                                                                    <p>長：56 公分</p>

                                                                                    <p>寬：52 公分</p>

                                                                                    <p>高：83.5 公分</p>

                                                                                    <p>座高：48 公分</p>
                                                                                    <hr style="margin-top: 48px;"
                                                                                        color="#E0E0E0"/>

                                                                                    <h3 style="padding: 32px 0px;">
                                                                                        保養資訊</h3>

                                                                                    <p><strong>塑膠</strong></p>

                                                                                    <p>
                                                                                        <span style="font-weight: 400;">清潔時，可使用些許水擦拭並用乾淨的布擦乾。避免日曬。</span>
                                                                                    </p>

                                                                                    <p>
                                                                                        <span style="font-weight: 400;">使用時，應防止硬物碰撞。壁面金屬刷具清潔。</span>
                                                                                    </p>
                                                                                    <hr style="margin-top: 48px;"
                                                                                        color="#E0E0E0"/> `;
                                                                                    obj.gvc.notifyDataChange(bi);
                                                                                })}"
                                                                        >
                                                                            範例
                                                                        </button>
                                                                    </div>`),
                                                                EditorElem.richText({
                                                                    gvc: obj.gvc,
                                                                    def: postMD.content,
                                                                    callback: (text) => {
                                                                        postMD.content = text;
                                                                    },
                                                                    style: "overflow-y: auto;max-height:80vh;"
                                                                }),
                                                            ].join('');
                                                        },
                                                        divCreate: {},
                                                    };
                                                }),
                                            ].join('<div class="my-2"></div>')
                                    )}
                                    <div class="my-2"></div>

                                    ${BgWidget.card(
                                            `
                                <div style="color: #393939;font-size: 16px;font-weight: 700;margin-bottom: 18px;">圖片</div>
                                ${obj.gvc.bindView(() => {
                                                const id = obj.gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return (
                                                                html`
                                                                    <div class="my-2"></div>` +
                                                                EditorElem.flexMediaManagerV2({
                                                                    gvc: obj.gvc,
                                                                    data: postMD.preview_image,
                                                                }) +
                                                                `
                                                        <div style="display: flex;width: 136px;height: 136px;padding: 0px 35px 0px 34px;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;margin-left: 14px;" onclick="${obj.gvc.event(() => {
                                                                    EditorElem.uploadFileFunction({
                                                                        gvc: obj.gvc,
                                                                        callback: (text) => {
                                                                            postMD.preview_image.push(text);
                                                                            obj.gvc.notifyDataChange(id);
                                                                        },
                                                                        type: `image/*, video/*`,
                                                                    });
                                                                })}">
                                                            <div style="display: flex;width: 67px;height: 40px;justify-content: center;align-items: center;gap: 10px;flex-shrink: 0;border-radius: 10px;border: 1px solid #393939;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);">
                                                                新增
                                                                
                                                            </div>
                                                        </div>
                                                    `
                                                        );
                                                    },
                                                    divCreate: {class: `d-flex w-100`, style: `overflow-y:scroll`},
                                                };
                                            })}
                                `
                                    )}
                                    <div class="my-2"></div>
                                    ${gvc.bindView({
                                        bind: "oneSpec",
                                        view: () => {
                                            if (postMD.specs.length < 1) {
                                                return `
                                        ${gvc.bindView({
                                                    bind: "oneSpecPrice",
                                                    view: () => {
                                                        return `
                                        ${BgWidget.mainCard(html`
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;">
                                                                <div style="color:#393939;font-size: 16px;font-weight: 700;">
                                                                    定價
                                                                </div>
                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 10px;align-self: stretch;gap: 18px;">
                                                                    <div style="display: flex;align-items: center;gap: 18px;align-self: stretch;">
                                                                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                                                                            <div style="font-size: 16px;font-weight: 400;">
                                                                                販售價格*
                                                                            </div>
                                                                            <input style="border-radius: 10px;border: 1px solid #DDD;width: 100%;height: 40px;padding: 0px 18px;"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       postMD.variants[0].sale_price = e.value;
                                                                                   })}">
                                                                        </div>
                                                                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                                                                            <div style="font-size: 16px;font-weight: 400;">
                                                                                比較價格*
                                                                            </div>
                                                                            <input style="border-radius: 10px;border: 1px solid #DDD;width: 100%;height: 40px;padding: 0px 18px;"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       postMD.variants[0].compare_price = e.value;
                                                                                   })}">
                                                                        </div>
                                                                    </div>
                                                                    <div style="display: flex;align-items: center;gap: 18px;align-self: stretch;">
                                                                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                                                                            <div style="font-size: 16px;font-weight: 400;">
                                                                                成本
                                                                            </div>
                                                                            <input style="border-radius: 10px;border: 1px solid #DDD;width: 100%;height: 40px;padding: 0px 18px;"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       postMD.variants[0].cost = e.value;
                                                                                   })}">
                                                                        </div>
                                                                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                                                                            <div style="font-size: 16px;font-weight: 400;">
                                                                                利潤
                                                                            </div>
                                                                            <input style="border-radius: 10px;border: 1px solid #DDD;width: 100%;height: 40px;padding: 0px 18px;"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       postMD.variants[0].profit = e.value;
                                                                                   })}">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        `)}
                                        `
                                                    }, divCreate: {}
                                                })}
                                        <div class="my-2"></div>
                                        ${gvc.bindView({
                                                    bind: "oneShipment",
                                                    view: () => {
                                                        return `${BgWidget.mainCard(html`
                                                            <div class=""
                                                                 style="display: flex;flex-direction: column;gap: 18px;font-size: 16px;font-weight: 400;">
                                                                <div style="font-size: 16px;font-weight: 700;">運送
                                                                </div>
                                                                <div class="d-flex align-items-center"
                                                                     style="gap:12px;">
                                                                    <div style="min-width:70px;">運費計算</div>
                                                                    ${BgWidget.select({
                                                                        gvc,
                                                                        callback: (data) => {
                                                                            postMD.variants[0].shipment_type = data 
                                                                        },
                                                                        default: postMD.variants[0]?.shipment_type??"weight",
                                                                        options: [{
                                                                            key: "none",
                                                                            value: "無需運費"
                                                                        }, {
                                                                            key: "weight",
                                                                            value: "重量為基準"
                                                                        }, {key: "volume", value: "材積為基準"}]
                                                                    })}
                                                                </div>
                                                                <div style="width: 100%;gap: 18px;">
                                                                    <div style="display: flex;gap: 8px;flex-direction: column;">
                                                                        <div>商品材積</div>
                                                                        <div style="display: flex;align-items: center;gap: 18px;align-self: stretch;">
                                                                            <div style="display: flex;justify-content: center;align-items: center;gap: 10px;flex: 1 0 0;position: relative;">
                                                                                <div>長度</div>
                                                                                <input style="border-radius: 10px;border: 1px solid #DDD;flex: 1 0 0;height: 40px;"
                                                                                       type="number"
                                                                                       onchange="${gvc.event((e) => {
                                                                                           postMD.variants[0].v_length = e.value;
                                                                                       })}">
                                                                                <div style="color: #8D8D8D;position: absolute;right: 18px;top: 7px;">
                                                                                    公分
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: flex;justify-content: center;align-items: center;gap: 10px;flex: 1 0 0;position: relative;">
                                                                                <div>寬度</div>
                                                                                <input style="border-radius: 10px;border: 1px solid #DDD;flex: 1 0 0;height: 40px;"
                                                                                       type="number"
                                                                                       onchange="${gvc.event((e) => {
                                                                                           postMD.variants[0].v_width = e.value;
                                                                                       })}">
                                                                                <div style="color: #8D8D8D;position: absolute;right: 18px;top: 7px;">
                                                                                    公分
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: flex;justify-content: center;align-items: center;gap: 10px;flex: 1 0 0;position: relative;">
                                                                                <div>高度</div>
                                                                                <input style="border-radius: 10px;border: 1px solid #DDD;flex: 1 0 0;height: 40px;"
                                                                                       type="number"
                                                                                       onchange="${gvc.event((e) => {
                                                                                           postMD.variants[0].v_height = e.value;
                                                                                       })}">
                                                                                <div style="color: #8D8D8D;position: absolute;right: 18px;top: 7px;">
                                                                                    公分
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style="display: flex;gap: 8px;flex-direction: column;margin-top: 18px;">
                                                                        <div>商品重量</div>
                                                                        <div style="display: flex;justify-content: center;align-items: center;gap: 10px;flex: 1 0 0;position: relative;">
                                                                            <input style="border-radius: 10px;border: 1px solid #DDD;flex: 1 0 0;height: 40px;"
                                                                                   type="number"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       postMD.variants[0].weight = e.value;
                                                                                   })}">
                                                                            <div style="color: #8D8D8D;position: absolute;right: 18px;top: 7px;">
                                                                                公斤
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        `)}`
                                                    }, divCreate: {}
                                                })}
                                        <div class="my-2"></div>
                                        ${gvc.bindView({
                                                    bind: "oneSetSku",
                                                    view: () => {
                                                        return `${BgWidget.mainCard(html`
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                <div style="font-size: 16px;font-weight: 700;">
                                                                    庫存管理
                                                                </div>
                                                                <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                                                    <div style="font-weight: 400;font-size: 16px;">存貨單位
                                                                        (SKU)
                                                                    </div>
                                                                    <input style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                           placeholder="請輸入存貨單位"
                                                                           onchange="${gvc.event((e) => {
                                                                               postMD.variants[0].sku = e.value;
                                                                           })}">
                                                                </div>
                                                                <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                                                    <div style="font-weight: 400;font-size: 16px;">商品條碼
                                                                        (ISBN、UPC、GTIN等)
                                                                    </div>
                                                                    <input style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                           placeholder="請輸入商品條碼"
                                                                           onchange="${gvc.event((e) => {
                                                                               postMD.variants[0].barcode = e.value
                                                                           })}">
                                                                </div>
                                                            </div>
                                                        `)}`
                                                    }, divCreate: {}
                                                })}                                 
                                    `
                                            }
                                            return ``
                                        }, divCreate: {}
                                    })}

                                    <div class="my-2"></div>
                                    ${BgWidget.card(
                                            obj.gvc.bindView(() => {
                                                const specid = obj.gvc.glitter.getUUID();

                                                function refresh() {
                                                    obj.gvc.notifyDataChange(specid);
                                                }

                                                return {
                                                    bind: specid,
                                                    dataList: [{obj: createPage, key: "page"}],
                                                    view: () => {
                                                        let returnHTML = ``;
                                                        let editSpectPage: any = []
                                                        if (postMD.specs.length > 0) {

                                                            postMD.specs.map((sepec) => {
                                                                editSpectPage.push({
                                                                    type: "show"
                                                                })
                                                            })
                                                            returnHTML += `
                                                            <div style="color:#393939;font-weight: 700;">商品規格</div>
                                                            ${EditorElem.arrayItem({
                                                                customEditor: true,
                                                                gvc: obj.gvc,
                                                                title: '',
                                                                position: "front",
                                                                height: 100,
                                                                originalArray: postMD.variants,
                                                                expand: true,
                                                                copyable: false,
                                                                hr: true,
                                                                minus: false,
                                                                refreshComponent: () => {
                                                                    obj.gvc.notifyDataChange(variantsViewID);
                                                                },
                                                                array: () => {
                                                                    return postMD.specs.map((dd, specIndex: number) => {
                                                                        let temp: any = {
                                                                            title: "",
                                                                            option: [],
                                                                        }
                                                                        return {
                                                                            title: gvc.bindView({
                                                                                bind: `editSpec${specIndex}`,
                                                                                dataList: [{
                                                                                    obj: editSpectPage[specIndex],
                                                                                    key: "type"
                                                                                }],
                                                                                view: () => {
                                                                                    if (editSpectPage[specIndex].type == "show") {
                                                                                        return html`
                                                                                            <div class="d-flex flex-column"
                                                                                                 style="gap:6px;align-items: flex-start;">
                                                                                                <div style="font-size: 16px;">
                                                                                                    ${dd.title}
                                                                                                </div>
                                                                                                ${(() => {
                                                                                                    let returnHTML = ``
                                                                                                    let selectBTN = undefined;
                                                                                                    dd.option.map((opt: any) => {
                                                                                                        returnHTML += html`
                                                                                                            <div style="border-radius: 5px;background: #F7F7F7;padding: 1px 9px;">
                                                                                                                ${opt.title}
                                                                                                            </div>
                                                                                                        `
                                                                                                    })
                                                                                                    return html`
                                                                                                        <div class="d-flex w-100 "
                                                                                                             style="gap:8px;font-size: 14px;">
                                                                                                            ${returnHTML}
                                                                                                            <div class="position-absolute"
                                                                                                                 style="right:12px;top:50%;transform: translateY(-50%);"
                                                                                                                 onclick="${gvc.event((e) => {
                                                                                                                     selectBTN = e.parentElement.parentElement.parentElement.previousElementSibling;
                                                                                                                     selectBTN.classList.toggle("d-none");
                                                                                                                     editSpectPage[specIndex].type = "edit";
                                                                                                                 })}">
                                                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                                     width="16"
                                                                                                                     height="17"
                                                                                                                     viewBox="0 0 16 17"
                                                                                                                     fill="none">
                                                                                                                    <g clip-path="url(#clip0_8114_2928)">
                                                                                                                        <path d="M1.13728 11.7785L0.418533 14.2191L0.0310334 15.5379C-0.0470916 15.8035 0.0247834 16.0879 0.218533 16.2816C0.412283 16.4754 0.696658 16.5473 0.959158 16.4723L2.28103 16.0816L4.72166 15.3629C5.04666 15.2691 5.34978 15.1129 5.61541 14.9098L5.62478 14.916L5.64041 14.891C5.68416 14.8566 5.72478 14.8223 5.76541 14.7879C5.80916 14.7504 5.84978 14.7098 5.89041 14.6691L15.3967 5.16602C16.081 4.48164 16.1654 3.42852 15.6529 2.65039C15.581 2.54102 15.4935 2.43477 15.3967 2.33789L14.1654 1.10352C13.3842 0.322266 12.1185 0.322266 11.3373 1.10352L1.83103 10.6098C1.75291 10.6879 1.67791 10.7723 1.60916 10.8598L1.58416 10.8754L1.59041 10.8848C1.38728 11.1504 1.23416 11.4535 1.13728 11.7785ZM11.9685 6.46914L6.16853 12.2691L4.61853 11.8816L4.23103 10.3316L10.031 4.53164L11.9685 6.46914ZM3.03103 11.716L3.27166 12.6848C3.33728 12.9535 3.54978 13.1629 3.81853 13.2316L4.78728 13.4723L4.55603 13.8223C4.47478 13.866 4.39041 13.9035 4.30291 13.9285L3.57166 14.1441L1.85603 14.6441L2.35916 12.9316L2.57478 12.2004C2.59978 12.1129 2.63728 12.0254 2.68103 11.9473L3.03103 11.716ZM9.85291 7.33477C10.0467 7.14102 10.0467 6.82227 9.85291 6.62852C9.65916 6.43477 9.34041 6.43477 9.14666 6.62852L6.14666 9.62852C5.95291 9.82227 5.95291 10.141 6.14666 10.3348C6.34041 10.5285 6.65916 10.5285 6.85291 10.3348L9.85291 7.33477Z"
                                                                                                                              fill="#393939"/>
                                                                                                                    </g>
                                                                                                                    <defs>
                                                                                                                        <clipPath
                                                                                                                                id="clip0_8114_2928">
                                                                                                                            <rect width="16"
                                                                                                                                  height="16"
                                                                                                                                  fill="white"
                                                                                                                                  transform="translate(0 0.5)"/>
                                                                                                                        </clipPath>
                                                                                                                    </defs>
                                                                                                                </svg>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    `
                                                                                                })()}
                                                                                            </div>`
                                                                                    }
                                                                                    temp = JSON.parse(JSON.stringify(dd)) ;

                                                                                    return html`
                                                                                        <div style="display: flex;padding: 20px;flex-direction: column;align-items: flex-end;gap: 24px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;">
                                                                                            <div style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;">
                                                                                                <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
                                                                                                    <div class="w-100"
                                                                                                         style="display: flex;gap: 8px;flex-direction: column;">
                                                                                                        <div style="width: 70px">
                                                                                                            規格種類
                                                                                                        </div>
                                                                                                        <input class="w-100"
                                                                                                               style="height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                               placeholder="例如 : 顏色、大小"
                                                                                                               value="${dd.title}"
                                                                                                               onchange="${gvc.event((e) => {
                                                                                                                   temp.title = e?.value ?? ""
                                                                                                               })}">
                                                                                                    </div>

                                                                                                    ${gvc.bindView({
                                                                                                        bind: "specEdit",
                                                                                                        view: () => {

                                                                                                            return html`
                                                                                                                <div class="w-100"
                                                                                                                     style="">
                                                                                                                    選項
                                                                                                                    (輸入完請按enter)
                                                                                                                </div>

                                                                                                                <div class="w-100 d-flex align-items-center position-relative"
                                                                                                                     style="line-height: 40px;height: 40px;padding: 3px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px;">
                                                                                                                    <div class="d-flex align-items-center "
                                                                                                                         style="gap: 10px;">
                                                                                                                        ${(() => {
                                                                                                                            let tempHTML = ``
                                                                                                                            temp.option.map((data: any, index: number) => {
                                                                                                                                tempHTML += html`
                                                                                                                                    <div class="d-flex align-items-center"
                                                                                                                                         style="height: 22px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;">
                                                                                                                                        ${data.title}<i
                                                                                                                                            class="fa-solid fa-xmark"
                                                                                                                                            style="font-size: 12px;cursor: pointer;"
                                                                                                                                            onclick="${gvc.event(() => {
                                                                                                                                                temp.option.splice(index, 1);
                                                                                                                                                gvc.notifyDataChange('specEdit');
                                                                                                                                            })}"></i>
                                                                                                                                    </div>
                                                                                                                                `
                                                                                                                            })
                                                                                                                            return tempHTML
                                                                                                                        })()}
                                                                                                                    </div>
                                                                                                                    <input class="flex-fill d-flex align-items-center border-0 specInput h-100"
                                                                                                                           placeholder="${(() => {
                                                                                                                               return (temp.option.length > 0) ? '請繼續輸入' : ''
                                                                                                                           })()}"
                                                                                                                           onchange="${gvc.event((e) => {
                                                                                                                               temp.option.push({
                                                                                                                                   title: e.value,
                                                                                                                               })
                                                                                                                               gvc.notifyDataChange('specEdit')
                                                                                                                           })}">

                                                                                                                    <div class="d-flex align-items-center ${(() => {
                                                                                                                        return (temp.option.length > 0) ? 'd-none' : ''
                                                                                                                    })()}"
                                                                                                                         style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0"
                                                                                                                         onclick="${gvc.event((e) => {
                                                                                                                             e.classList.add("d-none");
                                                                                                                             setTimeout(() => {
                                                                                                                                 (document.querySelector('.specInput') as HTMLButtonElement)!.focus();
                                                                                                                             }, 100)

                                                                                                                         })}">
                                                                                                                        例如
                                                                                                                        :
                                                                                                                        黑色、S號
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            `
                                                                                                        },
                                                                                                        divCreate: {
                                                                                                            class: "w-100",
                                                                                                            style: "display: flex;gap: 8px;flex-direction: column;"
                                                                                                        }
                                                                                                    })}


                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="d-flex w-100 justify-content-end align-items-center w-100"
                                                                                                 style="gap:14px;">
                                                                                                <button class="d-flex align-items-center justify-content-center"
                                                                                                        style="width:48px;height:34px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-weight: 700;"
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            editSpectPage[specIndex].type = "show";
                                                                                                        })}">
                                                                                                    取消
                                                                                                </button>
                                                                                                <button class="d-flex align-items-center justify-content-center"
                                                                                                        style="width:48px;height:34px;border-radius: 10px;border: 1px solid #393939;background: #393939;color: #FFF;font-weight: 700;"
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            updateVariants();
                                                                                                        })}">
                                                                                                    完成
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>


                                                                                    `
                                                                                },
                                                                                divCreate: {class: `w-100 position-relative`}
                                                                            }),
                                                                            innerHtml: (gvc: GVC) => {
                                                                                return ``;
                                                                            },
                                                                            editTitle: `編輯規格`,
                                                                        };
                                                                    });
                                                                }
                                                            })}
                                                            `
                                                        }
                                                        if (createPage.page == "add") {
                                                            returnHTML += html`
                                                                <div style="width:100%;display:flex;align-items: center;justify-content: center;color: #36B;gap:6px;cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         // postMD.specs.push({
                                                                         //     title: '',
                                                                         //     option: [],
                                                                         // });
                                                                         // obj.gvc.notifyDataChange([id]);
                                                                         // obj.gvc.notifyDataChange("oneSpec")
                                                                         createPage.page = "edit"
                                                                     })}">
                                                                    新增規格
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14"
                                                                         height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M1.5 7.23926H12.5" stroke="#3366BB"
                                                                              stroke-width="2" stroke-linecap="round"
                                                                              stroke-linejoin="round"/>
                                                                        <path d="M6.76172 1.5L6.76172 12.5"
                                                                              stroke="#3366BB" stroke-width="2"
                                                                              stroke-linecap="round"
                                                                              stroke-linejoin="round"/>
                                                                    </svg>
                                                                </div>
                                                            `
                                                        } else if (createPage.page == "edit") {
                                                            let temp: any = {
                                                                title: "",
                                                                option: [],
                                                            }
                                                            returnHTML += html`
                                                                ${BgWidget.mainCard(html`
                                                                    <div style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;">
                                                                        <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
                                                                            <div class="w-100"
                                                                                 style="display: flex;gap: 8px;flex-direction: column;">
                                                                                <div style="width: 70px">規格種類</div>
                                                                                <input class="w-100"
                                                                                       style="height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                       placeholder="例如 : 顏色、大小"
                                                                                       onchange="${gvc.event((e) => {
                                                                                           temp.title = e?.value ?? ""
                                                                                       })}">
                                                                            </div>

                                                                            ${gvc.bindView({
                                                                                bind: "specInput",
                                                                                view: () => {

                                                                                    return html`
                                                                                        <div class="w-100" style="">選項
                                                                                            (輸入完請按enter)
                                                                                        </div>

                                                                                        <div class="w-100 d-flex align-items-center position-relative"
                                                                                             style="line-height: 40px;height: 40px;padding: 3px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px;">
                                                                                            <div class="d-flex align-items-center "
                                                                                                 style="gap: 10px;">
                                                                                                ${(() => {
                                                                                                    let tempHTML = ``
                                                                                                    temp.option.map((data: any, index: number) => {
                                                                                                        tempHTML += html`
                                                                                                            <div class="d-flex align-items-center"
                                                                                                                 style="height: 22px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;">
                                                                                                                ${data.title}<i
                                                                                                                    class="fa-solid fa-xmark"
                                                                                                                    style="font-size: 12px;cursor: pointer;"
                                                                                                                    onclick="${gvc.event(() => {
                                                                                                                        temp.option.splice(index, 1);
                                                                                                                        gvc.notifyDataChange('specInput');
                                                                                                                    })}"></i>
                                                                                                            </div>
                                                                                                        `
                                                                                                    })
                                                                                                    return tempHTML
                                                                                                })()}
                                                                                            </div>
                                                                                            <input class="flex-fill d-flex align-items-center border-0 specInput h-100"
                                                                                                   placeholder="${(() => {
                                                                                                       return (temp.option.length > 0) ? '請繼續輸入' : ''
                                                                                                   })()}"
                                                                                                   onchange="${gvc.event((e) => {
                                                                                                       temp.option.push({
                                                                                                           title: e.value,
                                                                                                       })
                                                                                                       gvc.notifyDataChange('specInput')
                                                                                                   })}">

                                                                                            <div class="d-flex align-items-center ${(() => {
                                                                                                return (temp.option.length > 0) ? 'd-none' : ''
                                                                                            })()}"
                                                                                                 style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0"
                                                                                                 onclick="${gvc.event((e) => {
                                                                                                     e.classList.add("d-none");
                                                                                                     setTimeout(() => {
                                                                                                         (document.querySelector('.specInput') as HTMLButtonElement)!.focus();
                                                                                                     }, 100)

                                                                                                 })}">例如 : 黑色、S號
                                                                                            </div>
                                                                                        </div>
                                                                                    `
                                                                                },
                                                                                divCreate: {
                                                                                    class: "w-100",
                                                                                    style: "display: flex;gap: 8px;flex-direction: column;"
                                                                                }
                                                                            })}


                                                                        </div>
                                                                    </div>
                                                                `)}
                                                                <div class="d-flex w-100 justify-content-end align-items-center w-100"
                                                                     style="gap:14px;">
                                                                    <button class="d-flex align-items-center justify-content-center"
                                                                            style="width:48px;height:34px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-weight: 700;"
                                                                            onclick="${gvc.event(() => {
                                                                                createPage.page = "add";
                                                                            })}">
                                                                        取消
                                                                    </button>
                                                                    <button class="d-flex align-items-center justify-content-center"
                                                                            style="width:48px;height:34px;border-radius: 10px;border: 1px solid #393939;background: #393939;color: #FFF;font-weight: 700;"
                                                                            onclick="${gvc.event(() => {
                                                                                postMD.specs.push(temp)
                                                                                updateVariants()
                                                                                createPage.page = "add";
                                                                                
                                                                            })}">
                                                                        完成
                                                                    </button>
                                                                </div>
                                                            `
                                                        }


                                                        return returnHTML;
                                                    }, divCreate: {class: `d-flex flex-column`, style: `gap:18px;`},
                                                }

                                                // return {
                                                //     bind: specid,
                                                //     view: () => {
                                                //         return [
                                                //             EditorElem.h3('商品規格'),
                                                //             EditorElem.arrayItem({
                                                //                 gvc: obj.gvc,
                                                //                 title: '',
                                                //                 array: () => {
                                                //                     return postMD.specs.map((dd) => {
                                                //                         dd.option = dd.option ?? [];
                                                //                         return {
                                                //                             title: html`
                                                //                                 <div class="d-flex flex-column w-100 ps-2"
                                                //                                      style="gap:5px;">
                                                //                                     <span>${dd.title || '尚未設定規格名稱'}</span>
                                                //                                     <div class="d-flex">
                                                //                                         ${dd.option
                                                //                                                 .map((d2: any) => {
                                                //                                                     return `<div class="badge bg-secondary">${d2.title}</div>`;
                                                //                                                 })
                                                //                                                 .join('<div class="mx-1"></div>')}
                                                //                                     </div>
                                                //                                 </div>`,
                                                //                             innerHtml: (gvc: GVC) => {
                                                //                                 refresh();
                                                //                                 return [
                                                //                                     EditorElem.editeInput({
                                                //                                         gvc: gvc,
                                                //                                         title: '分類標題',
                                                //                                         default: dd.title ?? '',
                                                //                                         placeHolder: ``,
                                                //                                         callback: (text: string) => {
                                                //                                             dd.title = text;
                                                //                                             refresh();
                                                //                                         },
                                                //                                     }),
                                                //                                     html`
                                                //                                         <div class="mx-n2 mt-2">
                                                //                                             ${EditorElem.arrayItem({
                                                //                                                 gvc: obj.gvc,
                                                //                                                 title: '分類選項',
                                                //                                                 array: () => {
                                                //                                                     return dd.option.map((d2: any) => {
                                                //                                                         return {
                                                //                                                             title: html`
                                                //                                                                 <div class="px-2 w-100">
                                                //                                                                     ${EditorElem.editeInput({
                                                //                                                                         gvc: gvc,
                                                //                                                                         title: '',
                                                //                                                                         default: d2.title ?? '',
                                                //                                                                         placeHolder: ``,
                                                //                                                                         callback: (text: string) => {
                                                //                                                                             if (dd.option.filter((x: { title: string }) => x.title === text).length == 1) {
                                                //                                                                                 alert('已存在相同名稱的規格');
                                                //                                                                                 d2.title = '';
                                                //                                                                                 gvc.recreateView();
                                                //                                                                             } else {
                                                //                                                                                 d2.title = text;
                                                //                                                                                 refresh();
                                                //                                                                             }
                                                //                                                                         },
                                                //                                                                     })}
                                                //                                                                 </div>`,
                                                //                                                             innerHtml: () => {
                                                //                                                                 return ``;
                                                //                                                             },
                                                //                                                         };
                                                //                                                     });
                                                //                                                 },
                                                //                                                 height: 50,
                                                //                                                 customEditor: true,
                                                //                                                 originalArray: dd.option,
                                                //                                                 expand: true,
                                                //                                                 plus: {
                                                //                                                     title: '添加選項',
                                                //                                                     event: obj.gvc.event(() => {
                                                //                                                         dd.option.push({title: ''});
                                                //                                                         gvc.recreateView();
                                                //                                                     }),
                                                //                                                 },
                                                //                                                 refreshComponent: () => {
                                                //                                                     gvc.recreateView();
                                                //                                                 },
                                                //                                             })}
                                                //                                         </div>`,
                                                //                                 ].join('');
                                                //                             },
                                                //                             editTitle: `編輯規格`,
                                                //                         };
                                                //                     });
                                                //                 },
                                                //                 height: 60,
                                                //                 originalArray: postMD.specs,
                                                //                 expand: true,
                                                //                 plus: {
                                                //                     title: '添加規格',
                                                //                     event: obj.gvc.event(() => {
                                                //                         postMD.specs.push({
                                                //                             title: '',
                                                //                             option: [],
                                                //                         });
                                                //                         obj.gvc.notifyDataChange([specid, ...oneSpecViewID]);
                                                //                     }),
                                                //                 },
                                                //                 refreshComponent: () => {
                                                //                     const remove_indexs: number[] = [];
                                                //
                                                //                     let complexity = 1;
                                                //                     postMD.specs.map((spec) => {
                                                //                         complexity *= spec.option.length;
                                                //                     });
                                                //
                                                //                     const cType: string[][] = [];
                                                //
                                                //                     function generateCombinations(specs: any, currentCombination: any, index = 0) {
                                                //                         if (
                                                //                                 index === specs.length &&
                                                //                                 currentCombination.length > 0 &&
                                                //                                 cType.findIndex((ct: string[]) => {
                                                //                                     return JSON.stringify(ct) === JSON.stringify(currentCombination);
                                                //                                 }) === -1
                                                //                         ) {
                                                //                             cType.push(JSON.parse(JSON.stringify(currentCombination)));
                                                //                             return;
                                                //                         }
                                                //                         const currentSpecOptions = specs[index];
                                                //                         if (currentSpecOptions) {
                                                //                             for (const option of currentSpecOptions) {
                                                //                                 currentCombination[index] = option;
                                                //                                 generateCombinations(specs, currentCombination, index + 1);
                                                //                             }
                                                //                         }
                                                //                     }
                                                //
                                                //                     function checkSpecInclude(spec: string, index: number) {
                                                //                         if (postMD.specs[index]) {
                                                //                             for (const {title} of postMD.specs[index].option) {
                                                //                                 if (spec === title) return true;
                                                //                             }
                                                //                             return false;
                                                //                         }
                                                //                         return false;
                                                //                     }
                                                //
                                                //                     for (let n = 0; n < complexity; n++) {
                                                //                         let currentCombination: any = [];
                                                //                         generateCombinations(
                                                //                                 postMD.specs.map((dd) => {
                                                //                                     return dd.option.map((dd: any) => {
                                                //                                         return dd.title;
                                                //                                     });
                                                //                                 }),
                                                //                                 currentCombination
                                                //                         );
                                                //
                                                //                         const waitAdd = cType.find((dd: any) => {
                                                //                             return !postMD.variants.find((d2) => {
                                                //                                 return JSON.stringify(d2.spec) === JSON.stringify(dd);
                                                //                             });
                                                //                         });
                                                //
                                                //                         if (waitAdd) {
                                                //                             postMD.variants.push({
                                                //                                 shipment_type: "none",
                                                //                                 v_width: 0,
                                                //                                 v_height: 0,
                                                //                                 v_length: 0,
                                                //                                 weight: 0,
                                                //                                 spec: waitAdd,
                                                //                                 sale_price: 0,
                                                //                                 compare_price: 0,
                                                //                                 stock: 0,
                                                //                                 sku: '',
                                                //                                 preview_image: '',
                                                //                                 shipment_weight: 0,
                                                //                                 show_understocking: 'true',
                                                //                             });
                                                //                         }
                                                //                     }
                                                //
                                                //                     if (postMD.variants && postMD.variants.length > 0) {
                                                //                         postMD.variants.map((variant: any, index1: number) => {
                                                //                             if (variant.spec.length !== postMD.specs.length) {
                                                //                                 remove_indexs.push(index1);
                                                //                             }
                                                //                             variant.spec.map((sp: string, index2: number) => {
                                                //                                 if (!checkSpecInclude(sp, index2)) {
                                                //                                     remove_indexs.push(index1);
                                                //                                 }
                                                //                             });
                                                //                         });
                                                //                     }
                                                //
                                                //                     postMD.variants = postMD.variants.filter((variant, index) => {
                                                //                         return !remove_indexs.includes(index);
                                                //                     });
                                                //
                                                //                     obj.gvc.notifyDataChange(specid);
                                                //                     obj.gvc.notifyDataChange(variantsViewID);
                                                //                 },
                                                //             }),
                                                //         ].join('');
                                                //     },
                                                //     divCreate: {},
                                                // };
                                            })
                                    )}
                                    <div class="my-2"></div>
                                    ${BgWidget.mainCard(
                                            `<div style="font-size: 16px;font-weight: 700;color:#393939;margin-bottom: 18px;">規格設定</div>` +
                                            obj.gvc.bindView(() => {
                                                function refresh() {
                                                    obj.gvc.notifyDataChange(variantsViewID);
                                                }

                                                return {
                                                    bind: variantsViewID,
                                                    view: () => {
                                                        const wi = 'calc(70% / 6)';

                                                        return new Promise(async (resolve, reject) => {
                                                            let shipmentSetting: { basic_fee: number; weight: number } = {
                                                                basic_fee: 0,
                                                                weight: 0,
                                                            };
                                                            const saasConfig: {
                                                                config: any;
                                                                api: any;
                                                            } = (window.parent as any).saasConfig;
                                                            const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
                                                            if (data.response.result[0]) {
                                                                shipmentSetting = data.response.result[0].value;
                                                            }
                                                            resolve(
                                                                    gvc.bindView({
                                                                        bind:"",
                                                                        view : ()=>{
                                                                            return [
                                                                                gvc.bindView({
                                                                                    bind : "selectFunRow",
                                                                                    view:()=>{
                                                                                        return `
                                                                                            <div style="border-radius: 3px;border: 1px solid #DDD;width: 16px;height: 16px;margin-right:96px;"></div>
                                                                                            <div style="flex:1 0 0;font-size: 16px;font-weight: 400;">規格</div>
                                                                                            <div style="color:#393939;font-size: 16px;font-weight: 400;width: 30%; ">販售價格*</div>
                                                                                            <div style="color:#393939;font-size: 16px;font-weight: 400;width: 30%;">存貨數量*</div>
                                                                                        `
                                                                                    },divCreate:{style:`border-radius: 10px;border: 1px solid #DDD;width: 100%;display: flex;height: 40px;padding: 8px 17px 8px 18px;align-items: center;`}
                                                                                })
                                                                            ].join('')
                                                                            return  [
                                                                                html`
                                                                            <div class="w-100 bgf6 py-1 d-flex align-items-center">
                                                                                <div style="width: 26%; text-align: center;">
                                                                                    子類
                                                                                </div>
                                                                                <div style="width:${wi};">販售價格</div>
                                                                                <div style="width:${wi};">比較價格</div>
                                                                                <div style="width:${wi};">存貨數量</div>
                                                                                <div style="width:${wi};">存貨SKU</div>
                                                                                <div style="width:${wi}; margin-left: 10px;">
                                                                                    運費權重
                                                                                </div>
                                                                                <div style="width:${wi};"></div>
                                                                            </div>`,
                                                                                EditorElem.arrayItem({
                                                                                    customEditor: true,
                                                                                    gvc: obj.gvc,
                                                                                    title: '',
                                                                                    array: () => {
                                                                                        let addTemp : variant[] = [{
                                                                                            sale_price: 0,
                                                                                            compare_price: 0,
                                                                                            cost: 0,
                                                                                            spec: [],
                                                                                            profit: 0,
                                                                                            v_length: 0,
                                                                                            v_width: 0,
                                                                                            v_height: 0,
                                                                                            weight: 0,
                                                                                            shipment_type: "none",
                                                                                            sku: "",
                                                                                            barcode: "",
                                                                                            stock: 0,
                                                                                            preview_image: "",
                                                                                            show_understocking: "",
                                                                                            type: ""
                                                                                        }];

                                                                                        postMD.variants =
                                                                                                postMD.variants.length == 0
                                                                                                        ? addTemp
                                                                                                        : postMD.variants;

                                                                                        return postMD.variants.map((dd) => {
                                                                                            const wi = `calc(100% / 6 + 47px);`;
                                                                                            const defaultImage = 'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg';
                                                                                            return {
                                                                                                title: html`
                                                                                            <div class="d-flex align-items-center p-0 px-2"
                                                                                                 style="gap:10px;">
                                                                                                ${[
                                                                                                    html`
                                                                                                        <div
                                                                                                                class="rounded border"
                                                                                                                style="width: calc(100% / 7); height: 40px; background-size: cover; background-position: center; background-repeat: no-repeat; background-image: url('${dd.preview_image &&
                                                                                                    dd.preview_image.length > 0
                                                                                                            ? dd.preview_image
                                                                                                            : defaultImage}'); "
                                                                                                        ></div>`,
                                                                                                    html`
                                                                                                        <div style="width: 40%; max-width: 40%; white-space:normal;">
                                                                                                            ${dd.spec.join('-') || postMD.title}
                                                                                                        </div>`,
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: obj.gvc,
                                                                                                        title: '',
                                                                                                        default: `${dd.sale_price ?? 0}`,
                                                                                                        placeHolder: '',
                                                                                                        type: 'number',
                                                                                                        callback: (text) => {
                                                                                                            dd.sale_price = parseInt(text, 10);
                                                                                                        },
                                                                                                        style: `width:${wi};`,
                                                                                                    }),
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: obj.gvc,
                                                                                                        title: '',
                                                                                                        default: `${dd.compare_price ?? 0}`,
                                                                                                        placeHolder: '',
                                                                                                        type: 'number',
                                                                                                        callback: (text) => {
                                                                                                            dd.compare_price = parseInt(text, 10);
                                                                                                        },
                                                                                                        style: `width:${wi};`,
                                                                                                    }),
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: obj.gvc,
                                                                                                        title: '',
                                                                                                        default: `${dd.stock ?? 0}`,
                                                                                                        placeHolder: '',
                                                                                                        type: 'number',
                                                                                                        callback: (text) => {
                                                                                                            dd.stock = parseInt(text, 10);
                                                                                                        },
                                                                                                        style: `width:${wi};`,
                                                                                                    }),
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: obj.gvc,
                                                                                                        title: '',
                                                                                                        default: `${dd.sku ?? 0}`,
                                                                                                        placeHolder: '',
                                                                                                        type: 'text',
                                                                                                        callback: (text) => {
                                                                                                            dd.sku = text;
                                                                                                        },
                                                                                                        style: `width: 30%`,
                                                                                                    }),

                                                                                                ].join('')}
                                                                                                <button
                                                                                                        class="btn ms-2 btn-primary-c ms-2"
                                                                                                        style="height: 38px;"
                                                                                                        onclick="${obj.gvc.event(() => {
                                                                                                    obj.gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                        return html`
                                                                                                                    <div
                                                                                                                            class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                                                                                                                            style="z-index:999999;400px;"
                                                                                                                            onclick="${gvc.event((e: any, event: any) => {
                                                                                                            event.preventDefault();
                                                                                                            event.stopPropagation();
                                                                                                        })}"
                                                                                                                    >
                                                                                                                        <div class="d-flex align-items-center px-2 border-bottom"
                                                                                                                             style="height:50px;min-width:400px;">
                                                                                                                            <h3 style="font-size:15px;font-weight:500;"
                                                                                                                                class="m-0">
                                                                                                                                ${`編輯內容`}</h3>
                                                                                                                            <div class="flex-fill"></div>
                                                                                                                            <div
                                                                                                                                    class="hoverBtn p-2"
                                                                                                                                    data-bs-toggle="dropdown"
                                                                                                                                    aria-haspopup="true"
                                                                                                                                    aria-expanded="false"
                                                                                                                                    style="color:black;font-size:20px;"
                                                                                                                                    onclick="${gvc.event((e: any, event: any) => {
                                                                                                            gvc.closeDialog();
                                                                                                            refresh();
                                                                                                        })}"
                                                                                                                            >
                                                                                                                                <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div class="px-2 pb-2 pt-2"
                                                                                                                             style="max-height:calc(100vh - 150px);overflow-y:auto;">
                                                                                                                            ${[
                                                                                                            EditorElem.editeInput({
                                                                                                                gvc: obj.gvc,
                                                                                                                title: '商品規格',
                                                                                                                default: dd.spec.join('-') || postMD.title,
                                                                                                                placeHolder: '',
                                                                                                                type: 'text',
                                                                                                                callback: () => {
                                                                                                                },
                                                                                                                readonly: true,
                                                                                                            }),
                                                                                                            EditorElem.uploadImage({
                                                                                                                title: '商品圖片',
                                                                                                                gvc: obj.gvc,
                                                                                                                def: dd.preview_image ?? '',
                                                                                                                callback: (text) => {
                                                                                                                    dd.preview_image = text;
                                                                                                                    gvc.recreateView();
                                                                                                                },
                                                                                                            }),
                                                                                                            EditorElem.editeInput({
                                                                                                                gvc: obj.gvc,
                                                                                                                title: '販售價格',
                                                                                                                default: `${dd.sale_price ?? 0}`,
                                                                                                                placeHolder: '',
                                                                                                                type: 'number',
                                                                                                                callback: (text) => {
                                                                                                                    dd.sale_price = parseInt(text, 10);
                                                                                                                },
                                                                                                            }),
                                                                                                            EditorElem.editeInput({
                                                                                                                gvc: obj.gvc,
                                                                                                                title: '比較價格',
                                                                                                                default: `${dd.compare_price ?? 0}`,
                                                                                                                placeHolder: '',
                                                                                                                type: 'number',
                                                                                                                callback: (text) => {
                                                                                                                    dd.compare_price = parseInt(text, 10);
                                                                                                                },
                                                                                                            }),
                                                                                                            EditorElem.checkBox({
                                                                                                                title: '無存貨購買狀態',
                                                                                                                gvc: gvc,
                                                                                                                def: dd.show_understocking ?? 'true',
                                                                                                                array: [
                                                                                                                    {
                                                                                                                        title: '存貨為0時，顯示庫存不足',
                                                                                                                        value: 'true',
                                                                                                                    },
                                                                                                                    {
                                                                                                                        title: '存貨為0時，依然可購買',
                                                                                                                        value: 'false',
                                                                                                                    },
                                                                                                                ],
                                                                                                                callback: (text) => {
                                                                                                                    dd.show_understocking = text;
                                                                                                                },
                                                                                                            }),
                                                                                                            EditorElem.editeInput({
                                                                                                                gvc: obj.gvc,
                                                                                                                title: '存貨數量',
                                                                                                                default: `${dd.stock ?? 0}`,
                                                                                                                placeHolder: '',
                                                                                                                type: 'number',
                                                                                                                callback: (text) => {
                                                                                                                    dd.stock = parseInt(text, 10);
                                                                                                                },
                                                                                                            }),
                                                                                                            EditorElem.editeInput({
                                                                                                                gvc: obj.gvc,
                                                                                                                title: 'SKU',
                                                                                                                default: `${dd.sku ?? 0}`,
                                                                                                                placeHolder: '',
                                                                                                                type: 'text',
                                                                                                                callback: (text) => {
                                                                                                                    dd.sku = text;
                                                                                                                },
                                                                                                            }),
                                                                                                        ].join('')}
                                                                                                                        </div>
                                                                                                                    </div>`;
                                                                                                    }, obj.gvc.glitter.getUUID());
                                                                                                })}"
                                                                                                >
                                                                                                    編輯商品
                                                                                                </button>
                                                                                            </div>`,
                                                                                                innerHtml: (gvc: GVC) => {
                                                                                                    return [].join('');
                                                                                                },
                                                                                                editTitle: `編輯規格`,
                                                                                            };
                                                                                        });
                                                                                    },
                                                                                    height: 100,
                                                                                    originalArray: postMD.variants,
                                                                                    expand: true,
                                                                                    copyable: false,
                                                                                    hr: true,
                                                                                    minus: false,
                                                                                    refreshComponent: () => {
                                                                                        obj.gvc.notifyDataChange(variantsViewID);
                                                                                    },
                                                                                }),
                                                                            ].join('')
                                                                        },divCreate:{}
                                                                    })
                                                                   
                                                            );
                                                        });
                                                    },
                                                    divCreate: {
                                                        class: '',
                                                        style: 'overflow: auto',
                                                    },
                                                };
                                            })
                                    )}
                                    <div class="my-2"></div>
                                    ${BgWidget.card(
                                            obj.gvc.bindView(() => {
                                                postMD.seo = postMD.seo ?? {
                                                    title: '',
                                                    content: '',
                                                };
                                                const id = seoID;
                                                let toggle = false;
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        try {
                                                            let view = [
                                                                html`
                                                                    <div class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2">
                                                                        搜尋引擎列表
                                                                        <div
                                                                                class="fw-500 fs-sm ${toggle ? `d-none` : ``}"
                                                                                style="cursor: pointer;color:rgba(0, 91, 211, 1);"
                                                                                onclick="${obj.gvc.event(() => {
                                                                                    toggle = !toggle;
                                                                                    obj.gvc.notifyDataChange(id);
                                                                                })}"
                                                                        >
                                                                            編輯
                                                                        </div>
                                                                    </div>`,
                                                                html`
                                                                    <div class="fs-6 fw-500" style="color:#1a0dab;">
                                                                        ${postMD.seo.title || '尚未設定'}
                                                                    </div>`,
                                                                (() => {
                                                                    const href = (() => {
                                                                        const url = new URL(
                                                                                '',
                                                                                (window.parent as any).glitter.share.editorViewModel.domain
                                                                                        ? `https://${(window.parent as any).glitter.share.editorViewModel.domain}/`
                                                                                        : (window.parent as any).location.href
                                                                        );
                                                                        url.search = '';
                                                                        url.searchParams.set('page', postMD.template);
                                                                        url.searchParams.set('product_id', postMD.id || '');
                                                                        if (!(window.parent as any).glitter.share.editorViewModel.domain) {
                                                                            url.searchParams.set('appName', (window.parent as any).appName);
                                                                        }
                                                                        return url.href;
                                                                    })();
                                                                    return html`<a class="fs-sm fw-500"
                                                                                   style="color:#006621;cursor: pointer;"
                                                                                   href="${href}">${href}</a>`;
                                                                })(),
                                                                html`
                                                                    <div class="fs-sm fw-500"
                                                                         style="color:#545454;white-space: normal;">
                                                                        ${postMD.seo.content || '尚未設定'}
                                                                    </div>`,
                                                            ];
                                                            if (toggle) {
                                                                view = view.concat([
                                                                    EditorElem.editeInput({
                                                                        gvc: obj.gvc,
                                                                        title: '頁面標題',
                                                                        default: postMD.seo.title,
                                                                        placeHolder: `請輸入頁面標題`,
                                                                        callback: (text) => {
                                                                            postMD.seo.title = text;
                                                                        },
                                                                    }),
                                                                    EditorElem.editeText({
                                                                        gvc: obj.gvc,
                                                                        title: '中繼描述',
                                                                        default: postMD.seo.content,
                                                                        placeHolder: `請輸入中繼描述`,
                                                                        callback: (text) => {
                                                                            postMD.seo.content = text;
                                                                        },
                                                                    }),
                                                                ]);
                                                            }
                                                            return view.join('');
                                                        } catch (e) {
                                                            console.log(e);
                                                            return ``;
                                                        }
                                                    },
                                                };
                                            })
                                    )}
                                </div>
                                <div style="min-width:300px; max-width:100%;">
                                    ${BgWidget.card(
                                            html` ${postMD.id ? `${EditorElem.h3('商品ID')}${postMD.id}` : ``}` +
                                            EditorElem.select({
                                                gvc: obj.gvc,
                                                title: '商品狀態',
                                                def: postMD.status,
                                                array: [
                                                    {title: '啟用', value: 'active'},
                                                    {title: '草稿', value: 'draft'},
                                                ],
                                                callback: (text: any) => {
                                                    postMD.status = text;
                                                },
                                            })
                                    )}
                                    <div class="mt-2"></div>
                                    ${BgWidget.card(
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return EditorElem.pageSelect(
                                                                gvc,
                                                                '選擇佈景主題',
                                                                postMD.template ?? '',
                                                                (data) => {
                                                                    postMD.template = data;
                                                                },
                                                                (dd) => {
                                                                    const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type === 'product';
                                                                    if (filter_result && !postMD.template) {
                                                                        postMD.template = dd.tag;
                                                                        gvc.notifyDataChange([seoID, id]);
                                                                    }
                                                                    return filter_result;
                                                                }
                                                        );
                                                    },
                                                };
                                            })
                                    )}
                                    <div class="mt-2"></div>
                                    ${BgWidget.card(
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return EditorElem.select({
                                                            title: '是否支援商品搜尋',
                                                            gvc: gvc,
                                                            def: (postMD.hideIndex as any) ?? 'false',
                                                            array: [
                                                                {
                                                                    title: '是',
                                                                    value: 'false',
                                                                },
                                                                {
                                                                    title: '否',
                                                                    value: 'true',
                                                                },
                                                            ],
                                                            callback: (text) => {
                                                                postMD.hideIndex = text;
                                                            },
                                                        });
                                                    },
                                                };
                                            })
                                    )}
                                    <div class="mt-2"></div>
                                    ${BgWidget.card(
                                            obj.gvc.bindView(() => {
                                                const id = obj.gvc.glitter.getUUID();

                                                function refresh() {
                                                    obj.gvc.notifyDataChange(id);
                                                }

                                                function selectCollection(callback: (cb: { select: string; gvc: GVC }) => void) {
                                                    ApiShop.getCollection().then((res) => {
                                                        EditorElem.openEditorDialog(
                                                                obj.gvc,
                                                                (gvc: GVC) => {
                                                                    function convertF(x: any, ind: string) {
                                                                        return x
                                                                                .map((dd: any) => {
                                                                                    const indt = ind ? `${ind} / ${dd.title}` : dd.title;
                                                                                    if (dd.array && dd.array.length > 0) {
                                                                                        return html`
                                                                                            <li class="btn-group d-flex flex-column"
                                                                                                style="margin-top:1px;margin-bottom:1px;">
                                                                                                <div
                                                                                                        class="editor_item d-flex pe-2 my-0 hi me-n1 "
                                                                                                        style=""
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            dd.toogle = !dd.toogle;
                                                                                                            gvc.recreateView();
                                                                                                        })}"
                                                                                                >
                                                                                                    <div class="subBt ps-0 ms-n2">
                                                                                                        ${dd.toogle
                                                                                                                ? html`
                                                                                                                    <i class="fa-sharp fa-regular fa-chevron-down"></i>`
                                                                                                                : html`
                                                                                                                    <i class="fa-regular fa-angle-right hoverBtn "></i>`}
                                                                                                    </div>
                                                                                                    ${dd.title}
                                                                                                    <div class="flex-fill"></div>
                                                                                                </div>
                                                                                                <ul class="ps-2 ${dd.toogle ? `` : `d-none`}">
                                                                                                    ${convertF(dd.array, indt)}
                                                                                                </ul>
                                                                                            </li>`;
                                                                                    } else {
                                                                                        return html`
                                                                                            <li class="btn-group d-flex flex-column"
                                                                                                style="margin-top:1px;margin-bottom:1px;">
                                                                                                <div
                                                                                                        class="editor_item d-flex   pe-2 my-0 hi  "
                                                                                                        style=""
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            if (
                                                                                                                    postMD.collection.find((dd) => {
                                                                                                                        return dd === indt;
                                                                                                                    })
                                                                                                            ) {
                                                                                                                alert('已有此標籤。');
                                                                                                                return;
                                                                                                            }
                                                                                                            callback({
                                                                                                                select: indt,
                                                                                                                gvc: gvc,
                                                                                                            });
                                                                                                        })}"
                                                                                                >
                                                                                                    ${dd.title}
                                                                                                    <div class="flex-fill"></div>

                                                                                                    <div class="subBt ">
                                                                                                        <i
                                                                                                                class="fa-duotone fa-check d-flex align-items-center justify-content-center subBt "
                                                                                                                style="width:15px;height:15px;"
                                                                                                        ></i>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </li>`;
                                                                                    }
                                                                                })
                                                                                .join('');
                                                                    }

                                                                    return gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                return convertF(res.response.value, '');
                                                                            },
                                                                            divCreate: {
                                                                                class: `ms-n3 me-1`,
                                                                            },
                                                                        };
                                                                    });
                                                                },
                                                                () => {
                                                                },
                                                                400,
                                                                '設定商品分類'
                                                        );
                                                    });
                                                }

                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return [
                                                            EditorElem.h3('商品系列'),
                                                            html`
                                                                <div class="mx-n3">
                                                                    ${EditorElem.arrayItem({
                                                                        gvc: obj.gvc,
                                                                        title: '',
                                                                        array: () => {
                                                                            return postMD.collection.map((dd, index) => {
                                                                                return {
                                                                                    title: dd || '尚未設定分類名稱',
                                                                                    innerHtml: (gvc: GVC) => {
                                                                                        selectCollection((cf) => {
                                                                                            postMD.collection[index] = cf.select;
                                                                                            refresh();
                                                                                            cf.gvc.closeDialog();
                                                                                        });
                                                                                        return ``;
                                                                                    },
                                                                                    editTitle: `編輯分類`,
                                                                                };
                                                                            });
                                                                        },
                                                                        height: 38,
                                                                        originalArray: postMD.collection,
                                                                        expand: true,
                                                                        copyable: false,
                                                                        customEditor: true,
                                                                        plus: {
                                                                            title: '添加商品分類',
                                                                            event: obj.gvc.event(() => {
                                                                                selectCollection((cb) => {
                                                                                    postMD.collection.push(cb.select);
                                                                                    obj.gvc.notifyDataChange(id);
                                                                                    cb.gvc.closeDialog();
                                                                                });
                                                                            }),
                                                                        },
                                                                        refreshComponent: () => {
                                                                            obj.gvc.notifyDataChange(id);
                                                                        },
                                                                    })}
                                                                </div>`,
                                                        ].join('');
                                                    },
                                                    divCreate: {},
                                                };
                                            })
                                    )}
                                    <div class="d-flex align-items-center justify-content-end">
                                        <button
                                                class="btn btn-danger mt-3 ${obj.type === 'replace' ? `` : `d-none`}  ms-auto px-2"
                                                style="height:30px;width:100px;"
                                                onclick="${obj.gvc.event(() => {
                                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認刪除商品?',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({visible: true});
                                                                ApiShop.delete({
                                                                    id: postMD.id!,
                                                                }).then((res) => {
                                                                    dialog.dataLoading({visible: false});
                                                                    if (res.result) {
                                                                        obj.vm.status = 'list';
                                                                    } else {
                                                                        dialog.errorMessage({text: '刪除失敗'});
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    });
                                                })}"
                                        >
                                            刪除商品
                                        </button>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        `,
                        1200
                )}
            </div>`;
    }

    public static putEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({text: '商品上傳中...', visible: true});
        postMD.type = 'product';
        ApiPost.put({
            postData: postMD,
            token: (window.parent as any).config.token,
            type: 'manager',
        }).then((re) => {
            dialog.dataLoading({visible: false});
            if (re.result) {
                dialog.successMessage({text: `更改成功`});
            } else {
                dialog.errorMessage({text: `上傳失敗`});
            }
        });
    }

    public static postEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({text: '商品上傳中...', visible: true});
        postMD.type = 'product';
        ApiPost.post({
            postData: postMD,
            token: (window.parent as any).config.token,
            type: 'manager',
        }).then((re) => {
            dialog.dataLoading({visible: false});
            if (re.result) {
                vm.status = 'list';
                dialog.successMessage({text: `上傳成功`});
            } else {
                dialog.errorMessage({text: `上傳失敗`});
            }
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingProductSetting);
