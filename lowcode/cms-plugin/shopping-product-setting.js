var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
export class ShoppingProductSetting {
    static main(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            status: 'list',
            dataList: undefined,
            query: '',
        };
        let replaceData = '';
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                dataList: [{ obj: vm, key: 'status' }],
                bind: id,
                view: () => {
                    switch (vm.status) {
                        case 'add':
                            return ShoppingProductSetting.editProduct({ vm: vm, gvc: gvc, type: 'add' });
                        case 'list':
                            const filterID = gvc.glitter.getUUID();
                            return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center mb-3">
                                    ${BgWidget.title('商品管理')}
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c"
                                        style="height:45px;font-size: 14px;"
                                        onclick="${gvc.event(() => {
                                vm.status = 'add';
                            })}"
                                    >
                                        新增商品
                                    </button>
                                </div>
                                ${BgWidget.table({
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
                                            return data.response.data.map((dd) => {
                                                return [
                                                    {
                                                        key: EditorElem.checkBoxOnly({
                                                            gvc: gvc,
                                                            def: !data.response.data.find((dd) => {
                                                                return !dd.checked;
                                                            }),
                                                            callback: (result) => {
                                                                data.response.data.map((dd) => {
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
                                                        value: html `<img
                                                                    class="rounded border me-4 "
                                                                    alt=""
                                                                    src="${dd.content.preview_image[0] || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}"
                                                                    style="width:40px;height:40px;"
                                                                />` + dd.content.title,
                                                    },
                                                    {
                                                        key: '狀態',
                                                        value: dd.content.status === 'active'
                                                            ? `<div class="badge badge-success fs-7">啟用中</div>`
                                                            : `<div class="badge bg-secondary fs-7">草稿</div>`,
                                                    },
                                                    {
                                                        key: '售價',
                                                        value: Math.min(...dd.content.variants.map((dd) => {
                                                            return dd.sale_price;
                                                        })),
                                                    },
                                                    {
                                                        key: '庫存',
                                                        value: Math.min(...dd.content.variants.map((dd) => {
                                                            return dd.stock;
                                                        })),
                                                    },
                                                    {
                                                        key: '類別',
                                                        value: html `<div class="d-flex align-items-center " style="height:40px;">
                                                                ${dd.content.collection
                                                            .map((dd) => {
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
                                filter: html `
                                        <div style="height:50px;" class="w-100 border-bottom">
                                            <input
                                                class="form-control h-100 "
                                                style="border: none;"
                                                placeholder="搜尋所有商品"
                                                onchange="${gvc.event((e, event) => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(id);
                                })}"
                                                value="${vm.query}"
                                            />
                                        </div>
                                        ${gvc.bindView(() => {
                                    return {
                                        bind: filterID,
                                        view: () => {
                                            if (!vm.dataList ||
                                                !vm.dataList.find((dd) => {
                                                    return dd.checked;
                                                })) {
                                                return ``;
                                            }
                                            else {
                                                return [
                                                    html `<span class="fs-7 fw-bold">操作選項</span>`,
                                                    html `<button
                                                                class="btn btn-danger fs-7 px-2"
                                                                style="height:30px;border:none;"
                                                                onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            text: '是否確認移除所選項目?',
                                                            callback: (response) => {
                                                                if (response) {
                                                                    dialog.dataLoading({ visible: true });
                                                                    ApiShop.delete({
                                                                        id: vm.dataList
                                                                            .filter((dd) => {
                                                                            return dd.checked;
                                                                        })
                                                                            .map((dd) => {
                                                                            return dd.id;
                                                                        })
                                                                            .join(`,`),
                                                                    }).then((res) => {
                                                                        dialog.dataLoading({
                                                                            visible: false,
                                                                        });
                                                                        if (res.result) {
                                                                            vm.dataList = undefined;
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                        else {
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
                                                class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                    !vm.dataList.find((dd) => {
                                                        return dd.checked;
                                                    })
                                                    ? `d-none`
                                                    : ``}`,
                                                style: `height:40px; gap:10px;`,
                                            };
                                        },
                                    };
                                })}
                                    `,
                            })}
                            `);
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
    static editProduct(obj) {
        let postMD = {
            title: '',
            content: '',
            status: 'active',
            collection: [],
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
        const gvc = obj.gvc;
        const seoID = gvc.glitter.getUUID();
        const variantsViewID = gvc.glitter.getUUID();
        return html ` <div class="d-flex">
            ${BgWidget.container(html `<div class="d-flex w-100 align-items-center mb-3">
                        ${BgWidget.goBack(obj.gvc.event(() => {
            obj.vm.status = 'list';
        }))}
                        ${BgWidget.title(obj.type === 'replace' ? `編輯商品` : `新增商品`)}
                        <div class="flex-fill"></div>
                        <button
                            class="btn btn-primary-c"
                            style="height:38px;font-size: 14px;"
                            onclick="${obj.gvc.event(() => {
            setTimeout(() => {
                if (obj.type === 'replace') {
                    ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
                }
                else {
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
                            ${BgWidget.card([
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
                            EditorElem.h3(html `<div class="d-flex align-items-center">
                                                        商品內文<button
                                                            class=" btn ms-2 btn-primary-c ms-2"
                                                            style="height: 30px;width: 60px;"
                                                            onclick="${obj.gvc.event(() => {
                                postMD.content = html `<h3 style="padding: 32px 0px;">商品資訊</h3>

                                                                    <p>优雅家居经典绒面椅将为您的家居空间带来一抹优雅和舒适。</p>

                                                                    <p>这款椅子结合了现代舒适和经典风格，为您提供了完美的休憩之地。</p>

                                                                    <p>绒面面料舒适柔软，而实木框架确保了椅子的坚固性。</p>

                                                                    <p>您可以在这把椅子上放松身体和心灵，无论是阅读一本好书还是与家人共度美好时光。</p>

                                                                    <p>它的多用途设计使它适用于各种房间和场合，是一个实用且具有装饰性的家居家具选择。</p>
                                                                    <hr style="margin-top: 48px;" color="#E0E0E0" />

                                                                    <h3 style="padding: 32px 0px;">商品材質</h3>

                                                                    <p>坐面：塑膠</p>
                                                                    <hr style="margin-top: 48px;" color="#E0E0E0" />

                                                                    <h3 style="padding: 32px 0px;">商品交期</h3>

                                                                    <p>標準交期：家具製造商已備妥家具組件，將在接單後直接組裝出貨，預計交期為 5-6 週。</p>

                                                                    <p>平均交期：家具製造商無現成家具組件，須再加上製造時間，平均交期為 10 至 12 週。</p>

                                                                    <p>若逢春節期間、國定假日及雙 11 檔期，交期可能會受到影響，建議提早下單，避免久候。</p>
                                                                    <hr style="margin-top: 48px;" color="#E0E0E0" />

                                                                    <h3 style="padding: 32px 0px;">商品規格</h3>

                                                                    <p>長：56 公分</p>

                                                                    <p>寬：52 公分</p>

                                                                    <p>高：83.5 公分</p>

                                                                    <p>座高：48 公分</p>
                                                                    <hr style="margin-top: 48px;" color="#E0E0E0" />

                                                                    <h3 style="padding: 32px 0px;">保養資訊</h3>

                                                                    <p><strong>塑膠</strong></p>

                                                                    <p>
                                                                        <span style="font-weight: 400;">清潔時，可使用些許水擦拭並用乾淨的布擦乾。避免日曬。</span>
                                                                    </p>

                                                                    <p>
                                                                        <span style="font-weight: 400;">使用時，應防止硬物碰撞。壁面金屬刷具清潔。</span>
                                                                    </p>
                                                                    <hr style="margin-top: 48px;" color="#E0E0E0" /> `;
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
                            }),
                        ].join('');
                    },
                    divCreate: {},
                };
            }),
        ].join('<div class="my-2"></div>'))}
                            <div class="my-2"></div>
                            ${BgWidget.card(obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return (EditorElem.h3(html ` <div class="d-flex align-items-center" style="gap:10px;">
                                                    多媒體檔案
                                                    <div
                                                        class="d-flex align-items-center justify-content-center rounded-3"
                                                        style="height: 30px;width: 80px;
"
                                                    >
                                                        <button
                                                            class="btn ms-2 btn-primary-c ms-2"
                                                            style="height: 30px;width: 80px;"
                                                            onclick="${obj.gvc.event(() => {
                        EditorElem.uploadFileFunction({
                            gvc: obj.gvc,
                            callback: (text) => {
                                postMD.preview_image.push(text);
                                obj.gvc.notifyDataChange(id);
                            },
                            type: `image/*, video/*`,
                        });
                    })}"
                                                        >
                                                            添加檔案
                                                        </button>
                                                    </div>
                                                </div>`) +
                        html ` <div class="my-2"></div>` +
                        EditorElem.flexMediaManager({
                            gvc: obj.gvc,
                            data: postMD.preview_image,
                        }));
                },
                divCreate: {},
            };
        }))}
                            <div class="my-2"></div>
                            ${BgWidget.card(obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            function refresh() {
                obj.gvc.notifyDataChange(id);
            }
            return {
                bind: id,
                view: () => {
                    return [
                        EditorElem.h3('商品規格'),
                        EditorElem.arrayItem({
                            gvc: obj.gvc,
                            title: '',
                            array: () => {
                                return postMD.specs.map((dd) => {
                                    var _a;
                                    dd.option = (_a = dd.option) !== null && _a !== void 0 ? _a : [];
                                    return {
                                        title: html `<div class="d-flex flex-column w-100 ps-2" style="gap:5px;">
                                                                    <span>${dd.title || '尚未設定規格名稱'}</span>
                                                                    <div class="d-flex">
                                                                        ${dd.option
                                            .map((d2) => {
                                            return `<div class="badge bg-secondary">${d2.title}</div>`;
                                        })
                                            .join('<div class="mx-1"></div>')}
                                                                    </div>
                                                                </div>`,
                                        innerHtml: (gvc) => {
                                            var _a;
                                            refresh();
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '分類標題',
                                                    default: (_a = dd.title) !== null && _a !== void 0 ? _a : '',
                                                    placeHolder: ``,
                                                    callback: (text) => {
                                                        dd.title = text;
                                                        refresh();
                                                    },
                                                }),
                                                html `<div class="mx-n2 mt-2">
                                                                            ${EditorElem.arrayItem({
                                                    gvc: obj.gvc,
                                                    title: '分類選項',
                                                    array: () => {
                                                        return dd.option.map((d2) => {
                                                            var _a;
                                                            return {
                                                                title: html `<div class="px-2 w-100">
                                                                                                ${EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    default: (_a = d2.title) !== null && _a !== void 0 ? _a : '',
                                                                    placeHolder: ``,
                                                                    callback: (text) => {
                                                                        if (dd.option.filter((x) => x.title === text).length == 1) {
                                                                            alert('已存在相同名稱的規格');
                                                                            d2.title = '';
                                                                            gvc.recreateView();
                                                                        }
                                                                        else {
                                                                            d2.title = text;
                                                                            refresh();
                                                                        }
                                                                    },
                                                                })}
                                                                                            </div>`,
                                                                innerHtml: () => {
                                                                    return ``;
                                                                },
                                                            };
                                                        });
                                                    },
                                                    height: 50,
                                                    customEditor: true,
                                                    originalArray: dd.option,
                                                    expand: true,
                                                    plus: {
                                                        title: '添加選項',
                                                        event: obj.gvc.event(() => {
                                                            dd.option.push({ title: '' });
                                                            gvc.recreateView();
                                                        }),
                                                    },
                                                    refreshComponent: () => {
                                                        gvc.recreateView();
                                                    },
                                                })}
                                                                        </div>`,
                                            ].join('');
                                        },
                                        editTitle: `編輯規格`,
                                    };
                                });
                            },
                            height: 60,
                            originalArray: postMD.specs,
                            expand: true,
                            plus: {
                                title: '添加規格',
                                event: obj.gvc.event(() => {
                                    postMD.specs.push({
                                        title: '',
                                        option: [],
                                    });
                                    obj.gvc.notifyDataChange(id);
                                }),
                            },
                            refreshComponent: () => {
                                const remove_indexs = [];
                                let complexity = 1;
                                postMD.specs.map((spec) => {
                                    complexity *= spec.option.length;
                                });
                                const cType = [];
                                function generateCombinations(specs, currentCombination, index = 0) {
                                    if (index === specs.length &&
                                        currentCombination.length > 0 &&
                                        cType.findIndex((ct) => {
                                            return JSON.stringify(ct) === JSON.stringify(currentCombination);
                                        }) === -1) {
                                        cType.push(JSON.parse(JSON.stringify(currentCombination)));
                                        return;
                                    }
                                    const currentSpecOptions = specs[index];
                                    if (currentSpecOptions) {
                                        for (const option of currentSpecOptions) {
                                            currentCombination[index] = option;
                                            generateCombinations(specs, currentCombination, index + 1);
                                        }
                                    }
                                }
                                function checkSpecInclude(spec, index) {
                                    if (postMD.specs[index]) {
                                        for (const { title } of postMD.specs[index].option) {
                                            if (spec === title)
                                                return true;
                                        }
                                        return false;
                                    }
                                    return false;
                                }
                                for (let n = 0; n < complexity; n++) {
                                    let currentCombination = [];
                                    generateCombinations(postMD.specs.map((dd) => {
                                        return dd.option.map((dd) => {
                                            return dd.title;
                                        });
                                    }), currentCombination);
                                    const waitAdd = cType.find((dd) => {
                                        return !postMD.variants.find((d2) => {
                                            return JSON.stringify(d2.spec) === JSON.stringify(dd);
                                        });
                                    });
                                    if (waitAdd) {
                                        postMD.variants.push({
                                            spec: waitAdd,
                                            sale_price: 0,
                                            compare_price: 0,
                                            stock: 0,
                                            sku: '',
                                            preview_image: '',
                                            shipment_weight: 0,
                                            show_understocking: 'true',
                                        });
                                    }
                                }
                                if (postMD.variants && postMD.variants.length > 0) {
                                    postMD.variants.map((variant, index1) => {
                                        if (variant.spec.length !== postMD.specs.length) {
                                            remove_indexs.push(index1);
                                        }
                                        variant.spec.map((sp, index2) => {
                                            if (!checkSpecInclude(sp, index2)) {
                                                remove_indexs.push(index1);
                                            }
                                        });
                                    });
                                }
                                postMD.variants = postMD.variants.filter((variant, index) => {
                                    return !remove_indexs.includes(index);
                                });
                                obj.gvc.notifyDataChange(id);
                                obj.gvc.notifyDataChange(variantsViewID);
                            },
                        }),
                    ].join('');
                },
                divCreate: {},
            };
        }))}
                            <div class="my-2"></div>
                            ${BgWidget.card(EditorElem.h3('商品項目') +
            obj.gvc.bindView(() => {
                function refresh() {
                    obj.gvc.notifyDataChange(variantsViewID);
                }
                return {
                    bind: variantsViewID,
                    view: () => {
                        const wi = 'calc(70% / 6)';
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            let shipmentSetting = {
                                basic_fee: 0,
                                weight: 0,
                            };
                            const saasConfig = window.parent.saasConfig;
                            const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
                            if (data.response.result[0]) {
                                shipmentSetting = data.response.result[0].value;
                            }
                            resolve([
                                html `<div class="w-100 bgf6 py-1 d-flex align-items-center">
                                                                <div style="width: 26%; text-align: center;">子類</div>
                                                                <div style="width:${wi};">販售價格</div>
                                                                <div style="width:${wi};">比較價格</div>
                                                                <div style="width:${wi};">存貨數量</div>
                                                                <div style="width:${wi};">存貨SKU</div>
                                                                <div style="width:${wi}; margin-left: 10px;">運費權重</div>
                                                                <div style="width:${wi};"></div>
                                                            </div>`,
                                EditorElem.arrayItem({
                                    customEditor: true,
                                    gvc: obj.gvc,
                                    title: '',
                                    array: () => {
                                        return postMD.variants.map((dd) => {
                                            var _a, _b, _c, _d, _e;
                                            const wi = `calc(100% / 6 + 47px);`;
                                            const defaultImage = 'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg';
                                            return {
                                                title: html `<div class="d-flex align-items-center p-0 px-2" style="gap:10px;">
                                                                                ${[
                                                    html `<div
                                                                                        class="rounded border"
                                                                                        style="width: calc(100% / 7); height: 40px; background-size: cover; background-position: center; background-repeat: no-repeat; background-image: url('${dd.preview_image &&
                                                        dd.preview_image.length > 0
                                                        ? dd.preview_image
                                                        : defaultImage}'); "
                                                                                    ></div>`,
                                                    html `<div style="width: 40%; max-width: 40%; white-space:normal;">${dd.spec.join('-') || postMD.title}</div>`,
                                                    EditorElem.editeInput({
                                                        gvc: obj.gvc,
                                                        title: '',
                                                        default: `${(_a = dd.sale_price) !== null && _a !== void 0 ? _a : 0}`,
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
                                                        default: `${(_b = dd.compare_price) !== null && _b !== void 0 ? _b : 0}`,
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
                                                        default: `${(_c = dd.stock) !== null && _c !== void 0 ? _c : 0}`,
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
                                                        default: `${(_d = dd.sku) !== null && _d !== void 0 ? _d : 0}`,
                                                        placeHolder: '',
                                                        type: 'text',
                                                        callback: (text) => {
                                                            dd.sku = text;
                                                        },
                                                        style: `width: 30%`,
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: obj.gvc,
                                                        title: '',
                                                        default: `${(_e = dd.shipment_weight) !== null && _e !== void 0 ? _e : 0}`,
                                                        placeHolder: '',
                                                        type: 'number',
                                                        callback: (text) => {
                                                            dd.shipment_weight = parseInt(text, 10);
                                                        },
                                                        style: `width:${wi};`,
                                                    }),
                                                ].join('')}
                                                                                <button
                                                                                    class="btn ms-2 btn-primary-c ms-2"
                                                                                    style="height: 38px;"
                                                                                    onclick="${obj.gvc.event(() => {
                                                    obj.gvc.glitter.innerDialog((gvc) => {
                                                        var _a, _b, _c, _d, _e, _f;
                                                        return html ` <div
                                                                                                class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                                                                                                style="z-index:999999;400px;"
                                                                                                onclick="${gvc.event((e, event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        })}"
                                                                                            >
                                                                                                <div class="d-flex align-items-center px-2 border-bottom" style="height:50px;min-width:400px;">
                                                                                                    <h3 style="font-size:15px;font-weight:500;" class="m-0">${`編輯內容`}</h3>
                                                                                                    <div class="flex-fill"></div>
                                                                                                    <div
                                                                                                        class="hoverBtn p-2"
                                                                                                        data-bs-toggle="dropdown"
                                                                                                        aria-haspopup="true"
                                                                                                        aria-expanded="false"
                                                                                                        style="color:black;font-size:20px;"
                                                                                                        onclick="${gvc.event((e, event) => {
                                                            gvc.closeDialog();
                                                            refresh();
                                                        })}"
                                                                                                    >
                                                                                                        <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="px-2 pb-2 pt-2" style="max-height:calc(100vh - 150px);overflow-y:auto;">
                                                                                                    ${[
                                                            EditorElem.editeInput({
                                                                gvc: obj.gvc,
                                                                title: '商品規格',
                                                                default: dd.spec.join('-') || postMD.title,
                                                                placeHolder: '',
                                                                type: 'text',
                                                                callback: () => { },
                                                                readonly: true,
                                                            }),
                                                            EditorElem.uploadImage({
                                                                title: '商品圖片',
                                                                gvc: obj.gvc,
                                                                def: (_a = dd.preview_image) !== null && _a !== void 0 ? _a : '',
                                                                callback: (text) => {
                                                                    dd.preview_image = text;
                                                                    gvc.recreateView();
                                                                },
                                                            }),
                                                            EditorElem.editeInput({
                                                                gvc: obj.gvc,
                                                                title: '販售價格',
                                                                default: `${(_b = dd.sale_price) !== null && _b !== void 0 ? _b : 0}`,
                                                                placeHolder: '',
                                                                type: 'number',
                                                                callback: (text) => {
                                                                    dd.sale_price = parseInt(text, 10);
                                                                },
                                                            }),
                                                            EditorElem.editeInput({
                                                                gvc: obj.gvc,
                                                                title: '比較價格',
                                                                default: `${(_c = dd.compare_price) !== null && _c !== void 0 ? _c : 0}`,
                                                                placeHolder: '',
                                                                type: 'number',
                                                                callback: (text) => {
                                                                    dd.compare_price = parseInt(text, 10);
                                                                },
                                                            }),
                                                            EditorElem.checkBox({
                                                                title: '無存貨購買狀態',
                                                                gvc: gvc,
                                                                def: (_d = dd.show_understocking) !== null && _d !== void 0 ? _d : 'true',
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
                                                                default: `${(_e = dd.stock) !== null && _e !== void 0 ? _e : 0}`,
                                                                placeHolder: '',
                                                                type: 'number',
                                                                callback: (text) => {
                                                                    dd.stock = parseInt(text, 10);
                                                                },
                                                            }),
                                                            EditorElem.editeInput({
                                                                gvc: obj.gvc,
                                                                title: 'SKU',
                                                                default: `${(_f = dd.sku) !== null && _f !== void 0 ? _f : 0}`,
                                                                placeHolder: '',
                                                                type: 'text',
                                                                callback: (text) => {
                                                                    dd.sku = text;
                                                                },
                                                            }),
                                                            (() => {
                                                                var _a;
                                                                return EditorElem.editeInput({
                                                                    gvc: obj.gvc,
                                                                    title: html ` <div class="d-flex flex-column">
                                                                                                                    <span>運費權重</span>
                                                                                                                    <div class="alert-info alert mt-2 mb-0">
                                                                                                                        <span>( 每單位金額*權重 ) + 基本運費 = 總運費</span><br />
                                                                                                                        <span style=""
                                                                                                                            >試算 : ( ${shipmentSetting.weight} * ${dd.shipment_weight} ) +
                                                                                                                            ${shipmentSetting.basic_fee} =
                                                                                                                            ${shipmentSetting.weight * dd.shipment_weight +
                                                                        shipmentSetting.basic_fee}</span
                                                                                                                        >
                                                                                                                    </div>
                                                                                                                </div>`,
                                                                    default: `${(_a = dd.shipment_weight) !== null && _a !== void 0 ? _a : 0}`,
                                                                    placeHolder: '',
                                                                    type: 'number',
                                                                    callback: (text) => {
                                                                        dd.shipment_weight = parseInt(text);
                                                                    },
                                                                });
                                                            })(),
                                                        ].join('')}
                                                                                                </div>
                                                                                            </div>`;
                                                    }, obj.gvc.glitter.getUUID());
                                                })}"
                                                                                >
                                                                                    編輯商品
                                                                                </button>
                                                                            </div>`,
                                                innerHtml: (gvc) => {
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
                            ].join(''));
                        }));
                    },
                    divCreate: {
                        class: 'mx-n3',
                        style: 'overflow: auto',
                    },
                };
            }))}
                            <div class="my-2"></div>
                            ${BgWidget.card(obj.gvc.bindView(() => {
            var _a;
            postMD.seo = (_a = postMD.seo) !== null && _a !== void 0 ? _a : {
                title: '',
                content: '',
            };
            const id = seoID;
            let toggle = false;
            return {
                bind: id,
                view: () => {
                    let view = [
                        html `<div class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2">
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
                        html `<div class="fs-6 fw-500" style="color:#1a0dab;">${postMD.seo.title || '尚未設定'}</div>`,
                        (() => {
                            const href = (() => {
                                const url = new URL('', gvc.glitter.share.editorViewModel.domain ? `https://${gvc.glitter.share.editorViewModel.domain}/` : location.href);
                                url.search = '';
                                url.searchParams.set('page', postMD.template);
                                url.searchParams.set('product_id', postMD.id || '');
                                if (!gvc.glitter.share.editorViewModel.domain) {
                                    url.searchParams.set('appName', window.appName);
                                }
                                return url.href;
                            })();
                            return html `<a class="fs-sm fw-500" style="color:#006621;cursor: pointer;" href="${href}">${href}</a>`;
                        })(),
                        html `<div class="fs-sm fw-500" style="color:#545454;white-space: normal;">${postMD.seo.content || '尚未設定'}</div>`,
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
                },
            };
        }))}
                        </div>
                        <div style="min-width:300px; max-width:100%;">
                            ${BgWidget.card(html ` ${postMD.id ? `${EditorElem.h3('商品ID')}${postMD.id}` : ``}` +
            EditorElem.select({
                gvc: obj.gvc,
                title: '商品狀態',
                def: postMD.status,
                array: [
                    { title: '啟用', value: 'active' },
                    { title: '草稿', value: 'draft' },
                ],
                callback: (text) => {
                    postMD.status = text;
                },
            }))}
                            <div class="mt-2"></div>
                            ${BgWidget.card(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a;
                    return EditorElem.pageSelect(gvc, '選擇佈景主題', (_a = postMD.template) !== null && _a !== void 0 ? _a : '', (data) => {
                        postMD.template = data;
                    }, (dd) => {
                        const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type === 'product';
                        if (filter_result && !postMD.template) {
                            postMD.template = dd.tag;
                            gvc.notifyDataChange([seoID, id]);
                        }
                        return filter_result;
                    });
                },
            };
        }))}
                            <div class="mt-2"></div>
                            ${BgWidget.card(obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            function refresh() {
                obj.gvc.notifyDataChange(id);
            }
            function selectCollection(callback) {
                ApiShop.getCollection().then((res) => {
                    EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                        function convertF(x, ind) {
                            return x
                                .map((dd) => {
                                const indt = ind ? `${ind} / ${dd.title}` : dd.title;
                                if (dd.array && dd.array.length > 0) {
                                    return html ` <li class="btn-group d-flex flex-column" style="margin-top:1px;margin-bottom:1px;">
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
                                        ? html `<i class="fa-sharp fa-regular fa-chevron-down"></i>`
                                        : html ` <i class="fa-regular fa-angle-right hoverBtn "></i>`}
                                                                            </div>
                                                                            ${dd.title}
                                                                            <div class="flex-fill"></div>
                                                                        </div>
                                                                        <ul class="ps-2 ${dd.toogle ? `` : `d-none`}">
                                                                            ${convertF(dd.array, indt)}
                                                                        </ul>
                                                                    </li>`;
                                }
                                else {
                                    return html ` <li class="btn-group d-flex flex-column" style="margin-top:1px;margin-bottom:1px;">
                                                                        <div
                                                                            class="editor_item d-flex   pe-2 my-0 hi  "
                                                                            style=""
                                                                            onclick="${gvc.event(() => {
                                        if (postMD.collection.find((dd) => {
                                            return dd === indt;
                                        })) {
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
                    }, () => { }, 400);
                });
            }
            return {
                bind: id,
                view: () => {
                    return [
                        EditorElem.h3('商品系列'),
                        html `<div class="mx-n3">
                                                    ${EditorElem.arrayItem({
                            gvc: obj.gvc,
                            title: '',
                            array: () => {
                                return postMD.collection.map((dd, index) => {
                                    return {
                                        title: dd || '尚未設定分類名稱',
                                        innerHtml: (gvc) => {
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
        }))}
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
                        dialog.dataLoading({ visible: true });
                        ApiShop.delete({
                            id: postMD.id,
                        }).then((res) => {
                            dialog.dataLoading({ visible: false });
                            if (res.result) {
                                obj.vm.status = 'list';
                            }
                            else {
                                dialog.errorMessage({ text: '刪除失敗' });
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
                    </div> `, 1200)}
        </div>`;
    }
    static putEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiPost.put({
            postData: postMD,
            token: window.parent.config.token,
            type: 'manager',
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `更改成功` });
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
    static postEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiPost.post({
            postData: postMD,
            token: window.parent.config.token,
            type: 'manager',
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                vm.status = 'list';
                dialog.successMessage({ text: `上傳成功` });
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingProductSetting);
