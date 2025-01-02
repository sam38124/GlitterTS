import {GVC} from '../glitterBundle/GVController.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {DataAnalyzeModule, DataAnalyzeModuleCart} from "./data-analyze-module.js";

const html = String.raw;

export class DataAnalyze {
    public static main(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm: {
                loading: boolean;
                data: any;
                filter_date:'week'|'year'|'custom';
                come_from:'all'|'website'|'store';
                switch:boolean
            } = {
                loading: true,
                data: {},
                filter_date:'week',
                come_from:'all',
                switch:false
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


            return {
                bind: id,
                view: () => {
                    try {
                        return html`
                            ${BgWidget.title('營運分析')}
                            <div class="my-3"></div>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    ${DataAnalyzeModuleCart.filterCart(gvc,vm,()=>{
                                        gvc.notifyDataChange(id)
                                    })}
                                </div>
                                ${[
                                    DataAnalyzeModule.salesAmount(gvc,vm),
                                    DataAnalyzeModule.orderAmount(gvc,vm),
                                    DataAnalyzeModule.orderAverage(gvc,vm),
                                    DataAnalyzeModule.viewPeople(gvc),
                                    DataAnalyzeModule.registerPeople(gvc),
                                    DataAnalyzeModule.transferRatio(gvc)
                                ].map((dd) => {
                                    return `<div class="col-12 col-lg-4 col-md-6 mb-3">${dd}</div>`
                                }).join('')}
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
