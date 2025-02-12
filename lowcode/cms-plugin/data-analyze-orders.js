import { BgWidget } from '../backend-manager/bg-widget.js';
import { DataAnalyzeModule, DataAnalyzeModuleCart } from './data-analyze-module.js';
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
            return {
                bind: id,
                view: () => {
                    try {
                        return html `
                            ${BgWidget.title('營運分析')}
                            <div class="my-3"></div>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    ${DataAnalyzeModuleCart.filterCart(gvc, vm, () => {
                            gvc.notifyDataChange(id);
                        })}
                                </div>
                                ${[
                            DataAnalyzeModule.salesAmount(gvc, vm),
                            DataAnalyzeModule.orderAmount(gvc, vm),
                            DataAnalyzeModule.orderAverage(gvc, vm),
                            DataAnalyzeModule.viewPeople(gvc, vm),
                            DataAnalyzeModule.registerPeople(gvc, vm),
                            DataAnalyzeModule.transferRatio(gvc, vm)
                        ]
                            .map((dd) => {
                            return html `<div class="col-12 col-lg-4 col-md-6 mb-3 px-2">${dd}</div>`;
                        })
                            .join('')}
                                ${[DataAnalyzeModule.hotProducts(gvc),
                            DataAnalyzeModule.hotCollection(gvc)].map((dd) => {
                            return html `<div class="col-12 col-lg-6 col-md-6 mb-3 px-2">${dd}</div>`;
                        })
                            .join('')}
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
