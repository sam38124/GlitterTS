import { ApiShop } from '../glitter-base/route/shopping.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { DataAnalyzeModuleCart, GlobalStyle } from './data-analyze-module.js';
const html = String.raw;
export class DataAnalyze {
    static main(gvc) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm = {
                loading: true,
                data: {},
                filter_date: 'week',
                come_from: 'all',
                switch: false,
                startDate: '',
                endDate: '',
            };
            gvc.glitter.addMtScript([
                {
                    src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1714105121170-apexcharts.min.js',
                },
            ], () => { }, () => { });
            const vm_f = {
                filter: 'count',
            };
            return {
                bind: id,
                view: () => {
                    try {
                        return html `
                            ${BgWidget.title('商品分析')}
                            <div class="my-3"></div>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    ${DataAnalyzeModuleCart.filterCartV2(gvc, vm, () => {
                            gvc.notifyDataChange(id);
                        })}
                                </div>
                                <div class="col-12 mb-3">
                                    ${BgWidget.card([
                            html ` <div class="d-flex flex-column" style="gap:10px;">
                                                <div style="${GlobalStyle.header_title}">排行分析</div>
                                                <div class="d-flex align-items-center" style="gap:10px;">
                                                    <div class="" style="white-space: nowrap;">排序方式</div>
                                                    ${BgWidget.select({
                                gvc: gvc,
                                callback: (come_from) => {
                                    vm_f.filter = come_from;
                                    gvc.notifyDataChange(id);
                                },
                                default: vm_f.filter,
                                options: [
                                    {
                                        key: 'count',
                                        value: '依據銷量',
                                    },
                                    {
                                        key: 'price',
                                        value: '依據銷售額',
                                    },
                                ],
                            })}
                                                </div>
                                            </div>`,
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: (vmi) => {
                                    const limit = 20;
                                    const queryJsonString = () => {
                                        return JSON.stringify({
                                            come_from: vm.come_from,
                                            filter_date: vm.filter_date,
                                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                                        });
                                    };
                                    ApiShop.ecDataAnalyze('hot_products_all'.split(','), queryJsonString()).then((data) => {
                                        function getDatalist() {
                                            return data.response.hot_products_all.product_list
                                                .sort((a, b) => {
                                                if (vm_f.filter === 'count') {
                                                    return a.count < b.count ? 1 : -1;
                                                }
                                                else {
                                                    return a.sale_price < b.sale_price ? 1 : -1;
                                                }
                                            })
                                                .filter((dd) => {
                                                if (vm.come_from === 'store') {
                                                    return dd.pos_info;
                                                }
                                                else if (vm.come_from === 'website') {
                                                    return !dd.pos_info;
                                                }
                                                else {
                                                    return true;
                                                }
                                            })
                                                .map((dd, index) => {
                                                return [
                                                    {
                                                        key: 'No.',
                                                        value: html `<span class="fs-7">${index + 1} .</span>`,
                                                    },
                                                    {
                                                        key: '商品',
                                                        value: html `<div class="d-flex align-items-center" style="gap:10px;">
                                                                                <img src="${dd.preview_image}" style="width:35px;height: 35px;" class="rounded-3" />
                                                                                ${dd.title}
                                                                            </div>`,
                                                    },
                                                    {
                                                        key: '銷售額',
                                                        value: dd.sale_price.toLocaleString(),
                                                    },
                                                    {
                                                        key: '銷量',
                                                        value: dd.count,
                                                    },
                                                ];
                                            });
                                        }
                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                        vmi.tableData = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => { },
                                filter: [],
                            }),
                        ].join('<div class="my-3 w-100 border-top"></div>'))}
                                </div>
                            </div>
                        `;
                    }
                    catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
                divCreate: {
                    class: `mx-auto`,
                    style: `width:100%;`,
                },
            };
        });
    }
}
function getPastMonths(numMonths) {
    const months = [];
    const currentDate = new Date();
    let year = currentDate.getFullYear() - 2000;
    let month = currentDate.getMonth() + 2;
    for (let i = 0; i < numMonths; i++) {
        month--;
        if (month === 0) {
            year--;
            month = 12;
        }
        const formattedMonth = `${year}.${month.toString().padStart(2, '0')}`;
        months.unshift(formattedMonth);
    }
    return months;
}
function getPastDays(numDays) {
    const days = [];
    const currentDate = new Date();
    for (let i = 0; i < numDays; i++) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        const month = pastDate.getMonth() + 1;
        const day = pastDate.getDate();
        const dateString = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
        days.unshift(dateString);
    }
    return days;
}
window.glitter.setModule(import.meta.url, DataAnalyze);
