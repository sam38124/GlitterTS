import {GVC} from '../glitterBundle/GVController.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {DataAnalyzeModule, DataAnalyzeModuleCart, GlobalStyle} from "./data-analyze-module.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

const html = String.raw;

export class DataAnalyze {
    public static main(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm: {
                loading: boolean;
                data: any;
                filter_date: 'week' | 'year' | 'custom' | 'today';
                come_from: 'all' | 'website' | 'store';
                switch: boolean
            } = {
                loading: true,
                data: {},
                filter_date: 'week',
                come_from: 'all',
                switch: false
            };

            gvc.glitter.addMtScript(
                [
                    {
                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1714105121170-apexcharts.min.js',
                    },
                ],
                () => {
                },
                () => {
                }
            );

            const vm_f: any = {
                filter: 'count'
            }
            return {
                bind: id,
                view: () => {
                    try {
                        return html`
                            ${BgWidget.title('商品分析')}
                            <div class="my-3"></div>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    ${DataAnalyzeModuleCart.filterCartV2(gvc, vm, () => {
                                        gvc.notifyDataChange(id)
                                    })}
                                </div>
                                <div class="col-12 mb-3">
                                    ${BgWidget.card([
                                        html`
                                            <div class="d-flex flex-column" style="gap:10px;">
                                                <div style="${GlobalStyle.header_title}">排行分析</div>
                                                <div class="d-flex align-items-center" style="gap:10px;">
                                                    <div class="" style="white-space: nowrap;">排序方式</div>
                                                    ${BgWidget.select({
                                                        gvc: gvc,
                                                        callback: (come_from) => {
                                                            vm_f.filter = come_from
                                                            gvc.notifyDataChange(id)
                                                        },
                                                        default: vm_f.filter ,
                                                        options: [
                                                            {
                                                                key: 'count', value: '依據銷量'
                                                            },
                                                            {
                                                                key: 'price', value: '依據銷售額'
                                                            }
                                                        ]
                                                    })}
                                                </div>
                                            </div>`,
                                        BgWidget.tableV3({
                                            gvc: gvc,
                                            getData: (vmi) => {
                                                const limit = 20;
                                                ApiShop.ecDataAnalyze(
                                                        'hot_products_all'.split(
                                                                ','
                                                        ),
                                                        vm.filter_date
                                                ).then((data: any) => {
                                                    function getDatalist() {
                                                        return data.response.hot_products_all.product_list.sort((a: any, b: any) => {
                                                            if(vm_f.filter==='count'){
                                                                return (a.count < b.count ? 1 : -1)
                                                            }else{
                                                                return (a.sale_price < b.sale_price ? 1 : -1)
                                                            }
                                                        }).filter((dd:any)=>{
                                                            if(vm.come_from==='store'){
                                                                return dd.pos_info
                                                            } else if(
                                                              vm.come_from==='website'  
                                                            ){
                                                                return  !dd.pos_info
                                                            }else{
                                                                return  true
                                                            }
                                                        }).map((dd: any, index: number) => {
                                                            return [
                                                                {
                                                                    key: 'No.',
                                                                    value: html`<span class="fs-7">${index + 1}
                                                                        .</span>`,
                                                                },
                                                                {
                                                                    key: '商品',
                                                                    value: `<div class="d-flex align-items-center" style="gap:10px;">
<img src="${dd.preview_image}" style="width:35px;height: 35px;" class="rounded-3">
${dd.title}</div>`,
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
                                                })
                                            },
                                            rowClick: (data, index) => {
                                            },
                                            filter: [],
                                        })
                                    ].join('<div class="my-3 w-100 border-top"></div>'))}
                                </div>
                            </div>
                        `;
                    } catch (e) {
                        console.log(e)
                        return `${e}`
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

function getPastMonths(numMonths: number): string[] {
    const months: string[] = [];
    const currentDate = new Date();
    let year = currentDate.getFullYear() - 2000; // 取年份後兩位
    let month = currentDate.getMonth() + 2; // 月份從0開始，並往後一個月，所以加2

    for (let i = 0; i < numMonths; i++) {
        month--; // 每次迴圈減少一個月
        if (month === 0) {
            year--; // 如果月份減至0，則回到上一年
            month = 12; // 調整為12月
        }
        const formattedMonth = `${year}.${month.toString().padStart(2, '0')}`; // 格式化為兩位數字的月份
        months.unshift(formattedMonth); // 新增到陣列開頭
    }

    return months;
}

function getPastDays(numDays: number) {
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < numDays; i++) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        const month = pastDate.getMonth() + 1; // 月份從0開始，所以要加1
        const day = pastDate.getDate();
        const dateString = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
        days.unshift(dateString); // 將日期添加到陣列的開頭
    }

    return days;
}

(window as any).glitter.setModule(import.meta.url, DataAnalyze);