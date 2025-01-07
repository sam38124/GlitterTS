import { BgWidget } from "../../backend-manager/bg-widget.js";
import { Tool } from "../../modules/tool.js";
import { ApiUser } from "../../glitter-base/route/user.js";
import { ShareDialog } from "../../dialog/ShareDialog.js";
export class ProductSetting {
    static showBatchEditDialog(obj) {
        console.log(`obj.selected=>`, obj.selected);
        let stockList = [];
        function getPreviewImage(img) {
            return img || BgWidget.noImageURL;
        }
        const selected = obj.selected;
        const html = String.raw;
        let loading = true;
        let postMD = obj.postMD;
        let topGVC = window.parent.glitter.pageConfig[window.parent.glitter.pageConfig.length - 1].gvc;
        topGVC.glitter.innerDialog((gvc) => {
            function getStockStore() {
                if (stockList.length == 0) {
                    ApiUser.getPublicConfig('store_manager', 'manager').then((storeData) => {
                        if (storeData.result) {
                            stockList = storeData.response.value.list;
                            loading = false;
                            gvc.notifyDataChange('editDialog');
                        }
                    });
                }
            }
            let loading = true;
            let dialog = new ShareDialog(topGVC.glitter);
            let origData = JSON.parse(JSON.stringify(postMD));
            getStockStore();
            return gvc.bindView({
                bind: "editDialog",
                view: () => {
                    const titleLength = 400;
                    const elementLength = 160;
                    if (loading) {
                        dialog.dataLoading({
                            visible: true,
                        });
                        return ``;
                    }
                    dialog.dataLoading({
                        visible: false,
                    });
                    gvc.addStyle(html `
                        .scrollbar-appear::-webkit-scrollbar {
                            width: 10px;
                            height: 10px;
                        }

                        .scrollbar-appear::-webkit-scrollbar-thumb {
                        background: #666;
                        border-radius: 20px;
                        }

                        .scrollbar-appear::-webkit-scrollbar-track {
                        border-radius: 20px;
                        background: #D8D8D8;
                        }
                        .scrollbar-appear{
                        }
                    `);
                    return html `
                        <div class="d-flex flex-column "
                             style="width: 100vw;height:100vh;position: absolute;left: 0;top:0;background-color: white;z-index:1;">
                            <div class="d-flex align-items-center"
                                 style="height: 60px;width: 100vw;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;">
                                <div class="d-flex"
                                     style="padding:19px 32px;gap:8px;cursor: pointer;border-right: solid 1px #DDD;"
                                     onclick="${topGVC.event(() => {
                        postMD = origData;
                        topGVC.glitter.closeDiaLog();
                    })}">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="24"
                                         height="24"
                                         viewBox="0 0 24 24"
                                         fill="none">
                                        <path d="M13.7859 4.96406L8.02969 10.7203C7.69219 11.0578 7.5 11.5219 7.5 12C7.5 12.4781 7.69219 12.9422 8.02969 13.2797L13.7859 19.0359C14.0859 19.3359 14.4891 19.5 14.9109 19.5C15.7875 19.5 16.5 18.7875 16.5 17.9109V15H22.5C23.3297 15 24 14.3297 24 13.5V10.5C24 9.67031 23.3297 9 22.5 9H16.5V6.08906C16.5 5.2125 15.7875 4.5 14.9109 4.5C14.4891 4.5 14.0859 4.66875 13.7859 4.96406ZM7.5 19.5H4.5C3.67031 19.5 3 18.8297 3 18V6C3 5.17031 3.67031 4.5 4.5 4.5H7.5C8.32969 4.5 9 3.82969 9 3C9 2.17031 8.32969 1.5 7.5 1.5H4.5C2.01562 1.5 0 3.51562 0 6V18C0 20.4844 2.01562 22.5 4.5 22.5H7.5C8.32969 22.5 9 21.8297 9 21C9 20.1703 8.32969 19.5 7.5 19.5Z"
                                              fill="#393939"/>
                                    </svg>
                                    返回
                                </div>
                                <div class="flex-fill"
                                     style="padding: 19px 32px;">
                                    編輯
                                    ${selected.length}
                                    個規格
                                </div>
                            </div>
                            <div class="overflow-scroll scrollbar-appear flex-fill" style="padding:24px 32px;">
                                <div class="d-flex " style="margin-bottom:24px;gap:24px;">
                                    ${(() => {
                        let titleArray = [
                            {
                                title: "商品名稱",
                                width: `${elementLength - 24}px`
                            }, {
                                title: "商品規格",
                                width: `${elementLength}px`
                            }, {
                                title: "售價",
                                width: `${elementLength}px`
                            }, {
                                title: "原價",
                                width: `${elementLength}px`
                            }, {
                                title: "成本",
                                width: `${elementLength}px`
                            }, {
                                title: "庫存",
                                width: `${elementLength}px`
                            }, {
                                title: "安全庫存",
                                width: `${elementLength}px`
                            }, {
                                title: "運費計算方式",
                                width: `${elementLength}px`
                            }, {
                                title: "存貨單位(SKU)",
                                width: `${elementLength}px`
                            }, {
                                title: "商品條碼",
                                width: `${elementLength}px`
                            }
                        ];
                        function insertSubStocks(titleArray, subStocks) {
                            const targetIndex = titleArray.findIndex(item => item.title === "庫存");
                            if (targetIndex !== -1) {
                                subStocks.unshift("庫存政策");
                                const formattedSubStocks = subStocks.map(stockTitle => ({
                                    title: stockTitle,
                                    width: titleArray[targetIndex].width
                                }));
                                titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                            }
                            return titleArray;
                        }
                        titleArray = insertSubStocks(titleArray, stockList.map((item) => {
                            return item.name;
                        }));
                        return titleArray.map((title) => {
                            return html `
                                                <div class="d-flex flex-shrink-0"
                                                     style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;">
                                                    ${title.title}
                                                </div>
                                            `;
                        }).join('');
                    })()}
                                </div>
                                ${gvc.bindView(() => {
                        const vm = {
                            id: gvc.glitter.getUUID(),
                        };
                        return {
                            bind: vm.id,
                            view: () => {
                                function cartesianProductSort(arrays) {
                                    const getCombinations = (arrays, index) => {
                                        if (index === arrays.length) {
                                            return [[]];
                                        }
                                        const currentArray = arrays[index];
                                        const nextCombinations = getCombinations(arrays, index + 1);
                                        const currentCombinations = [];
                                        for (const value of currentArray) {
                                            for (const combination of nextCombinations) {
                                                currentCombinations.push([value, ...combination]);
                                            }
                                        }
                                        return currentCombinations;
                                    };
                                    return getCombinations(arrays, 0);
                                }
                                function compareArrays(arr1, arr2) {
                                    if (arr1.length !== arr2.length) {
                                        return false;
                                    }
                                    for (let i = 0; i < arr1.length; i++) {
                                        if (arr1[i] !== arr2[i]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                return postMD.specs[0].option
                                    .map((spec) => {
                                    var _a;
                                    const viewList = [];
                                    spec.expand = (_a = spec.expand) !== null && _a !== void 0 ? _a : true;
                                    postMD.variants = cartesianProductSort(postMD.specs.map((item) => {
                                        return item.option.map((item2) => item2.title);
                                    }))
                                        .map((item) => {
                                        return postMD.variants.find((variant) => {
                                            return compareArrays(variant.spec, item);
                                        });
                                    })
                                        .filter((item) => item !== undefined);
                                    viewList.push(selected
                                        .filter((dd) => {
                                        return dd.spec[0] === spec.title;
                                    })
                                        .map((data, index) => {
                                        const viewID = gvc.glitter.getUUID();
                                        return gvc.bindView({
                                            bind: viewID,
                                            view: () => {
                                                return html `
                                                                                        <div class=""
                                                                                             style="background-color: white;position:relative;display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;gap:24px;"
                                                                                        >
                                                                                            <div class="flex-shrink-0"
                                                                                                 style="width:${elementLength - 24}px;font-size: 16px;font-weight: 400;gap:14px;display: flex;align-items: center;"
                                                                                            >
                                                                                                ${BgWidget.validImageBox({
                                                    gvc,
                                                    image: getPreviewImage(data.preview_image),
                                                    width: 40,
                                                    style: 'border-radius: 10px',
                                                })}
                                                                                                <span>
                                                                                                  ${Tool.truncateString(postMD.title, 6)}</span>
                                                                                            </div>
                                                                                            <div class="flex-shrink-0"
                                                                                                 style="width:${elementLength}px;font-size: 16px;font-weight: 400;gap:14px;display: flex;align-items: center;margin-right: 12px;"
                                                                                            >
                                                                                                ${Tool.truncateString(data.spec.join(' / '), 12)}
                                                                                            </div>
                                                                                            ${['sale_price', 'compare_price', 'cost', 'stock', 'save_stock']
                                                    .filter((dd) => {
                                                    return (dd === 'sale_price' ||
                                                        document.body.clientWidth > 768);
                                                })
                                                    .map((dd) => {
                                                    var _a;
                                                    if (dd === 'stock') {
                                                        let returnHTML = html `
                                                                                                                <div
                                                                                                                        class="d-block flex-shrink-0"
                                                                                                                        style="color:#393939;font-size: 16px;font-weight: 400;width:${elementLength}px;"
                                                                                                                >
                                                                                                                    <select
                                                                                                                            class="form-select"
                                                                                                                            style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                                            onchange="${gvc.event((e) => {
                                                            data.show_understocking = e.value;
                                                        })}"
                                                                                                                    >
                                                                                                                        <option
                                                                                                                                value="true"
                                                                                                                                ${data.show_understocking == 'true' ? `selected` : ``}
                                                                                                                        >
                                                                                                                            追蹤庫存
                                                                                                                        </option>
                                                                                                                        <option
                                                                                                                                value="false"
                                                                                                                                ${data.show_understocking == 'false'
                                                            ? `selected`
                                                            : ``}
                                                                                                                        >
                                                                                                                            不追蹤庫存
                                                                                                                        </option>
                                                                                                                    </select>
                                                                                                                </div>
                                                                                                            `;
                                                        returnHTML += stockList.map((item) => {
                                                            var _a;
                                                            if (!data['stockList']) {
                                                                data['stockList'] = {};
                                                            }
                                                            if (!data['stockList'][item.id]) {
                                                                data['stockList'][item.id] = {
                                                                    count: 0
                                                                };
                                                            }
                                                            return html `
                                                                                                                    <div class="flex-shrink-0"
                                                                                                                         style="color:#393939;font-size: 16px;font-weight: 400;width:${elementLength}px;"
                                                                                                                    >
                                                                                                                        <input
                                                                                                                                style="width: 100%;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                                                                value="${(_a = data['stockList'][item.id].count) !== null && _a !== void 0 ? _a : 0}"
                                                                                                                                min="0"
                                                                                                                                oninput="${gvc.event((e) => {
                                                                const regex = /^[0-9]*$/;
                                                                if (!regex.test(e.value)) {
                                                                    e.value = e.value
                                                                        .replace(/[^0-9]/g, '')
                                                                        .replace(/e/gi, '');
                                                                }
                                                            })}"
                                                                                                                                onchange="${gvc.event((e) => {
                                                                data['stockList'][item.id].count = e.value;
                                                                let count = 0;
                                                                Object.values(data['stockList'])
                                                                    .map((stock) => {
                                                                    count += parseInt(stock.count, 10);
                                                                });
                                                                data['stock'] = count;
                                                                gvc.notifyDataChange(vm.id);
                                                            })}"
                                                                                                                        />
                                                                                                                    </div>`;
                                                        }).join('');
                                                        return returnHTML;
                                                    }
                                                    return html `
                                                                                                            <div class="flex-shrink-0"
                                                                                                                 style="color:#393939;font-size: 16px;font-weight: 400;width:${elementLength}px;"
                                                                                                            >
                                                                                                                <input
                                                                                                                        style="width: 100%;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                                                        value="${(_a = data[dd]) !== null && _a !== void 0 ? _a : 0}"
                                                                                                                        min="0"
                                                                                                                        oninput="${gvc.event((e) => {
                                                        const regex = /^[0-9]*$/;
                                                        if (!regex.test(e.value)) {
                                                            e.value = e.value
                                                                .replace(/[^0-9]/g, '')
                                                                .replace(/e/gi, '');
                                                        }
                                                    })}"
                                                                                                                        onchange="${gvc.event((e) => {
                                                        data[dd] = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    })}"
                                                                                                                />
                                                                                                            </div>`;
                                                })
                                                    .join('')}
                                                                                            <div
                                                                                                    class="d-block flex-shrink-0"
                                                                                                    style="color:#393939;font-size: 16px;font-weight: 400;width:${elementLength}px;"
                                                                                            >
                                                                                                <select
                                                                                                        class="form-select"
                                                                                                        style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                        onchange="${gvc.event((e) => {
                                                    data.shipment_type = e.value;
                                                })}"
                                                                                                >
                                                                                                    <option
                                                                                                            value="none"
                                                                                                            ${data.shipment_type == 'none' ? `selected` : ``}
                                                                                                    >
                                                                                                        無運費
                                                                                                    </option>
                                                                                                    <option
                                                                                                            value="volume"
                                                                                                            ${data.shipment_type == 'volume'
                                                    ? `selected`
                                                    : ``}
                                                                                                    >
                                                                                                        依材積
                                                                                                    </option>
                                                                                                    <option
                                                                                                            value="weight"
                                                                                                            ${data.shipment_type == 'weight'
                                                    ? `selected`
                                                    : ``}
                                                                                                    >
                                                                                                        依重量
                                                                                                    </option>
                                                                                                </select>
                                                                                            </div>
                                                                                            ${['sku', 'barcode']
                                                    .filter((dd) => {
                                                    return (dd === 'sale_price' ||
                                                        document.body.clientWidth > 768);
                                                })
                                                    .map((dd) => {
                                                    var _a;
                                                    return html `
                                                                                                            <div class="flex-shrink-0"
                                                                                                                 style="color:#393939;font-size: 16px;font-weight: 400;width:${elementLength}px;"
                                                                                                            >
                                                                                                                <input
                                                                                                                        style="width: 100%;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                                                        value="${(_a = data[dd]) !== null && _a !== void 0 ? _a : 0}"
                                                                                                                        min="0"

                                                                                                                        onchange="${gvc.event((e) => {
                                                        data[dd] = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    })}"
                                                                                                                />
                                                                                                            </div>`;
                                                })
                                                    .join('')}
                                                                                        </div>
                                                                                    `;
                                            },
                                            divCreate: {
                                                class: `w-100 ${viewID} `,
                                            },
                                        });
                                    })
                                        .join(''));
                                    return viewList.join('');
                                })
                                    .join('');
                            },
                            divCreate: {},
                        };
                    })}
                            </div>
                            <div class="w-100 justify-content-end d-flex "
                                 style="padding:14px 16px;gap:14px;">
                                ${BgWidget.cancel(gvc.event(() => {
                        postMD = origData;
                        topGVC.glitter.closeDiaLog();
                    }))}
                                ${BgWidget.save(gvc.event(() => {
                        topGVC.glitter.closeDiaLog();
                        if (obj.callback) {
                            obj.callback();
                        }
                    }))}
                            </div>
                        </div>
                    `;
                },
                divCreate: {},
                onCreate: () => {
                }
            });
        }, "batchEdit");
    }
}
